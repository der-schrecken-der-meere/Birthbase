import { calc_days_until_next_birthday, calcAge } from "@/lib/functions/birthdays/calculations";
import { replace } from "@/lib/functions/string/replace";
import { format_date_to_iso_midnight, format_date_to_short_str } from "@/lib/intl/date";
import { ISOMidnightFullTZ } from "@/lib/types/date";

type BirthdayItem = {
    until: number,
    age: number,
    firstname: string,
    lastname: string,
    date: string, 
};

const create_birthday_item = (
    locale: Intl.LocalesArgument,
    timeZone: string,
    firstname: string,
    lastname: string,
    date: ISOMidnightFullTZ,
): BirthdayItem => {
    const str_current_date = format_date_to_iso_midnight(locale, timeZone);
    const age = calcAge(date, str_current_date);
    const until = calc_days_until_next_birthday(date, str_current_date);

    return {
        age,
        until,
        firstname,
        lastname,
        date: format_date_to_short_str(locale, timeZone, new Date(date)),
    };
};

const create_birthday_text = (
    birthdayItem: BirthdayItem,
    template_past: string,
    template_present: string,
    template_future: string,
) => {
    let template = template_present;
    if (birthdayItem.until > 0) {
        template = template_future;
        birthdayItem.age += 1;
    } else if (birthdayItem.until < 0) {
        template = template_past;
    }
    return replace(template,
        birthdayItem.firstname,
        birthdayItem.lastname,
        birthdayItem.until,
        birthdayItem.date,
        birthdayItem.age,
    );
};

export type {
    BirthdayItem,
};
export {
    create_birthday_item,
    create_birthday_text,
};