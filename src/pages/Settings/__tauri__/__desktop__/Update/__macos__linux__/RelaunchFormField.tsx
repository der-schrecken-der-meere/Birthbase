import { SettingsFormElement } from "@/components/settings/SettingsFormElement";
import { FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RotateCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

type RelaunchFormFieldProps = {
    form: UseFormReturn<{
        relaunch: boolean;
        auto_search: boolean;
    }, any, undefined>
    ts: (key: string) => string;
};

const RelaunchFormField = ({
    form,
    ts
}: RelaunchFormFieldProps) => {
    return (
        <>
            <FormField
                control={form.control}
                name="relaunch"
                render={({ field: { onChange, value, ...props } }) => (
                    <SettingsFormElement
                        icon={RotateCcw}
                        actionNode={
                            <Switch
                                aria-label={ts("relaunch_aria")}
                                checked={value}
                                onCheckedChange={onChange}
                                {...props}
                            />
                        }
                        caption={ts("relaunch_description")}
                    >
                        {ts("relaunch_title")}
                    </SettingsFormElement>
                )}
            />
        </>
    );
};

export { RelaunchFormField };