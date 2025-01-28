import { AppToastContext } from "../../hooks/useAppToast";

import { ReactNode, useMemo } from "react";

import { Toaster } from "../../components/ui/toaster";

interface AppToastProviderProps {
    children: ReactNode
};

const AppToastProvider = ({
    children
}: AppToastProviderProps) => {

    const contextValue = useMemo(() => ({}), []);

    return (
        <AppToastContext.Provider value={contextValue}>
            {children}
            <Toaster/>
        </AppToastContext.Provider>
    );
}

export { AppToastProvider };