import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectShortendProps } from "./types";

const SelectShortend = <T,>({
    defaultValue,
    onValueChange,
    placeholder,
    selectItems,
    disabled,
    value,
    name,
    children,
    className,
    ...props
}: SelectShortendProps<T>) => {

    const handleChange = (value: string) => {
        if (value) {
            onValueChange(value);
        }
    };

    return (
        <Select
            value={value as string}
            onValueChange={handleChange}
            disabled={disabled}
            name={name}
        >
            <SelectTrigger
                className={cn("w-48 gap-2", className)}
                {...props}
            >
                <SelectValue
                    placeholder={placeholder}
                >
                    {selectItems.find((v) => v.value === value)?.displayText}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {selectItems.map((v, i) => (
                        <SelectItem
                            key={i}
                            value={v.value as string}
                        >
                            {v.item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export { SelectShortend };