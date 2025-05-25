// Packages
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// External features
import { Button } from "@/components/ui/button";

// Internal features
import type { GoBackInHistoryProps } from "../types/components";
import { useHistory } from "../hooks/use_history";

const GoBackInHistory = ({
    amount = 1,
    ...props
}: GoBackInHistoryProps) => {
    const navigate = useNavigate();
    const { canGoBack } = useHistory();
    const { t } = useTranslation(["generally"]);

    return (
        <Button
            disabled={!canGoBack}
            onClick={() => navigate((amount * -1))}
            aria-label={t("history_back_aria")}
            {...props}
        >
            <ArrowLeft className='w-6 h-6' />
        </Button>
    );
};

export { GoBackInHistory };