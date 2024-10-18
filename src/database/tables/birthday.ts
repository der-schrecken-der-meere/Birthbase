export type Birthday = {
    id: number,
    name: {
        first: string,
        last: string,
    },
    date: string,
    marked: boolean,
}

export const getDefaultBirthday = (): Birthday => ({
    id: -1,
    name: {
        first: "",
        last: "",
    },
    date: new Date().toISOString(),
    marked: false,
});
