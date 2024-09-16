import PageWrapper from '@/frontend/components/PageWrapper'
import { NavigationEntry } from '../Settings'
import { Separator } from '@/frontend/components/ui/separator'
import { isTauri } from '@/globals/constants/environment'
import { useSelector } from 'react-redux'
import { RootState } from '@/frontend/store/store'

const Info = () => {
    return (
        <PageWrapper goBack={1} title='Info'>
            {isTauri && <>
                <Version/>
                <TauriVersion/>
            </>}
        </PageWrapper>
    )
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