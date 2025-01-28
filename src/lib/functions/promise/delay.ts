/**
 * Delays a promise
 * 
 * @param promise A function returning a promise
 * @param delay Milliseconds
 */
const delay_promise = <T>(promise: () => Promise<T>, delay: number): Promise<T> => {
    return new Promise((resolve) => {
        const to = setTimeout(() => {
            clearTimeout(to);
            resolve(promise());
        }, delay);
    });
}

export { delay_promise };