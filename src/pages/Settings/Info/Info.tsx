import { NavigationEntry } from '../Settings'
import { Separator } from '@/components/ui/separator'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useNavbar } from '@/hooks/useNavbar'
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout'
import { isTauri } from '@tauri-apps/api/core'

const Info = () => {

    useNavbar({
        pageTitle: "Info",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    return (
        isTauri()
            ?
                <>
                    <Version/>
                    <TauriVersion/>
                </>
            :
                null
    );
}

const Version = () => {
    const metaData = useSelector((state: RootState) => state.tauri.appInfo.version);

    return (
        <>
            <NavigationEntry
                caption={"Akuelle Version"}
                rightElement={`v${metaData}`}
            >
                App-Version
            </NavigationEntry>
            <Separator/>
        </>
    )
}

const TauriVersion = () => {
    const metaData = useSelector((state: RootState) => state.tauri.appInfo.tauriVersion);

    return (
        <>
            <NavigationEntry
                caption={"Akuelle Version"}
                rightElement={`v${metaData}`}
            >
                Tauri-Version
            </NavigationEntry>
        </>
    )
}

export default Info