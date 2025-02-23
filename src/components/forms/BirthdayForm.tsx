import { useCallback, useMemo, useRef } from 'react'

// React Date
import { format } from "date-fns";
import { de, enGB } from "date-fns/locale";

// React Forms
import {
    SubmitHandler,
    useForm
} from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { use_birthday_mutation } from '@/hooks/use_birthday_mutation';
import { BirthdayFormMode, use_birthday_form } from '@/hooks/use_birthday_form';

// Util functions
import { cn } from '@/lib/utils';
import { format_date_to_iso_midnight } from '@/lib/intl/date';
import { CalendarDays } from 'lucide-react';
import { PulseLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';

type FormMethod = "create"|"update"|"delete"|"read";

const BirthdayForm = () => {

    const { t, i18n } = useTranslation(["birthday_form", "generally", "toast_msg"]);

    const formSchema = useMemo(() => {
        return z.object({
            id: z.number(),
            firstname: z.string({
                required_error: t("first_name_required_error"),
                invalid_type_error: t("first_name_type_error"),
            })
            .min(1, {
                message: t("first_name_required_error"),
            }),
            lastname: z.string({
                required_error: t("last_name_required_error"),
                invalid_type_error: t("last_name_type_error"),
            }),
            date: z.coerce.date({
                message: t("date_format_error"),
            }),
            marked: z.coerce.boolean(),
        });
    }, [t]);

    type T_Form = z.infer<typeof formSchema>

    const date_picker_lang = useMemo(() => {
        switch (i18n.language) {
            case "de":
                return de;
            case "en":
                return enGB;
        }
    }, [t]);

    const set_open = use_birthday_form((state) => state.set_open);
    const set_operation = use_birthday_form((state) => state.set_operation);
    const operation = use_birthday_form((state) => state.operation);
    const birthday = use_birthday_form((state) => state.birthday);

    const methodRef = useRef<FormMethod>("create");

    const {
        add_birthday,
        update_birthday,
        delete_birthday,
    } = use_birthday_mutation({
        add: {
            onSuccess: () => {
                set_open(false);
            }
        },
        remove: {
            onSuccess: () => {
                set_open(false);
            }
        },
        update: {
            onSuccess: () => {
                set_open(false);
            }
        }
    });

    const form = useForm<T_Form>({
        resolver: zodResolver(formSchema),
        defaultValues: (() => {
            return {
                id: birthday.id,
                firstname: birthday.name.first,
                lastname: birthday.name.last,
                date: birthday.date as unknown as Date,
                marked: birthday.marked,
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
        set_operation(BirthdayFormMode.UPDATE);
        methodRef.current = "read";
    }, []);

    const Buttons = useMemo(() => {
        if (operation === BirthdayFormMode.CREATE) {
            return (
                <SubmitButton isSubmitting={form.formState.isSubmitting} onClick={onAddClick}>
                    {t("add_btn", { ns: "generally" })}
                </SubmitButton>
            );
        }
        return (
            <>
                {operation === BirthdayFormMode.READ
                    ?
                        <SubmitButton isSubmitting={form.formState.isSubmitting} onClick={onReadClick}>
                           {t("edit_btn", { ns: "generally" })}
                        </SubmitButton>
                    :
                        <SubmitButton isSubmitting={form.formState.isSubmitting} disabled={!form.formState.isDirty} onClick={onUpdateClick}>
                            {t("change_btn", { ns: "generally" })}
                        </SubmitButton>
                }
                
                <SubmitButton isSubmitting={form.formState.isSubmitting} onClick={onDeleteClick} variant="destructive" className='ml-auto'>
                    {t("delete_btn", { ns: "generally" })}
                </SubmitButton>
            </>
        );
    }, [operation, form.formState.isDirty]);

    const onSubmit: SubmitHandler<T_Form> = async (data) => {
        if (methodRef.current === "read") {
            return
        }
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
            
            switch (methodRef.current) {
                case "create":
                    add_birthday(newObj);
                    break;
                case "delete":
                    delete_birthday(newObj);
                    break;
                case "update":
                    update_birthday(newObj);
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
                <fieldset className="space-y-8" disabled={operation === BirthdayFormMode.READ}>
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>{t("first_name_title")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("first_name_placeholder")} className='text-sm' {...field}/>
                                </FormControl>
                                <FormDescription>
                                    {t("first_name_description")}
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
                                <FormLabel>{t("last_name_title")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("last_name_placeholder")} className='text-sm' {...field}/>
                                </FormControl>
                                <FormDescription>
                                    {t("last_name_description")}
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
                                <FormLabel>{t("date_title")}</FormLabel>
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
                                                    <span>{t("date_placeholder")}</span>
                                                )}
                                                <CalendarDays className='ml-1 h-4 w-4 opacity-50' />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start" >
                                        <Calendar
                                            locale={date_picker_lang}

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
                                    {t("date_description")}
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
                ? <PulseLoader
                    color='hsl(var(--destructive-foreground))'
                    size="0.5rem"
                />
                : children
            }
        </Button>
    )
}

export default BirthdayForm;