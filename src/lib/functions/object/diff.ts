/**
 * Returns the values of an enum or object, which are not included in `exclude`.
 *
 * This function is reliable with **String-Enums** or object with string values.
 *
 * @template T - An object type with string values
 * @param {T} obj - An object or enum (e.g. `Xyz`)
 * @param {string[]} exclude - Array with excluding values (z. B. `["a"]`)
 * @returns {string[]} - Array with the remainding enum or object values
 *
 * @example
 * enum Xyz {
 *   A = "a",
 *   B = "b",
 *   C = "c",
 * }
 * const used = ["a"];
 * const result = enumDiff(Xyz, used); // ["b", "c"]
 */
const objectDiff = <T extends Object|object>(obj: T, exclude: string[]): string[] => {
    return Object.values(obj).filter((v) => !exclude.includes(v));
};

export { objectDiff };