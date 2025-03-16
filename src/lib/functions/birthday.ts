import { Birthday } from "@/database/tables/birthday/birthdays";
import { midnight_utc } from "./date";
import { MidnightTimestamp } from "../types/date";

type CreateBirthdayProps = {
    id: number,
    timestamp: number,
    name?: {
        first?: string,
        last?: string,
    },
};

const create_birthday = ({
    id,
    timestamp,
    name = {
        first: "",
        last: ""
    },
}: CreateBirthdayProps): Birthday => {
    return {
        id,
        timestamp: timestamp as MidnightTimestamp,
        name: {
            first: (name?.first || ""),
            last: (name?.last || ""),
        },
    };
};

/**
 * Unifies a given birthday and returns a new
 * 
 * @param birthday 
 * @returns {Birthday} A new Birthday with unified values
 */
const unify_birthday = (
    birthday: Birthday
): Birthday => {

    return create_birthday({
        ...birthday,
        timestamp: midnight_utc(birthday.timestamp),
    });
};

/**
 * Transforms a given timestamp to the timestamp of the next birthday
 * 
 * @param birthday_timestamp 
 * @returns A new timestamp of the upcoming birthday either this or next year
 */
const get_next_birthday = (
    birthday_timestamp: MidnightTimestamp,
    compare_timestamp?: MidnightTimestamp,
) => {
    const obj_today = new Date((compare_timestamp || midnight_utc(Date.now())));
    const obj_birthday = new Date(birthday_timestamp);

    obj_birthday.setUTCFullYear(obj_today.getUTCFullYear());

    if (+obj_today > +obj_birthday) {
        obj_birthday.setUTCFullYear(obj_today.getUTCFullYear() + 1);
    }

    return +obj_birthday;
};

/**
 * Calculates the age
 * 
 * @param birth_timestamp 
 * @returns A new number representing the difference between two timestamps
 */
const calculate_age = (
    birth_timestamp: MidnightTimestamp,
): number => {
    const obj_today = new Date();
    const obj_birth = new Date(birth_timestamp);

    let age = obj_today.getUTCFullYear() - obj_birth.getUTCFullYear();

    // If the birthday is this year, but is in the future
    if (+obj_today < +obj_birth) {
        age--;
    }

    return age;
};

const calculate_days_until_next_birthday = (
    birthday_timestamp: MidnightTimestamp,
) => {
    const today = midnight_utc(Date.now());
    let difference = birthday_timestamp - today;
    if (difference < 0) {
        const birthday = new Date(birthday_timestamp);
        const date_today = new Date(today);
        birthday.setUTCFullYear(date_today.getUTCFullYear() + 1);
        difference = +birthday - +date_today;
    }
    return Math.floor(difference / (1000 * 60 * 60 * 24));
};

export {
    calculate_age,
    calculate_days_until_next_birthday,
    create_birthday,
    get_next_birthday,
    unify_birthday,
};