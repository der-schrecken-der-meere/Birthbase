import { type Birthday } from "@/database/tables/birthday/birthdays";
import { type UseSettingsFormProps } from "./core/use_form";

import { z, type ZodType } from "zod";

import { useRef } from "react";
import { useBirthdayMutation } from "./use_birthday_mutation";
import { useBirthdayFormStore } from "../stores/use_birthday_form_store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormMethod = "create"|"update"|"delete"|"read";

const useBirthdayForm = <T extends ZodType<any, any, any>>({
    form_schema,
    on_submit,
}: UseSettingsFormProps<Birthday, T>) => {
    const method = useRef<FormMethod>("create");

    const setOpen = useBirthdayFormStore((state) => state.setOpen);
    const birthday = useBirthdayFormStore((state) => state.birthday);
    const { id, name: { first, last }, timestamp, reminder } = birthday;

    console.log(reminder);

    const reminders = reminder.map<{ reminder: number }>((reminder) => {
        return {
            reminder
        };
    });

    const cbs = {
        onSuccess: () => {
            setOpen(false);
        },
    };

    const { upd, add, del } = useBirthdayMutation({
        add_cbs: cbs,
        upd_cbs: cbs,
        del_cbs: cbs,
    });
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(form_schema),
        defaultValues: {
            id,
            firstname: first,
            lastname: last,
            date: timestamp,
            reminders,
        } as any,
    });

    const onSubmit = async (data: z.infer<T>) => {
        if (method.current === "read") {
            return;
        }
        const new_birthday = on_submit(data);
        if (new_birthday) {
            switch (method.current) {
                case "create":
                    await add(new_birthday);
                    break;
                case "update":
                    await upd(new_birthday);
                    break;
                case "delete":
                    await del(new_birthday);
                    break;
            }
        }
    };

    const changeMethod = (new_method: FormMethod) => {
        method.current = new_method;
    };

    return {
        form,
        onSubmit,
        changeMethod,
        birthday,
    };
};

export {
    useBirthdayForm,
};