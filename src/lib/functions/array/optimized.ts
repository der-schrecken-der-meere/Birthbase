/**
 * Concats two arrays
 */
const concat_array = <T>(arr1: T[], arr2: T[]): T[] => {
    const newArray = [];
    newArray.push(...arr1, ...arr2);
    return newArray;
}

export { concat_array };