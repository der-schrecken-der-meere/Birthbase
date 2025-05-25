// Packages
import { useTranslation } from "react-i18next";

// External features
import { ButtonProps } from "@/components/ui/button";

// Internal features
import { BirthdayAddButtonBasic } from "./BirthdayAddButtonBasic";

const BirthdayAddButton = ({
    className,
    ...props
}: ButtonProps) => {

    const { t } = useTranslation("generally");

    return (
        <BirthdayAddButtonBasic
            size="sm"
            {...props}
        >
            {t("create_btn")}
        </BirthdayAddButtonBasic>
    );
};

export { BirthdayAddButton };