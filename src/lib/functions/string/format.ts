/**
 * Capitalizes the first letter of a string
 */
const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export { capitalize };