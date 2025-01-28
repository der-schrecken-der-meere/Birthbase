import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const useShortcuts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (location.pathname !== "/settings") navigate("/settings");
                return;
            }
            if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (location.pathname !== "/notifications") navigate("/notifications");
                return;
            }
        };
        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        }
    }, [location.pathname]);
}

export default useShortcuts