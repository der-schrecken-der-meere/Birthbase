// Internal features
import { useErrorQuery } from "@/hooks/core/use_query";
import { useBirthdayFormStore } from "../stores/use_birthday_form";
import { ComputedAppBirthday } from "../types/query";
import { useGetBirthdaysQuery } from "../queries/birthdays/use_get_birthdays";
import { BirthdayEntrySkeleton } from "./BirthdayEntrySkeleton";
import { BirthdayMonthBadgeSkeleton } from "./BirthdayMonthBadgeSkeleton";
import { PartyPopper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BirthdayMonthGroup } from "./BirthdayMonthGroup";
import { birthdaysToGroups } from "../lib/fn/group_birthdays_month";

const HomePage = () => {

    const setReadMode = useBirthdayFormStore((state) => state.setReadMode);

    const { data, isFetching, isLoading } = useErrorQuery({
        tKey: "birthday.show",
        useQueryFn: useGetBirthdaysQuery,
    });
    const { t, i18n } = useTranslation(["pages", "generally"]);

    const grouped_birthdays = birthdaysToGroups(
        data.birthdays.array,
        (birthday) => birthday.birthdayRecord.timestamp,
        i18n.language,
        t("current_month", { ns: "generally" })
    );

    const onRowClick = (birthday: ComputedAppBirthday) => {
        setReadMode(birthday);
    };

    if (isFetching || isLoading) {
        return (
            <>
                <BirthdayMonthBadgeSkeleton className="self-center my-2" />
                <BirthdayEntrySkeleton className="mt-4" />
            </>
        );
    }

    if (data.birthdays.array.length === 0) {
        return (
            <div className='flex flex-col gap-2 items-center justify-center h-full text-center text-muted-foreground text-sm'>
                <PartyPopper className='w-20 h-20'/>
                <span>{t("home.empty")}</span>
            </div>
        );
    }

    return (
        <div className='h-full scrollbar-visible overflow-auto'>
            {grouped_birthdays.map((month_group) => (
                <BirthdayMonthGroup
                    key={month_group.month}
                    month={month_group.month}
                    onBirthdayClick={onRowClick}
                    birthdays={month_group.birthdays}
                />
            ))}
        </div>
    );
};

export { HomePage };