import type { Matcher } from 'react-day-picker';

import { type ButtonProps, Button } from '../ui/button';
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { PulseLoader } from 'react-spinners';
import { BellPlus, CalendarDays, X } from 'lucide-react';

import { BirthdayFormMode, useBirthdayFormStore } from '@/stores/use_birthday_form_store';

import { useTranslation } from 'react-i18next';
import { useBirthdayForm } from '@/hooks/use_birthday_form';

import { type Birthday, getDefaultBirthday } from '@/database/tables/birthday/birthdays';
import { z } from "zod";
import { format } from "date-fns";
import { de, enGB } from "date-fns/locale";
import { cn } from '@/lib/utils';
import { midnight_utc } from '@/lib/functions/date';
import { ControllerRenderProps, useFieldArray } from 'react-hook-form';
import { ReactNode } from 'react';

const BirthdayForm = () => {

    const { t, i18n } = useTranslation(["birthday_form", "generally"]);

    const formSchema = z.object({
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
        reminders: z.array(z.object({
            reminder: z.coerce.number({
                invalid_type_error: t("reminder_type_error"),
            })
            .min(1, {
                message: t("reminder_to_low_error"),
            }),
        })),
    });
    
    const { form, onSubmit, changeMethod } = useBirthdayForm({
        form_schema: formSchema,
        on_submit: (data) => {
            const { reminders, id, date, firstname, lastname } = data;
            const reminder = reminders.reduce<number[]>((acc, cur) => {
                const { reminder } = cur;
                acc.push(reminder);
                return acc;
            }, []);
            const newObj: Birthday = {...getDefaultBirthday(), ...{
                id,
                name: {
                    first: firstname,
                    last: lastname,
                },
                timestamp: midnight_utc(+date),
                reminder,
            }};
            return newObj;
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        /** @ts-ignore */
        name: "reminders",
    });
    // React day picker config
    const start_month = new Date(1900, 0);
    const end_month = new Date(new Date().getFullYear() + 100, 11);
    const disabled: Matcher = (date) => {
        return date < new Date("1900-01-01");
    };
    const date_picker_lang = (() => {
        switch (i18n.language) {
            case "de":
                return de;
            case "en":
                return enGB;
        }
    })();

    const onAddReminder = () => {
        append({
            reminder: 20,
        });
    };
    const onRemoveReminder = (index: number) => {
        console.log(index);
        remove(index);
    };

    // Handle which submit request will be send
    const setFormMode = useBirthdayFormStore((state) => state.setFormMode);
    const formMode = useBirthdayFormStore((state) => state.formMode);
    
    const onAddClick    = () => changeMethod("create");
    const onUpdateClick = () => changeMethod("update");
    const onDeleteClick = () => changeMethod("delete");
    const onReadClick   = () => {
        setFormMode(BirthdayFormMode.UPDATE);
        changeMethod("read");
    };

    const Buttons = (() => {
        if (formMode === BirthdayFormMode.CREATE) {
            return (
                <SubmitButton
                    isSubmitting={form.formState.isSubmitting}
                    onClick={onAddClick}
                >
                    {t("add_btn", { ns: "generally" })}
                </SubmitButton>
            );
        }
        let left_btn = (
            <SubmitButton
                isSubmitting={form.formState.isSubmitting}
                disabled={!form.formState.isDirty}
                onClick={onUpdateClick}
            >
                {t("change_btn", { ns: "generally" })}
            </SubmitButton>
        );
        if (formMode === BirthdayFormMode.READ) {
            left_btn = (
                <SubmitButton
                    isSubmitting={form.formState.isSubmitting}
                    onClick={onReadClick}>
                    {t("edit_btn", { ns: "generally" })}
                </SubmitButton>
            );
        }
        return (
            <>
                {left_btn}
                <SubmitButton
                    isSubmitting={form.formState.isSubmitting}
                    onClick={onDeleteClick}
                    variant="destructive"
                    className='ml-auto'
                >
                    {t("delete_btn", { ns: "generally" })}
                </SubmitButton>
            </>
        );
    })();

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 mt-4'
            >
                <fieldset
                    className="space-y-8"
                    disabled={formMode === BirthdayFormMode.READ}
                >
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    {t("first_name_title")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("first_name_placeholder")}
                                        className='text-sm'
                                        {...field}
                                    />
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
                                <FormLabel>
                                    {t("last_name_title")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("last_name_placeholder")}
                                        className='text-sm'
                                        {...field}
                                    />
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
                                <FormLabel>
                                    {t("date_title")}
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
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
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            timeZone='UTC'
                                            locale={date_picker_lang}
                                            startMonth={start_month}
                                            endMonth={end_month}
                                            captionLayout="dropdown"
                                            fixedWeeks
                                            showWeekNumber
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={disabled}
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
                    <div className='space-y-2'>
                        <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block'>
                            {t("reminder_title")}
                        </span>
                        {fields.map((field, i) => (
                            <FormField
                                key={field.id}
                                control={form.control}
                                name={`reminders.${i}.reminder`}
                                render={({ field: { ...props } }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Reminder reminderId={i} onRemoveReminder={onRemoveReminder} {...props}>
                                                <span className='grow'>{t("day", { ns: "generally", count: +props.value })}</span>
                                            </Reminder>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onAddReminder}
                            className='text-sm font-normal'
                        >
                            <BellPlus className='h-4 w-4 mr-2'/>
                            {t("add_notification")}
                        </Button>
                        <p className='text-sm text-muted-foreground'>
                            {t("reminder_description")}
                        </p>
                    </div>
                </fieldset>
                <div className='flex items-center'>
                    {Buttons}
                </div>
            </form>
        </Form>
    );
};

const Reminder = ({
    reminderId,
    onRemoveReminder,
    children,
    ...props
}: ControllerRenderProps<{
    id: number;
    firstname: string;
    lastname: string;
    date: Date;
    reminders: {
        reminder: number;
    }[];
}, `reminders.${number}.reminder`> & {
    reminderId: number,
    onRemoveReminder: (index: number) => void,
    children?: ReactNode,
}) => {

    const onClick = () => {
        console.log(reminderId);
        onRemoveReminder(reminderId);
    }

    return (
        <div className='flex gap-2 items-center justify-stretch'>
            <Input className='w-20' min={1} max={365} type='number' {...props} />
            {children}
            <Button
                variant="ghost"
                type='button'
                onClick={onClick}
                className='justify-self-end'
            >
                <X className='w-4 h-4'/>
            </Button>
        </div>
    )
};

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

    console.log(props.value);

    return (
        <Button 
            variant={variant}
            type="submit"
            className={cn("min-w-min w-20", className)}
            {...props}
        >
            {isSubmitting
                ? <PulseLoader
                    color='hsl(var(--destructive-foreground))'
                    size="0.5rem"
                />
                : children
            }
        </Button>
    );
};

export default BirthdayForm;