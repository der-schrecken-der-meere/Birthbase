const to_array = <T>(element: any): T[] => {
    if (Array.isArray(element)) return element;
    return [element];
};

export { to_array };