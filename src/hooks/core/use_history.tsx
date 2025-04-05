type useHistoryReturnProps = {
    /** Shows whether the user can go back in the history on this tab */
    canGoBack: boolean,
};

const useHistory = (): useHistoryReturnProps => {
    const canGoBack = (() => {
        if (!history.state) return false;
        if (Object.hasOwn(history.state, "idx")) {
            if (!history.state.idx) return false;
            return true;
        }
        return false;
    })();

    return {
        canGoBack,
    };
};

export type { useHistoryReturnProps };
export { useHistory };