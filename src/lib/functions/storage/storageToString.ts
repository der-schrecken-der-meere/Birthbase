import { byte_format } from "@/lib/intl/storage";
import { to_smallest_byte_type } from "./unit";

const storage_size_to_string = (lang: Intl.LocalesArgument, value: number) => {
    const obj_size = to_smallest_byte_type(value);
    return byte_format(lang, obj_size.u, obj_size.v);
};

export { storage_size_to_string };