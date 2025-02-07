import { useCallback, useMemo, useRef } from 'react'

// React Date
import { format } from "date-fns";
import { de } from "date-fns/locale";

// React Forms
import {
    SubmitHandler,
    useForm
} from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React Icons
import { MdCalendarMonth } from "react-icons/md";

// React Loader
import { TailSpin } from "react-loader-spinner";

// React Redux
// import {
//     useDispatch,
//     useSelector
// } from 'react-redux';
// import {
//     FormMethod,
//     close,
// } from "@/frontend/store/dataForm/dataFormSlice";
// import { RootState } from '@/frontend/store/store';

// Shadcn UI
import { Button, ButtonProps } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from '../ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover';
import { Checkbox } from '../ui/checkbox';

// Database
import { Birthday, getDefaultBirthday } from '@/database/tables/birthday/birthdays';

// Hooks
import { useAppToast } from '../../hooks/useAppToast';
// import { useDeleteBirthdays } from '@/components/hooks/useDeleteBirthday';

// Queries
import { add_birthday_query, upd_birthday_query } from '@/features/manage_birthdays/query';

// Util functions
import { useDeleteBirthdays } from '@/hooks/useDeleteBirthday';
import { useBirthdayForm } from '@/hooks/useBirthdayForm';
import { cn } from '@/lib/utils';
import { format_date_to_iso_midnight } from '@/lib/intl/date';

type FormMethod = "create"|"update"|"delete"|"read";

const BirthdayForm = () => {
    const formSchema = useMemo(() => {
        // const curDate = new Date();
        // curDate.setHours(23, 59, 59, 999);
        return z.object({
            id: z.number(),
            firstname: z.string({
                required_error: "Vorname muss gefüllt sein",
                invalid_type_error: "Vorname muss ein String sein",
            })
            .min(3, {
                message: "Vorname muss mindestens 3 Buchstaben haben",
            }),
            lastname: z.string({
                required_error: "Nachname muss gefüllt sein",
                invalid_type_error: "Nachname muss ein String sein",
            }),
            date: z.coerce.date({
                message: "Falsches Datumsformat",
            })
            // .max(curDate, {
            //     message: "Datum liegt in der Zukunft",
            // })
            ,
            marked: z.coerce.boolean(),
        });
    }, []);

    type T_Form = z.infer<typeof formSchema>

    // const dispatch = useDispatch();
    const { setErrorNotification, setSuccessNotification } = useAppToast();
    const { close, operation, data, setOperation } = useBirthdayForm();

    const { mutate: add } = add_birthday_query();

    const methodRef = useRef<FormMethod>("create");

    const { deleteBirthday } = useDeleteBirthdays({
        onSuccess: () => {
            close();
        }
    })

    const { mutate: update } = upd_birthday_query();

    console.log(data.date);

    const form = useForm<T_Form>({
        resolver: zodResolver(formSchema),
        defaultValues: (() => {
            return {
                id: data.id,
                firstname: data.name.first,
                lastname: data.name.last,
                date: data.date as unknown as Date,
                marked: data.marked,
            };
        })(),
        // disabled: operation === "read",
    });

    const onAddClick = useCallback(() => {
        methodRef.current = "create";
    }, []);

    const onUpdateClick = useCallback(() => {
        methodRef.current = "update";
    }, []);

    const onDeleteClick = useCallback(() => {
        methodRef.current = "delete";
    }, []);

    const onReadClick = useCallback(() => {
        setOperation("update");
        methodRef.current = "read";
    }, []);

    const Buttons = useMemo(() => {
        if (operation === "create") {
            return (
                <SubmitButton isSubmitting={form.formState.isSubmitting} onClick={onAddClick}>
                    Hinzufügen
                </SubmitButton>
            );
        }
        return (
            <>
                {operation === "read"
                    ?
                        <SubmitButton isSubmitting={form.formState.isSubmitting} onClick={onReadClick}>
                            Bearbeiten
                        </SubmitButton>
                    :
                        <SubmitButton isSubmitting={form.formState.isSubmitting} disabled={!form.formState.isDirty} onClick={onUpdateClick}>
                            Ändern
                        </SubmitButton>
                }
                
                <SubmitButton isSubmitting={form.formState.isSubmitting} onClick={onDeleteClick} variant="destructive" className='ml-auto'>
                    Löschen
                </SubmitButton>
            </>
        );
    }, [operation, form.formState.isDirty]);

    const onSubmit: SubmitHandler<T_Form> = async (data) => {
        if (methodRef.current === "read") {
            return
        }
        console.log(new Date(+data.date));
        try {
            const newObj: Birthday = {...getDefaultBirthday(), ...{
                id: data.id,
                name: {
                    first: data.firstname,
                    last: data.lastname,
                },
                date: format_date_to_iso_midnight("de", "Europe/Berlin", data.date),
                marked: data.marked,
            }}

            console.log(newObj, data.date, format_date_to_iso_midnight("de", "Europe/Berlin", new Date(newObj.date)));

            switch (methodRef.current) {
                case "create":
                    add(newObj, {
                        onSuccess: () => {
                            setSuccessNotification({
                                title: "Erfolgreich",
                                description: "Der Geburstag wurde gespeichert"
                            })
                            close();
                        },
                        onError: (error) => {
                            setErrorNotification({
                                title: "Fehler beim Speichern des Geburtstages",
                                description: JSON.stringify(error),
                            })
                        }
                    });
                    break;
                case "delete":
                    deleteBirthday(newObj);
                    break;
                case "update":
                    update(newObj, {
                        onSuccess: () => {
                            setSuccessNotification({
                                title: "Erfolgreich",
                                description: "Der Geburtstag wurde geändert",
                            })
                            close();
                        },
                        onError: (error) => {
                            setErrorNotification({
                                title: "Fehler beim Ändern des Geburtstages",
                                description: JSON.stringify(error),
                            })
                        },
                    })
                break;
                default:
                    break;
            }
        } catch (e) {
            console.error(e);
            form.setError("root.serverError", {
                type: (e as unknown as any).msg,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <fieldset className="space-y-8" disabled={operation === "read"}>
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Vorname</FormLabel>
                                <FormControl>
                                    <Input placeholder="Max" className='text-sm' {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Der Vorname der Person
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nachname</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mustermann" className='text-sm' {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Der Nachname der Person
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Datum</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                disabled={field.disabled}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Datum auswählen</span>
                                                )}
                                                <MdCalendarMonth size={16} opacity={0.5} />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                        <Calendar
                                            locale={de}

                                            // timeZone={timezone}

                                            // fromYear={1900}
                                            startMonth={new Date(1900, 0)}

                                            // toYear={new Date().getFullYear() + 100}
                                            endMonth={new Date(new Date().getFullYear() + 100, 11)}

                                            // captionLayout="dropdown-buttons"
                                            captionLayout="dropdown"

                                            fixedWeeks
                                            showWeekNumber
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => {
                                                return date < new Date("1900-01-01")
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Das Datum des Geburtstages
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="marked"
                        render={({field}) => (
                            <FormItem className='flex items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={!field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={field.disabled}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Auf der Startseite anzeigen
                                    </FormLabel>
                                    <FormDescription>
                                        Zeigt den Geburtstag an, wenn er kurz bevorsteht
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="id"
                        render={({field}) => (
                            <FormControl>
                                <Input type="hidden" {...field}/>
                            </FormControl>
                        )}
                    />
                </fieldset>
                <div className='flex items-center'>
                    {Buttons}
                </div>
            </form>
        </Form>
    )
}

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
    isSubmitting: boolean,
};

const SubmitButton = ({
    variant = "outline",
    children,
    isSubmitting,
    className,
    ...props
}: SubmitButtonProps) => {
    return (
        <Button variant={variant} {...props} type="submit" className={cn("min-w-min w-20", className)}>
            {isSubmitting
                ? <TailSpin
                    color='currentColor'
                    height={16}
                    width={16}
                />
                : children
            }
        </Button>
    )
}

export default BirthdayForm;