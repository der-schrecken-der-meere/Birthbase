// External features
import { ButtonProps } from "@/components/ui/button";

// Internal features
import { BirthdayAddButtonBasic } from "./BirthdayAddButtonBasic";

const BirthdayAddButtonMobile = ({
    ...props
}: ButtonProps) => {

    return (
        <BirthdayAddButtonBasic
            size="icon"
            {...props}
        />
    );
};

export { BirthdayAddButtonMobile };