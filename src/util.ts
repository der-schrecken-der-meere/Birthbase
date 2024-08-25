import { Decimal } from "decimal.js"
import type { StorageSize } from "./storagesize/columns";
import { db } from "./database/dexie_db";

export function calcAge (birthDate: Date, currentDate: Date) {
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) age--;

    return age;
}
export function calcDaysUntilNextBirthday (birthDate: Date, currentDate: Date) {
    let nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (currentDate > nextBirthday) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const diffInMs = +nextBirthday - +currentDate;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
}
enum StorageType {
    local = 0,
    session = 1,
    both = 2,
}

const localStorageSize = () => {
    let local = new Decimal(0);
        
    for (const key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) continue;
        local = local.add((localStorage[key].length + key.length) * 2);
    }

    return local;
}

const sessionStorageSize = () => {
    let local = new Decimal(0);
        
    for (const key in sessionStorage) {
        if (!sessionStorage.hasOwnProperty(key)) continue;
        local = local.add((sessionStorage[key].length + key.length) * 2);
    }

    return local;
}

const storageSize = (type: StorageType): {
    total: Decimal,
    session?: Decimal,
    local?: Decimal,
} => {
    let returnValue = { total: new Decimal(0) }


    if (type === StorageType.local || type === StorageType.both) {
        const local = localStorageSize();
        returnValue.total = local.add(returnValue.total);

        returnValue = { ...returnValue, ...{ local } }
    }
    if (type === StorageType.session || type === StorageType.both) {
        const session = sessionStorageSize();
        returnValue.total = session.add(returnValue.total);

        returnValue = { ...returnValue, ...{ session } }
    }

    return returnValue;
}

const unitTypes = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"];

const toSmallestByteType = (value: Decimal, units: string[] = unitTypes) => {
    let i = 0;

    while (value.gte(1000) && i < units.length - 1) {
        value = value.div(1000);
        i++;
    }

    return {
        v: value,
        u: units[i],
    };
}
const objIsEmpty = (obj: Object) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) return false;
    }
    return true;
}
const IntlByteFormat = (language: Intl.LocalesArgument, unit: string, value: Decimal) => {
    return Intl.NumberFormat(language, {
        unit,
        unitDisplay: "short",
        style: "unit",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value.toString());
}

const getAllStorages = async () => {

    try {
        const storages = storageSize(StorageType.both);
        const local = toSmallestByteType(storages.local as Decimal);
        const session = toSmallestByteType(storages.session as Decimal);

        const storageManager = await navigator.storage.estimate();
        const indexed = storageManager?.usageDetails?.indexedDB &&
            toSmallestByteType(new Decimal(storageManager.usageDetails.indexedDB));

        const data: StorageSize[] = [
            {
                name: "Session Speicher",
                size: Format.Byte("de", session.u, session.v),
                raw: session.v,
                fn: () => sessionStorage.clear(),
            },
            {
                name: "Lokaler Speicher",
                size: Format.Byte("de", local.u, local.v),
                raw: local.v,
                fn: () => localStorage.clear(),
            },
            {
                name: "IndexedDB Speicher",
                size: indexed ? Format.Byte("de", indexed.u, indexed.v) : "Unbekannt",
                raw: indexed ? indexed.v : new Decimal(0),
                fn: async () => await db.delete({ "disableAutoOpen" : true}),
            },
        ];
        console.log(storageManager);
        data.sort((a, b) => {
            console.log(a.raw.toString(), b.raw.toString())
            if (a.raw.gt(b.raw)) return -1;
            else if (a.raw.lt(b.raw)) return 1;
            else return 0;
        });
        return data;
    } catch (e) {
        throw new Error(e as string);
    }
}

const strict_OR = <T>(variable: T, ...compare: T[]) => {
    let v = false;
    for (const e of compare) {
        if (variable === e) {
            v = true;
            break;
        }
    }
    return v;
}

const Format = {
    Byte: IntlByteFormat,
}

export { storageSize, StorageType, toSmallestByteType, objIsEmpty, Format, getAllStorages, strict_OR }