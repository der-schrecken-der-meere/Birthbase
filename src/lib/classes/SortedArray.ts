import { binary_search } from "../functions/array/binary_search.ts";

class SortedArray<T> {
    array: T[] = [];
    sort_asc: boolean;
    compare: (arrayItem: T, newItem: T) => number;

    constructor(compare: typeof this.compare, sort_asc: boolean = true) {
        this.sort_asc = sort_asc;
        this.compare = compare;
    }

    add(...elements: T[]) {
        return elements.map((element) => {
            const [index] = binary_search(this.array, element, this.compare, this.sort_asc);
            this.array.splice(index, 0, element);
            return index;
        });
    }

    get(search: ((arrayItem: T, newItem: Partial<T>) => number) | Partial<T>, ...elements: Partial<T>[]) {

        let es: Partial<T>[] = elements;
        let compare: typeof this.compare = this.compare;
        if (typeof search === "function") {
            compare = search as typeof this.compare;
        } else {
            es = [search, ...es];
        }

        return es.map((element) => {
            const [index, found] = binary_search(this.array, element as T, compare, this.sort_asc);
            if (found) return this.array[index];
            return null;
        })
    }

    remove(...elements: T[]) {
        return elements.map((element) => {
            const [index, found] = binary_search(this.array, element, this.compare, this.sort_asc);
            if (found) {
                return { index: index, element: this.array.splice(index, 1)[0] };
            } else {
                return null
            }
        });
    }

    update(updateCb: (oldData: T, newData: T) => T, ...elements: {oldData: T, newData: T}[]) {
        const oldData = elements.map((element) => element.oldData);
        const removedElements = this.remove(...oldData);
        const newData = removedElements.reduce<T[]>((acc, cur, i) => {
            if (cur != null) {
                const newElement = updateCb(cur.element, elements[i].newData);
                acc.push(newElement);
            }
            return acc;
        }, []);
        return this.add(...newData);
    }
}

export { SortedArray };