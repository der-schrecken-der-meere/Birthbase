import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import BasicDialog from '../dialogs/BasicDialog';
import { installUpdate } from '@/backend/updater';

import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { DialogClose } from '..//ui/dialog';

const Updater = () => {
    const update = useSelector((state: RootState) => state.update);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <BasicDialog
            title='Update wurde gefunden'
            description='Updaten Sie die Applikation auf die neuste Version'
            defaultOpen={true}
            trigger={null}
        >
            {update.downloading ? (
                <Progress value={update.progress} />
            ) : (
                <div className='flex items-center justify-between'>
                    <Button onClick={() => installUpdate(dispatch, useSelector)}>Herunterladen</Button>
                </div>
            )}
            <DialogClose asChild>
                <Button variant="secondary">Abbrechen</Button>
            </DialogClose>
        </BasicDialog>
    );
}

export default Updater