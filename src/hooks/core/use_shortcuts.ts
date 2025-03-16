import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const useShortcuts = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

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