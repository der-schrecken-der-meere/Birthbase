import { Decimal } from "decimal.js"
import { db } from "../database/database_exports";
import { toSmallestByteType } from "./functions/storage/unit";
import { primitive_strict_or } from "./functions/logic/or";

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

const stringSliceToJSON = (str: string, afterFull: (str: string) => void): false|string => {
    let start = 0;
    const stack: string[] = [];
    const bracketPairs = {
        '}': '{',
        ']': '['
    }

    const length = str.length;

    if (length === 0) return "";
    if (!primitive_strict_or<string>(str[0], "{", "[")) return false;

    for (let i = 0; i < length; i++) {
        if (str[i] === "{" || str[i] === "[") {
            if (stack.length === 0) start = i;
            stack.push(str[i]);
        } else if (str[i] === "}" || str[i] === "]") {
            if (stack.pop() !== bracketPairs[str[i] as ("]"|"}")]) {
                return false;
            }
            if (stack.length === 0) {
                afterFull(str.slice(start, i + 1));
                start = i + 1;
            }
        }
    }

    return str.slice(start);
}

export { storageSize, StorageType, getAllStorages, stringSliceToJSON }