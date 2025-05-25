import type { DBRecord, DexieConfig, DexieHistory } from "@/lib/types/db";
import { TABLES } from "../enums/tables";
import { AppBirthday } from "@/database/birthalert/birthdays/types";
import { midnight_utc } from "@/lib/functions/date";
import { unify_birthday } from "@/lib/functions/birthday";

const BIRTHALERT_CONFIG = Object.freeze<DexieConfig>({
    name: "BirthAlert",
    version: 13,
    history: Object.freeze<DexieHistory[]>([
        {
            version: 7,
            stores: {
                settings: "++id",
            },
        },
        {
            version: 8,
            stores: {
                notifications: "++id,timestamp",
            }
        },
        {
            version: 13,
            stores: {
                birthdays: "++id,timestamp",
            },
            upgrade: async (trans) => {
                return trans.table(TABLES.BIRTHDAYS).toCollection().modify((birthday: AppBirthday & DBRecord) => {
                    const timestamp = midnight_utc(
                        /** @ts-ignore */
                        +new Date(birthday.date)
                    );
                    const { id, name: { first, last } } = birthday;
                    const new_birthday: AppBirthday & DBRecord = { id, name: { first, last }, timestamp, reminder: [] };
                    birthday = unify_birthday(new_birthday);
                });
            }
        }
    ]),
});

export { BIRTHALERT_CONFIG };