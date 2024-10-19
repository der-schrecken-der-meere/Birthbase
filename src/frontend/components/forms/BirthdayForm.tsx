import { useCallback, useRef } from 'react'

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
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    FormMethod,
    close,
} from "@/frontend/store/dataForm/dataFormSlice";
import {
    addData,
    deleteData,
    updateData,
} from "@/frontend/store/data/dataSlice";
import { RootState } from '@/frontend/store/store';

// Shadcn UI
import { Button } from '@/frontend/components/ui/button';
import { Calendar } from '@/frontend/components/ui/calendar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from '@/frontend/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/frontend/components/ui/popover';

// Database
import { db } from "@/database/database_exports";
import { Birthday } from '@/database/tables/birthday';
import { useToastNotification } from '@/frontend/contexts/toastContext';
import { useConfirm } from '@/frontend/contexts/confirmContext';
import { Checkbox } from '../ui/checkbox';

const formSchema = z.object({
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
    })
    .min(3, {
        message: "Nachname muss mindestens 3 Buchstaben haben",
    }),
    date: z.coerce.date({
        message: "Falsches Datumsformat",
    })
    .max(new Date(), {
        message: "Datum liegt in der Zukunft",
    }),
    marked: z.coerce.boolean(),
});

type T_Form = z.infer<typeof formSchema>

type AllMethods = FormMethod|"delete";

const BirthdayForm = () => {
    const dispatch = useDispatch();
    const { setErrorNotification, setSuccessNotification } = useToastNotification();
    const { setConfirm } = useConfirm();

    const birthday = useSelector((state: RootState) => state.dataForm.value);
    const method = useSelector((state: RootState) => state.dataForm.method);

    const methodRef = useRef<AllMethods>(method);

    const form = useForm<T_Form>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: birthday.id,
            firstname: birthday.name.first,
            lastname: birthday.name.last,
            date: birthday.date as unknown as Date,
            marked: false,
        }
    });

    const onAddUpdateClick = useCallback(() => {
        methodRef.current = method;
    }, [method]);

    const onDeleteClick = useCallback(() => {
        methodRef.current = "delete";
    }, []);

    const onSubmit: SubmitHandler<T_Form> = async (data) => {
        try {
            const offset = data.date.getTimezoneOffset();
            data.date.setMinutes(data.date.getMinutes() - offset);
            const newObj: Birthday = {...birthday, ...{
                id: data.id,
                name: {
                    first: data.firstname,
                    last: data.lastname,
                },
                date: data.date.toISOString(),
                marked: data.marked,
            }}
            console.log(method, newObj);
            switch (methodRef.current) {
                case "add":
                    let { id, ...no_id } = newObj;
                    let add_response = await db.create("birthdays", no_id);
                    newObj.id = add_response.id;
                    dispatch(addData(newObj));
                    setSuccessNotification({
                        title: "Erfolgreich",
                        description: (
                            <>
                                Der Geburtstag wurde erstellt
                                <pre>
                                    <code>{JSON.stringify(no_id, null, 2)}</code>
                                </pre>
                            </>
                        )
                    })
                    break;
                case "delete":
                    setConfirm({
                        title: "Sind Sie wirklich sicher?",
                        description: "Der Geburtstag wird gelöscht und danach nicht mehr angezeigt.",
                        onConfirm: async () => {
                            await db.Delete("birthdays", newObj.id);
                            dispatch(deleteData(newObj.id));
                            setSuccessNotification({
                                title: "Erfolgreich",
                                description: (
                                    <>
                                        Der Geburtstag wurde gelöscht.
                                        <pre>
                                            <code>{JSON.stringify(newObj, null, 2)}</code>
                                        </pre>
                                    </>
                                ),
                            });
                        }
                    })
                    break;
                case "update":
                    await db.update("birthdays", newObj);
                    dispatch(updateData(newObj));
                    setSuccessNotification({
                        title: "Erfolreich",
                        description: (
                            <>
                                Der Geburtstag wurde geändert
                                <pre>
                                    <code>{JSON.stringify(newObj, null, 2)}</code>
                                </pre>
                            </>
                        )
                    })
                break;
                default:
                    break;
            }
            dispatch(close());
        } catch (e) {
            console.error(e);
            setErrorNotification({
                title: "Operation fehlgeschlagen",
                description: (
                    <>
                        Geburtstag konnte nicht gelöscht werden
                        <div>Fehler: {e as string}</div>
                    </>
                ),
            })
            form.setError("root.serverError", {
                type: (e as unknown as any).msg,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Vorname</FormLabel>
                            <FormControl>
                                <Input placeholder="Max" {...field}/>
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
                                <Input placeholder="Mustermann" {...field}/>
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
                            <Popover modal>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        locale={de}
                                        fromYear={1900}
                                        toYear={new Date().getFullYear()}
                                        captionLayout="dropdown-buttons"
                                        fixedWeeks={true}
                                        className=""
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => 
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
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
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
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
                <div className='flex items-center'>
                    <Button className="min-w-min w-20" onClick={onAddUpdateClick} disabled={form.formState.isSubmitting} type="submit" variant="outline">
                        {
                            form.formState.isSubmitting ? (
                                <TailSpin
                                    color='currentColor'
                                    height={16}
                                    width={16}
                                />
                            ) : (
                                method === "add" ? "Hinzufügen" : "Ändern"
                            )
                        }
                    </Button>
                    {(method === "update") && <Button disabled={form.formState.isSubmitting} onClick={onDeleteClick} type="submit" variant="destructive" className="ml-auto min-w-min w-20">
                        {
                            form.formState.isSubmitting ? (
                                <TailSpin
                                    color='currentColor'
                                    height={16}
                                    width={16}
                                />
                            ) : (
                                "Löschen"
                            )
                        }
                    </Button>}
                </div>
                
            </form>
        </Form>
    )
}

export default BirthdayForm;