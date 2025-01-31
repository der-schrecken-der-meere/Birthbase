import { SettingsLayoutBreadcrumbs } from "@/components/layouts/SettingsLayout";
import { useNavbar } from "@/hooks/useNavbar";

const App = () => {

    useNavbar({
        pageTitle: "App",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    return (
        <div></div>
    );
};

export default App;