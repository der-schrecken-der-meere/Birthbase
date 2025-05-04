import type { FileUploaderFormProps } from "./types";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Dropzone } from "./Dropzone";
import { PulseLoader } from "react-spinners";
import { Progress } from "../ui/progress";
import { CircleCheck } from "lucide-react";

const FileUploaderForm = ({
    maxFiles,
    disabled,
    onSubmit,
    progress,
    ...props
}: FileUploaderFormProps) => {

    const max_files = maxFiles || 1;

    const isFileSubmitting = Number.isInteger(progress) && progress as number < 100;

    const { t } = useTranslation(["dialog", "generally"]);

    const formSchema = z.object({
        files: z.array(
            z.instanceof(File)
            .refine(() => {
                return true;
            })
        )
        .max(max_files, t("file_uploader.to_many_files", { count: max_files }))
        .min(1, t("file_uploader.to_few_files"))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            files: [],
        },
        disabled: isFileSubmitting,
    });

    const onFormSubmit = (data: z.infer<typeof formSchema>) => {
        onSubmit(data.files);
    };

    const { handleSubmit, formState: { isDirty, isSubmitting } } = form;

    console.log(progress);

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="files"
                    render={({ field: { onChange, disabled } }) => (
                        <FormItem>
                            <FormControl>
                                <Dropzone
                                    disabled={disabled}
                                    maxFiles={max_files}
                                    onChange={onChange}
                                    {...props}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {Number.isInteger(progress) && (
                    progress === 100
                        ? <CircleCheck className="w-4 h-4" />
                        : <Progress
                            value={progress as number}
                            className="w-full h-4"
                        />
                )}
                <Button
                    type="submit"
                    disabled={!isDirty || isSubmitting || isFileSubmitting}
                    className="self-start"
                >
                    {(isSubmitting || isFileSubmitting) 
                        ? <PulseLoader
                            color='hsl(var(--foreground))'
                            size="0.5rem"
                        />
                        : t("upload", { ns: "generally" })
                    }
                </Button>
            </form>
        </Form>
    );
};

export { FileUploaderForm };