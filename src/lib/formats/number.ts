import type { Range } from "../types/number";

const format_number_to_two_digit_string = (locale: string, number: Range<0, 100>) => {
    return Intl.NumberFormat(locale, { style: "decimal", minimumIntegerDigits: 2 }).format(number);
};

export { format_number_to_two_digit_string };