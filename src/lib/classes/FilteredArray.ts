import { binary_search } from "../functions/array/binary_search.ts";
import { SortedArray } from "./SortedArray.ts";

class FilteredArray <A, T, F extends string|number = number>{
    array: A;
    arrayGetter: (array: A) => T[];
    filter: { [key: string|number]: SortedArray<number> };
    filterCb: (array: T, filter: F) => boolean;
    /** Add element to array and return the new index. If index is negative, the index of element wont be added to one of the filters */
    addCb: (array: A, element: T) => number;
    removeCb: (array: A, element: T) => number;

    private indexCompare(arrayItem: number, newItem: number) {
        return arrayItem - newItem;
    }

    constructor(
        array: A,
        config: {
            arrayGetter: (array: A) => T[];
            filterCb: (array: T, filter: F) => boolean;
            addCb: (array: A, element: T) => number;
            removeCb: (array: A, element: T) => number;
            filter?: F[],
        }
    ) {
        const { arrayGetter, filterCb, filter, addCb, removeCb } = config;
        this.array = array;
        this.arrayGetter = arrayGetter;
        this.filterCb = filterCb;
        this.addCb = addCb;
        this.removeCb = removeCb;
        this.filter = {};
        if (filter) {
            for (const filterItem of filter) {
                this.addFilter(filterItem);
            }
        }
    }

    private updateTail(filter: F, index: number, factor: number) {
        const filter_array = this.filter[filter].array;
        const [filtered_index] = binary_search(filter_array, index, (fa, i) => fa - i);
        const a = filter_array
            .splice(
                filtered_index,
                filter_array.length
            )
            .map(i => i + factor);
        return a;
    }
    
    getFilter(filter: F) {
        if (this.filter[filter]) {
            const arr = this.arrayGetter(this.array);
            return this.filter[filter].array.map((index) => arr[index]);
        }
        return false;
    }

    addFilter(filter: F) {
        if (!this.filter[filter]) this.filter[filter] = new SortedArray(this.indexCompare);
        this.filter[filter].array = this.arrayGetter(this.array).reduce<number[]>(
            (acc, cur, i) => {
                if (this.filterCb(cur, filter)) {
                    acc.push(i);
                }
                return acc;
            },
            [],
        );
    }

    refreshFilter(filter: F) {
        return this.addFilter(filter);
    }

    removeFilter(filter: F) {
        if (Object.hasOwn(this.filter, filter)) {
            delete this.filter[filter]
        }
    }

    addItem(filter: F, element: T) {
        const index = this.addCb(this.array, element);
        for (const filterKey of Object.keys(this.filter)) {
            const filterArray = this.filter[filterKey];
            if (filterKey != filter && filterArray.array.length === 0) {
                continue
            }
            const tail = this.updateTail(filterKey as F, index, 1);
            if (filterKey == filter) {
                filterArray.array.push(index);
            }
            filterArray.array.push(...tail);
        }
    }

    removeItem(filter: F, element: T) {
        const index = this.removeCb(this.array, element);
        if (index === -1) return false;
        for (const filterKey of Object.keys(this.filter)) {
            const filterArray = this.filter[filterKey];
            if (filterKey != filter && filterArray.array.length === 0) {
                continue
            }
            if (filterKey == filter) {
                filterArray.remove(index);
            }
            const tail = this.updateTail(filterKey as F, index, -1);
            filterArray.array.push(...tail);
        }
        return true;
    }

    updateItem(filter: F, old_element: T, new_element: T) {
        const success = this.removeItem(filter, old_element);
        if (success) {
            this.addItem(filter, new_element);
        }
        return success;
    }
}

export { FilteredArray };