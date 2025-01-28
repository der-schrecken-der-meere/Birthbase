/**
 * Checks if an object has own properties
 * 
 * @example
 * let _false = objIsEmpty({ a: "1" });      // false
 * let _true  = objIsEmpty({});              // true
 * let _true  = objIsEmpty(new String());    // true
 * let _false = objIsEmpty(new String("1")); // false
 */
const obj_is_empty = (obj: Object) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) return false;
    }
    return true;
}

export { obj_is_empty };