import type { BitUnit, ByteUnit, StorageUnit } from "../types/number";

const storage_format = (language: Intl.LocalesArgument, unit: StorageUnit, value: number) => {
    return Intl.NumberFormat(language, {
        unit,
        unitDisplay: "short",
        style: "unit",
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value);
};

const byte_format = (language: Intl.LocalesArgument, unit: ByteUnit, value: number) => {
    return Intl.NumberFormat(language, {
        unit,
        unitDisplay: "short",
        style: "unit",
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value);
};

const bit_format = (language: Intl.LocalesArgument, unit: BitUnit, value: number) => {
    return Intl.NumberFormat(language, {
        unit,
        unitDisplay: "short",
        style: "unit",
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value);
};

export { byte_format, storage_format, bit_format };