import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectShortendProps } from "./types";

const SelectShortend = <T,>({
    defaultValue,
    onValueChange,
    title,
    selectItems,
    children,
    ...props
}: SelectShortendProps<T>) => {
    return (
        <Select
            defaultValue={defaultValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger
                className="w-[180px] gap-2"
                {...props}
            >
                <SelectValue
                    placeholder={title}
                    className='flex w-full'
                >
                    {selectItems.find((v) => v.value === defaultValue)?.displayText}
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