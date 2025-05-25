const useHistory = () => {
    let canGoBack = false;
    if (Object.hasOwn(history.state, "idx")) {
        if (history.state.idx) canGoBack = true;
    }

    return {
        canGoBack,
    };
};

export { useHistory };