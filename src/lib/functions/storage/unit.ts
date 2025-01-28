import { byte_types } from "@/globals/constants/unit_types";
import type { ByteUnit } from "@/lib/types/number";

/**
 * Returns an object with the value and unit
 * 
 * @example
 * let a = toSmallestByteType( 1000, ["byte", "kilobyte"] );             // { v: 1, u: "kilobyte" }
 * let a = toSmallestByteType( 1000, ["byte"] );                         // { v: 1, u: "byte" }
 * let a = toSmallestByteType( 1000, ["byte", "kilobyte", "megabyte"] ); // { v: 1, u: "kilobyte" }
 * let a = toSmallestByteType(  999, ["byte", "kilobyte"] );             // { v: 999, u: "byte" }
 * 
 * @param value 
 * @param units Array of byte units
 */
const to_smallest_byte_type = (value: number, units: ByteUnit[] = byte_types): { v: number, u: ByteUnit } => {
    let i = 0;

    while (value >= 1000 && i < units.length - 1) {
        value /= 1000;
        i++;
    }

    return {
        v: value,
        u: units[i],
    };
}

export { to_smallest_byte_type };