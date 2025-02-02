/**
 * Returns a string with new values in the placeholders
 * 
 * @example
 * let newStr = replace("Hello $1", "World"); // newStr is "Hello World"
 * 
 * @param str A string containing placeholders
 * @param values An Array of placeholder values
 */
const replace = (str: string, ...values: Array<number|string>) => {
    const regex = /(\$\d+)/g;
    // Extracts all $<number> and parse them into a number
    const placeholders = (str.match(regex) || []);
    const index = placeholders.map(reg => +reg.substring(1)-1);
    // Checks if there is an actual value for the placeholder
    for (const n of index) {
        if (n >= values.length || n < 0) return false;
    }
    let arr_str: Array<number|string> = str.split(regex);
    // Replaces $<number> with the value
    placeholders.forEach((str, i) => {
        const str_i = arr_str.findIndex((v) => v === str);
        arr_str[str_i] = values[index[i]];
    });
    return arr_str.join("");
}

export { replace };