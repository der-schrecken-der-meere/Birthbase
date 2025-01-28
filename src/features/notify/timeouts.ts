const create_timeouts = (): number[] => {
    return [];
};

const reset_timeout = (timeouts: number[]) => {
    timeouts.forEach(timeoutID => {
        clearTimeout(timeoutID);
    });
    timeouts.length = 0;
};

const set_timeout = (timeouts: number[], timeout: number, cb: () => void) => {
    const timeoutID = setTimeout(() => {
        cb();
    }, timeout);
    timeouts.push(timeoutID);
};

const calc_timeout = (date: Date) => {
    const now = new Date();
    // Create a new Date to prevent change of the original date
    const birthdayDate = new Date(date);
    birthdayDate.setFullYear(now.getFullYear());

    // If birth date is less than now (past) set it to next year
    if (birthdayDate < now) {
        birthdayDate.setFullYear(now.getFullYear() + 1);
    }

    return +birthdayDate - +now;
};

export { reset_timeout, set_timeout, create_timeouts, calc_timeout };