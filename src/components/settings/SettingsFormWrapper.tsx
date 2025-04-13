import type { SettingsFormWrapperProps } from "./types";
import { type FieldValues } from "react-hook-form";

import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { PulseLoader } from "react-spinners";

import { cn } from "@/lib/utils";

const SettingsFormWrapper = <T extends FieldValues,>({
    form,
    children,
    onSubmit,
    ...props
}: SettingsFormWrapperProps<T>) => {
    const { t } = useTranslation(["generally"]);

    const { handleSubmit, formState: { isSubmitting, isDirty } } = form;

    return (
        <Form {...form}>
            <form
                className={cn('h-full flex flex-col')}
                onSubmit={handleSubmit(onSubmit)}
                {...props}
            >
                <fieldset
                    className='h-full flex flex-col'
                    disabled={isSubmitting}
                >
                    <div className='scrollbar-visible h-full overflow-auto'>
                        {children}
                    </div>
                    <Button
                        type='submit'
                        className='self-end screen-h-lg:mb-10 mb-1'
                        disabled={!isDirty}
                    >
                        {isSubmitting
                            ? <PulseLoader
                                color='hsl(var(--foreground))'
                                size="0.5rem"
                            />
                            : t("save_btn")
                        }
                    </Button>
                </fieldset>
            </form>
        </Form>
    );
};

export { SettingsFormWrapper };