import { Button, ButtonProps } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../hooks/core/use_history';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GoBackInHistoryProps {
    amount?: number;
};

const GoBackInHistory = ({
    amount = 1,
    ...props
}: GoBackInHistoryProps & Omit<ButtonProps, "disabled"|"onClick">) => {
    const navigate = useNavigate();
    const { canGoBack } = useHistory();
    const { t } = useTranslation(["generally"]);

    return (
        <Button
            disabled={!canGoBack}
            onClick={() => navigate((amount * -1))}
            {...props}
            aria-label={t("history_back_aria")}
        >
            <ArrowLeft className='w-6 h-6' />
        </Button>
    );
};

export type { GoBackInHistoryProps };
export { GoBackInHistory };