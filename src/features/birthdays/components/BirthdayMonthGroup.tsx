import { BirthdayMonthGroupProps } from "../types/components";
import { BirthdayEntry } from "./BirthdayEntry";
import { BirthdayMonthBadge } from "./BirthdayMonthBadge";

const BirthdayMonthGroup = ({
    month,
    birthdays,
    onBirthdayClick,
}: BirthdayMonthGroupProps) => {
    return (
        <>
            <BirthdayMonthBadge
                className="my-2 sticky top-0 left-[50%] -translate-x-[50%]"
            >
                {month}
            </BirthdayMonthBadge>
            {birthdays.map((birthday) => (
                <BirthdayEntry
                    className="mt-4"
                    key={birthday.birthdayRecord.id}
                    birthday={birthday}
                    onBirthdayClick={onBirthdayClick}
                />
            ))}
        </>
    );
};

export { BirthdayMonthGroup };