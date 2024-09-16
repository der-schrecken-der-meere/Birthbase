import { AppDispatch, RootState } from '@/frontend/store/store';
import { useDispatch, useSelector } from 'react-redux';
import BasicDialog from '@/frontend/components/BasicDialog';
import { Progress } from '@/frontend/components/ui/progress';
import { Button } from '@/frontend/components/ui/button';
import { installUpdate } from '@/backend/updater';

const Updater = () => {
    const update = useSelector((state: RootState) => state.update);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <BasicDialog
            title='Update wurde gefunden'
            description='Updaten Sie die Applikation auf die neuste Version'
            defaultOpen={true}
            close={<Button variant="secondary">Abbrechen</Button>}
        >
            {update.downloading ? (
                <Progress value={update.progress} />
            ) : (
                <div className='flex items-center justify-between'>
                    <Button onClick={() => installUpdate(dispatch, useSelector)}>Herunterladen</Button>
                </div>
            )}
        </BasicDialog>
    );
}

export default Updater