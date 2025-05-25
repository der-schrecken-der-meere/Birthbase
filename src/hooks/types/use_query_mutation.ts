type QueryMutationOptions = {
    /** Callback that will be triggerd after a successful operation */
    onSuccess?: () => void,
    /** Callback that will be triggerd after a unsuccessful operation */
    onError?: () => void, 
    /** A translation key for success message. Must be provided in `success.json`.
     * If nothing is defined, no toast will be generated.
     */
    successToast?: string
};

type UseQueryMutationOperations = {
    /** Options for deleting operations */
    deleteOptions?: QueryMutationOptions,
    /** Options for updating operations */
    updateOptions?: QueryMutationOptions,
    /** Options for adding operations */
    addOptions?: QueryMutationOptions,
};

export type {
    QueryMutationOptions,
    UseQueryMutationOperations,
};