import type { HTMLAttributes, ReactNode } from 'react';
import type { Birthday } from '@/database/tables/birthday/birthdays';
import type { MidnightTimestamp } from '@/lib/types/date';
import type { TFunction } from 'i18next';

import { Fragment } from 'react';

import { PartyPopper } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useBirthdayFormStore } from '@/stores/use_birthday_form_store';

import { useGetBirthdaysQuery } from '@/features/manage_birthdays/query';
import { useTranslation } from 'react-i18next';
import { useNavbar } from '@/hooks/core/use_navbar';
import { useQuery } from '@/hooks/core/use_query';

import { birthdaysToGroups } from '@/lib/functions/birthdays/sorting';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { i18n } from 'i18next';
import { calculate_age, calculate_days_until_next_birthday } from '@/lib/functions/birthday';
import { type ButtonProps } from '@/components/ui/button';
import { HomeSkeleton } from '@/components/skeletons/HomeSkeleton';

const Home = () => {

    useNavbar({
        docTitle: 'main.home',
        pageTitle: 'main.home',
        breadcrumbDisplay: [],
    });

    return (
        <>
            <BirthdayList/>
        </>
    );
};

const BirthdayList = () => {

    const setReadMode = useBirthdayFormStore((state) => state.setReadMode);

    const { t, i18n } = useTranslation(["pages", "generally"]);

    const { data, isFetching } = useQuery({
        tKey: "birthdays",
        useQueryFn: useGetBirthdaysQuery,
    });

    const groupBirthdays = (birthdays: Birthday[], t: TFunction<[string], undefined>, i18n: i18n) => {
        return birthdaysToGroups(birthdays, (birthday) => birthday.timestamp, i18n.language, t("current_month", { "ns": "generally" }));
    };

    const onRowClick = (data: Birthday) => {
        setReadMode(data);
    };

    if (
        isFetching
    ) {
        return (
            <HomeSkeleton/>
        );
    }

    if (data.length === 0) {
        return (
            <div className='flex flex-col gap-2 items-center justify-center h-full text-center text-muted-foreground text-sm'>
                <PartyPopper className='w-20 h-20'/>
                <span>{t("home.empty")}</span>
            </div>
        );
    }

    return (
        <ScrollArea className='h-full'>
            {groupBirthdays(data, t, i18n).map((month, index) => (
                <Fragment key={`${month.month}-${index}`}>
                    <MonthDivider className='bg-muted/80 text-muted-foreground text-sm my-2'>
                        {month.month}
                    </MonthDivider>
                    {month.birthdays.map((birthday) => (
                        <BirthdayEntry
                            key={birthday.id}
                            age={calculate_age(birthday.timestamp)}
                            until={calculate_days_until_next_birthday(birthday.timestamp)}
                            date={birthday.timestamp}
                            onClick={() => onRowClick(birthday)}
                        >
                            {t("home.person_full_name", {
                                first_name: birthday.name.first,
                                last_name: birthday.name.last
                            })}
                        </BirthdayEntry>
                    ))}
                </Fragment>
            ))}
        </ScrollArea>
    );
};

const MonthDivider = ({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn("sticky top-0 left-[50%] rounded-xl py-1 px-2 w-max -translate-x-[50%]", className)} {...props}>
            {children}
        </div>
    );
};

const BirthdayEntry = ({
    className,
    children,
    age,
    until,
    date,
    ...props
}: ButtonProps & {
    age: number,
    until: number,
    date: MidnightTimestamp,
}) => {

    const { t } = useTranslation(["pages", "generally"]);

    let days_badge: ReactNode = <PartyPopper/>;

    if (until !== 0) {
        days_badge = (
            <>
                <span className='text-lg'>{until}</span>
                <span className='text-xs'>{t("day", { count: until, ns: "generally" })}</span>
            </>
        );
    }

    return (
        <button className={cn("border border-border mt-4 rounded-xl px-4 py-2 flex gap-2 items-center w-full", className)} {...props}>
            <div className="flex flex-col gap-1 items-start mr-2">
                <div className="font-medium text-lg text-wrap">
                    {children}
                </div>
                <div className="flex flex-nowrap items-center gap-1 mt-auto text-sm text-muted-foreground">
                    {t("home.turns", { new_age: age + 1, date: format(new Date(date), "dd.MM") })}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center ml-auto">
                {days_badge}
            </div>
        </button>
    );
};

export default Home;