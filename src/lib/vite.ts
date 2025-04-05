const loadModules = async (modules: {[key: string]: () => Promise<any>}, cb: (module: any|null, index: number) => void) => {
    for (const [index, [, fn]] of Object.entries(Object.entries(modules))) {
        const module = await fn().catch(() => null); 
        cb(module, index as any);
    }
};

export { loadModules }; 