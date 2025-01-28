/**
 * Compares a primitive value against an array of values
 * 
 * @example
 * let _true  = primitive_strict_or( 1, 1, 2, 3 ); // true
 * let _false = primitive_strict_or( "12", undefined, 12, true ); // false
 * 
 * @param variable A primitive value to compare against
 * @param compare A primitive to compare against the variable
 */
const primitive_strict_or = <T extends number|string|boolean|undefined|symbol|null|bigint>(variable: T, ...compare: T[]) => {
    let v = false;
    for (const e of compare) {
        if (variable === e) {
            v = true;
            break;
        }
    }
    return v;
}

export { primitive_strict_or };