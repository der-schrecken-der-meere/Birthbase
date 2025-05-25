const binary_search = <T>(
    array: T[],
    element: T,
    compare: (arrayItem: T, newItem: T) => number,
    sort_asc: boolean = true
): [number, boolean] => {
    let start = 0;
    let end = array.length;
    let found = false;

    if (!array.length) {
        return [0, false];
    }

    while (start < end) {
        const mid = (start + end) >> 1; // Bitwise floor((start + end) / 2)
        const cmp = compare(array[mid], element);

        const dir = (sort_asc ? cmp < 0 : cmp > 0) ? 1 : 0;

        if (cmp === 0) found = true;

        // Branchless update
        start = dir ? (mid + 1) : start;
        end = dir ? end : mid;
    }

    return [start, found];
};

export { binary_search };