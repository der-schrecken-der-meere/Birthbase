// Packages
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// External features
import { useCMDKStore } from '@/features/navigation/stores/use_cmdk';

const useShortcuts = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const setCMDKIsOpen = useCMDKStore((state) => state.setIsOpen); 

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (pathname !== "/settings") navigate("/settings");
                return;
            }
            if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (pathname !== "/notifications") navigate("/notifications");
                return;
            }
            if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCMDKIsOpen(true);
            }
        };
        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        }
    }, [pathname]);
};

export {
    useShortcuts,
};