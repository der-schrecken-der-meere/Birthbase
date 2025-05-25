import type { AppNavigationStore } from "../types/store";
import { create } from "zustand";

const useNavigationStore = create<AppNavigationStore>()((set) => ({
    pageTitle: "",
    breadcrumbs: [],
    setBreadcrumbs: (breadcrumbs) => {
        set(() => ({ breadcrumbs }));
    },
    setPageTitle: (pageTitle) => {
        set(() => ({ pageTitle }));
    },
}));

export { useNavigationStore };