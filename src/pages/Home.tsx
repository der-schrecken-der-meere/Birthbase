// Packages
import { useTranslation } from "react-i18next";

// External features
// import { Title } from "@/components/navigation/Title";
import { HomePage } from "@/features/birthdays/components/HomePage";
import { Title } from "@/features/navigation/components/Title";

const Home = () => {

    const { t } = useTranslation("navigation");

    return (
        <>
            <Title
                breadcrumbs={[]}
                documentTitleKey={t("main.home")}
                pageTitleKey={t("main.home")}
            />
            <HomePage/>
        </>
    );
};

export default Home;