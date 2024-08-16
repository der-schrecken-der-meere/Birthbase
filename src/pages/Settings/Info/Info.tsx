import PageWrapper from '@/components/PageWrapper'
import { NavigationEntry } from '../Settings'
import { Separator } from '@/components/ui/separator'
import { isTauri } from '@/constants/environment'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

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
    const metaData = useSelector((state: RootState) => state.tauri.metaData);

    return (
        <>
            <NavigationEntry
                caption={"Akuelle Version"}
                rightElement={`v${metaData.version}`}
            >
                App-Version
            </NavigationEntry>
            <Separator/>
        </>
    )
}

const TauriVersion = () => {
    const metaData = useSelector((state: RootState) => state.tauri.metaData);

    return (
        <>
            <NavigationEntry
                caption={"Akuelle Version"}
                rightElement={`v${metaData.tauriVersion}`}
            >
                Tauri-Version
            </NavigationEntry>
        </>
    )
}

export default Info