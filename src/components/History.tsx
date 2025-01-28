import { Button, ButtonProps } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import { useHistory } from '../hooks/useHistory';

interface GoBackInHistoryProps {
    amount?: number;
}

const GoBackInHistory = ({
    amount = 1,
    ...props
}: GoBackInHistoryProps & Omit<ButtonProps, "disabled"|"onClick">) => {
    const navigate = useNavigate();
    const { canGoBack } = useHistory();

    return (
        <Button
            disabled={!canGoBack}
            onClick={() => navigate((amount * -1))}
            {...props}
        >
            <LuArrowLeft className='w-6 h-6' />
        </Button>
    );
};

export type { GoBackInHistoryProps };
export { GoBackInHistory };