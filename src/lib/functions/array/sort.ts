/**
 * Returns a new array with the added element.
 */
const add_sorted_array = <T>(arr: T[], new_element: T, cb: (value: T) => boolean) => {
    const arr_sorted = [...arr];
    const n_index = find_sorted_array_index(arr_sorted, cb);
    arr_sorted.splice(n_index, 0, new_element);
    return arr_sorted;
};

/**
 * Returns a new array with the changed element.
 */
const upd_sorted_array = <T>(arr: T[], index: number, new_element: T, cb: (value: T) => boolean) => {
    // Prevent changes in original array
    const arr_sorted = [...arr];
    arr_sorted.splice(index, 1);
    return add_sorted_array(arr_sorted, new_element, cb);
}

/**
 * Returns a new array without the deleted element.
 */
const del_sorted_array = <T>(arr: T[], cb: (value: T) => boolean) => {
    const n_index = arr.findIndex(cb);
    if (n_index === -1) return arr;
    const arr_sorted = [...arr];
    arr_sorted.splice(n_index, 1);
    return arr_sorted;
};

/**
 * Finds an element in a sorted array.
 * 
 * If nothing found, the length of the sorted array will be returned.
 */
const find_sorted_array_index = <T>(arr: T[], cb: (value: T) => boolean) => {
    const n_index = arr.findIndex(cb);
    if (n_index === -1) return arr.length;
    return n_index;
};

export {
    add_sorted_array,
    upd_sorted_array,
    del_sorted_array,
    find_sorted_array_index,
};