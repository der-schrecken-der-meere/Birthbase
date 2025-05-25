import { cn } from "@/lib/utils";
import ReactMarkdown, { type Options } from "react-markdown";

const Markdown = ({
    ...props
}: Options) => {
    return (
        <ReactMarkdown
            components={{
                ul: ({ children, className, ...props }) => {
                    return (
                        <ul className={cn("[&_>_li]:list-disc", className)} {...props}>
                            {children}
                        </ul>
                    );
                },
                li: ({ children, className, ...props }) => {
                    return (
                        <li className={cn("list-outside ml-4.5", className)} {...props}>
                            {children}
                        </li>
                    );
                }
            }}
            {...props}
        />
    );
};

export { Markdown };