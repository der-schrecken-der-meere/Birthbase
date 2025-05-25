class TimeQueue<T> {
    queue: {
        timestamp: number,
        data: T[],
    }[] = [];
    current_timestamp: number = 0;
    timeout: number = -1;
    on_timestamp: (queueItem: typeof this.queue[0]) => void;

    constructor(on_timestamp: typeof this.on_timestamp) {
        this.on_timestamp = on_timestamp;
    }

    private loop(timeout?: boolean) {
        this.reset_timeout();
        if (this.queue.length === 0) return;

        const { timestamp } = this.queue[0];
        // If the timeout is finished and the first item in the queue is equal to the current timestamp
        // remove the first item from the queue, call the callback with the removed item and 
        // call the loop again
        if (timeout && this.current_timestamp === timestamp) {
            const copy = this.queue.shift() as typeof this.queue[0];
            this.on_timestamp(copy);
            this.current_timestamp = 0;
        }
        
        // If the current timestamp is not equal to the first item in the queue
        // set current timestamp to the first item in the queue
        // and call the timeout
        if (this.current_timestamp !== timestamp) {
            this.current_timestamp = timestamp;
        }

        this.timeout = setTimeout(() => {
            this.loop(true);
        }, this.current_timestamp - Date.now());
    }

    reset_timeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = -1;
        }
    };

    search_by_timestamp(timestamp: number) {
        return this.queue.find((item) => item.timestamp === timestamp);
    }

    search_by_data(cb: (item: T) => boolean) {
        let found = undefined;
        for (const [index, timestampChunk] of this.queue.entries()) {
            const foundIndex = timestampChunk.data.findIndex(cb);
            if (foundIndex !== -1) {
                found = this.queue[index];
                break;
            }
        }
        return found;
    }

    add_data(chunks: (typeof this.queue)) {
        this.reset_timeout();
        chunks.forEach((chunk) => {
            const foundIndex = this.queue.findIndex((item) => chunk.timestamp <= item.timestamp);
            if (foundIndex !== -1) {
                if (this.queue[foundIndex].timestamp === chunk.timestamp) {
                    this.queue[foundIndex].data.push(...chunk.data);
                } else {
                    this.queue.splice(foundIndex, 0, chunk);
                }
            } else {
                this.queue.push(chunk);
            }
        });
        this.loop();
    }

    /**
     * Remove all data items that are included in `chunks`
     * 
     * @param chunks Items that should be deleted
     * @param filterCb A callback that indicates which item should be deleted
     * @param skipLoop Whether the loop method should be called
     * @returns An array of deleted elements. If the element to delete is not found, null is returned instead. The same applies to data arrays.
     */
    remove_data(
        chunks: {
            timestamp: number,
            data: (T extends object ? Partial<T> : T)[],
        }[],
        filterCb: (
            queue_item: T,
            chunk_item: T extends object ? Partial<T> : T
        ) => boolean,
        skipLoop?: boolean
    ) {
        this.reset_timeout();
        const removed_items = chunks.map<({
            timestamp: number,
            data: (T|null)[],
        }|null)>(
            ({ timestamp, data }) => {
                const foundIndex = this.queue.findIndex((item) => item.timestamp === timestamp);
                if (foundIndex !== -1) {
                    const items: (T|null)[] = [];
                    data.forEach((item) => {
                        const queueData = this.queue[foundIndex].data;
                        const queueItemFoundIndex = queueData.findIndex((queue_item) => filterCb(queue_item, item));
                        if (queueItemFoundIndex !== -1) {
                            items.push(queueData.splice(queueItemFoundIndex, 1)[0]);
                        } else {
                            items.push(null);
                        }
                    });

                    // this.queue[foundIndex].data = this.queue[foundIndex].data.filter((item) => cur.data.findIndex((chunk_item) => filterCb(item, chunk_item)) === -1);
                    if (this.queue[foundIndex].data.length === 0) {
                        this.queue.splice(foundIndex, 1);
                    }

                    return {
                        timestamp,
                        data: items,
                    };
                }
                return null;
            },
        );
        if (!skipLoop) {
            this.loop();
        }
        return removed_items;
    }

    /**
     * Delete all timestamps and their data
     * 
     * @param timestamps An array of timestamps to delete
     * @param skipLoop Whether the loop method should be called
     * @returns An array of deleted elements. If the element to delete is not found, null is returned instead.
     */
    remove_timestamp(
        timestamps: number[],
        skipLoop?: boolean
    ) {
        const removed_items = timestamps.map<{
            timestamp: number;
            data: T[];
        } | null>((timestamp) => {
            const index = this.queue.findIndex((queueItem) => queueItem.timestamp === timestamp);
            if (index === -1) return null;
            return this.queue.splice(index, 1)[0];
        });

        if (!skipLoop) {
            this.loop();
        }
        
        return removed_items;
    }

    /**
     * Updates the data with the new data specified in `new_item`.
     * 
     * The updated values will be inserted at the end of their respective arrays.
     * 
     * @param chunks An array of values to update
     * @param filterCb A callback function that returns whether the item should be updated
     */
    update_data(
        chunks: ({
            timestamp: number,
            data: {
                old_item: T extends object ? Partial<T> : T,
                new_item: T extends object ? Partial<T> : T,
            }[],
        }[]),
        filterCb: (
            queue_item: T,
            chunk_item: T extends object ? Partial<T> : T
        ) => boolean,
    ) {
        const old_data = chunks.map(({
            timestamp,
            data, 
        }) => {
            // old_item.data = old_item.data[0];
            const old_items = data.map((old_item) => old_item.old_item);
            return {
                timestamp,
                data: old_items,
            };
        });
        const removed_items = this.remove_data(old_data as any, filterCb, true);

        const new_data = removed_items.reduce<typeof this.queue>(
            (acc, cur, i) => {
                if (cur) {
                    const { data, timestamp } = cur;
                    const mapped = data.reduce<T[]>(
                        (acc2, cur2, j) => {
                            const ref = chunks[i].data[j].new_item;
                            if (cur2 !== null && cur2 !== undefined) {
                                if (typeof cur2 === "object") {
                                    acc2.push({
                                        ...cur2,
                                        ...(ref as T),
                                    });
                                } else {
                                    acc2.push(ref as T);
                                }
                            }
                            return acc2;
                        },
                        []
                    );
                    acc.push({
                        timestamp,
                        data: mapped,
                    })
                }
                return acc;
            },
            []
        );
        this.add_data(new_data);
    }

    update_timestamp(
        timestamps: {old_timestamp: number, new_timestamp: number}[]
    ) {
        const old_data = timestamps.map(({
            old_timestamp,
        }) => {
            return old_timestamp
        });
        const removed_items = this.remove_timestamp(old_data, true);

        const new_data = removed_items.reduce<typeof this.queue>(
            (acc, cur, i) => {
                if (cur) {
                    acc.push({
                        ...cur,
                        timestamp: timestamps[i].new_timestamp,
                    });
                }
                return acc;
            },
            []
        );
        this.add_data(new_data);
    }
};

export { TimeQueue };