import Dexie, { type EntityTable, type PromiseExtended, type UpdateSpec } from "dexie";


type T_Birthday = {
    id: number;
    name: {
        first: string,
        last: string,
    };
    date: string;
};

interface BirthdayDB {
    birthday: Dexie.Table<Birthday, number>;
}

class BirthdayDB extends Dexie {
    constructor() {
        super("BirthdayDB");
        this.version(1).stores({
            birthday: "++id, name, date"
        })
        this.birthday.mapToClass(Birthday);
    }

    /**
     * Returns all Birthdays which are created
     */
    POST(birthdayObj: T_Birthday|T_Birthday[]) {
    
        const birthdayObjs = [birthdayObj].flat().map(
            b => { 
                const { id, ...newObj } = b;
                return newObj;
            }
        );

        console.log(birthdayObjs);

        return this.transaction("rw", this.birthday, async () => {
            const keys = await this.birthday.bulkAdd(birthdayObjs, {allKeys: true});

            const birthdayPromises = keys.map(async e => {
                return await this.GET(e);
            });

            return await Promise.all(birthdayPromises);
        })
    }
    /**
     * Gets the Data of a single ID or of all Birthdays in the Table
     */
    GET(id: number|undefined) {
        return this.transaction("r", this.birthday, async () => {
            if (id === undefined) return this.birthday.toArray();
            return this.birthday.get(id);
        });
    }
    /**
     * Updates all given Birthdays in the Table and returns the number of updated records
     */
    PATCH(birthdayObj: T_Birthday|T_Birthday[]) {
        const birthdayObjs = [birthdayObj].flat()

        const updateArr = birthdayObjs.map(e => ({
            key: e.id,
            changes: {
                name: e.name,
                date: e.date,
            }
        }))

        return this.transaction("rw", this.birthday, async () => {
            return this.birthday.bulkUpdate(updateArr);
        })
    }
    /**
     * Deletes all the Birthdays with the given ID(s) and returns the amount of deleted records
     */
    DELETE(id: number|number[]) {
        return this.transaction("rw", this.birthday, async () => {
            return this.birthday.where("id").equals(id).delete();
        })
    }
    /**
     * Deletes all Data in the Table
     */
    TRUNCATE() {
        return this.transaction("rw", this.birthday, async () => {
            return this.birthday.clear();
        })
    }
}
class Birthday {
    name: {
        first: string,
        last: string,
    };
    date: string;
}
const db = new BirthdayDB();

export type { T_Birthday };
export { BirthdayDB, Birthday, db };