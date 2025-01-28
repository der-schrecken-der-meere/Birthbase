type BirthdayQueueItem = {
    date: Date,
    birthdayIDs: number[],
};

type BirthdayQueue = BirthdayQueueItem[];

type BirthdayQueueAddEvent = {
    date: Date,
    event: "add",
};

type BirthdayQueueEmptyEvent = {
    date: Date,
    event: "empty",
};

type BirthdayQueueNoneEvent = {
    date: Date,
    event: "none",
}

type BirthdayQueueEvent = BirthdayQueueAddEvent | BirthdayQueueEmptyEvent | BirthdayQueueNoneEvent;

const create_birhtday_queue = (): BirthdayQueue => {
    return [];
};

const find_birthday = (birthdayID: number, birthdayQueue: BirthdayQueueItem) => {
    const index = birthdayQueue.birthdayIDs.findIndex(id => id === birthdayID);
    return index === -1 ? null : index;
};

const find_date = (date: Date, birthdayQueue: BirthdayQueue) => {
    let index: number | "prepend" | "append" = "prepend";
    if (date >= birthdayQueue[0].date) {
        index = "append";
        for (const [i] of birthdayQueue.entries()) {
            if (+birthdayQueue[i].date === +date) {
                index = i;
                break;
            }
        }
    }
    return index;
};

const create_add_event = (date: Date): BirthdayQueueAddEvent => {
    return {
        date,
        event: "add",
    };
};

const create_none_event = (date: Date): BirthdayQueueNoneEvent => {
    return {
        date,
        event: "none",
    };
};

const create_empty_event = (date: Date): BirthdayQueueEmptyEvent => {
    return {
        date,
        event: "empty",
    };
};

const add_birthday = (birthdayID: number, date: Date, birthdayQueue: BirthdayQueue): BirthdayQueueAddEvent | BirthdayQueueNoneEvent => {
    if (birthdayQueue.length === 0) {
        birthdayQueue.push({
            date: date,
            birthdayIDs: [birthdayID],
        });
        return create_add_event(date);
    }
    
    const index = find_date(date, birthdayQueue);
    switch (index) {
        case "prepend":
            birthdayQueue.unshift({
                date: date,
                birthdayIDs: [birthdayID],
            });
            return create_add_event(date);
        case "append":
            birthdayQueue.push({
                date: date,
                birthdayIDs: [birthdayID],
            });
            return create_none_event(date);
        default:
            const birthdayIndex = find_birthday(birthdayID, birthdayQueue[index]);
            if (!birthdayIndex) {
                birthdayQueue[index].birthdayIDs.push(birthdayID);
            }
            return create_none_event(date);
    }
};

const del_birthday = (birthdayID: number, date: Date, birthdayQueue: BirthdayQueue): BirthdayQueueNoneEvent | BirthdayQueueEmptyEvent | BirthdayQueueAddEvent => {
    if (birthdayQueue.length === 0) {
        return create_none_event(date);
    }
    const index = find_date(date, birthdayQueue);
    if (index === "prepend" || index === "append") {
        return create_none_event(date);
    }
    const birthdayIndex = find_birthday(birthdayID, birthdayQueue[index]);
    if (birthdayIndex === null) {
        return create_none_event(date);
    }
    birthdayQueue[index].birthdayIDs.splice(birthdayIndex, 1);
    if (birthdayQueue[index].birthdayIDs.length === 0) {
        birthdayQueue.splice(index, 1);
        if (birthdayQueue.length !== 0) {
            return create_add_event(birthdayQueue[0].date);
        }
        return create_empty_event(date);
    }
    return create_none_event(date);
};

const upd_birthday = (birthdayID: number, oldDate: Date, newDate: Date, birthdayQueue: BirthdayQueue): BirthdayQueueAddEvent | BirthdayQueueNoneEvent => {
    const deleteEvent = del_birthday(birthdayID, oldDate, birthdayQueue);
    const addEvent = add_birthday(birthdayID, newDate, birthdayQueue);
    if (deleteEvent.event === "add" && (addEvent.event !== "add")) {
        return deleteEvent;
    }
    return addEvent;
};

export type { BirthdayQueueItem, BirthdayQueueEvent };
export { create_birhtday_queue, add_birthday, del_birthday, upd_birthday, find_date };