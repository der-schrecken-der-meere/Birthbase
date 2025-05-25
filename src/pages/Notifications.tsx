import { Title } from "@/features/navigation/components/Title";
import { NotificationPage } from "@/features/notifications/components/NotificationPage";
import { PageLinks } from "@/globals/constants/links";
import { useTranslation } from "react-i18next";

const Notifications = () => {

    const { t } = useTranslation("navigation");

    return (
        <>
            <Title
                breadcrumbs={[{
                    id: "menu",
                    type: [{
                        display: t("main.home"),
                        href: PageLinks.HOME
                    }],
                }]}
                pageTitleKey={t("main.notifications")}
                documentTitleKey={t("main.notifications")}
            />
            <NotificationPage/>
        </>
    );
}

export default Notifications;