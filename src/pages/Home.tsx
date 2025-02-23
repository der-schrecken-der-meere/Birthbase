import { Fragment, HTMLAttributes, ReactNode, useCallback, useEffect } from 'react';
import { Birthday } from '@/database/tables/birthday/birthdays';
// import Table from '../components/tables/birthdaysSoon/Table';
import { get_birthdays_query } from '@/features/manage_birthdays/query';
import { Skeleton } from '../components/ui/skeleton';
import { create_toast, ToastType } from '@/hooks/use_app_toast';
import { update_navbar } from '@/hooks/use_app_navbar';
import { birthdaysToGroups } from '@/lib/functions/birthdays/sorting';
import { open_birthday_form_read } from '@/hooks/use_birthday_form';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ISOMidnightFullTZ } from '@/lib/types/date';
import { PartyPopper } from 'lucide-react';
import { calc_days_until_next_birthday, calcAge } from '@/lib/functions/birthdays/calculations';
import { format_date_to_iso_midnight } from '@/lib/intl/date';
import { useTranslation } from 'react-i18next';
import { i18n, TFunction } from 'i18next';

const Home = () => {

    update_navbar({
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

    const { t, i18n } = useTranslation(["pages", "generally"]);

    const { data, isError, error, isFetching } = get_birthdays_query();

    useEffect(() => {
        if (isError) {
            create_toast({
                title: t("toast.errors.show_birthdays"),
                description: JSON.stringify(error),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    const groupBirthdays = useCallback((birthdays: Birthday[], t: TFunction<[string], undefined>, i18n: i18n) => {
        return birthdaysToGroups(birthdays, (birthday) => birthday.date, i18n.language, t("current_month", { "ns": "generally" }));
    }, []);

    const onRowClick = useCallback((data: Birthday) => {
        open_birthday_form_read(data);
    }, []);

    if (isFetching) {
        return (
            <>
                <Skeleton className='w-full h-36' />
            </>
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
                            age={calcAge(birthday.date, format_date_to_iso_midnight("de", "Europe/Berlin", new Date()))}
                            until={calc_days_until_next_birthday(birthday.date, format_date_to_iso_midnight("de", "Europe/Berlin", new Date()))}
                            date={birthday.date}
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
        // <Table
        //     data={data as Birthday[]}
        //     className="flex-1"
        // />
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
}: HTMLAttributes<HTMLDivElement> & {
    age: number,
    until: number,
    date: ISOMidnightFullTZ,
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
        <div className={cn("border border-border mt-4 rounded-xl px-4 py-2 flex gap-2 items-center", className)} {...props}>
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
        </div>
    );
};

export default Home;