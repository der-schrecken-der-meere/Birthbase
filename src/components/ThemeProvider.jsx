import React, { useContext, useEffect, useState } from 'react'

const initialState = {
    theme: "system",
    setTheme: () => null,
}
export const ThemeContext = React.createContext(initialState);

const ThemeProvider = ({ 
    children,
    defaultTheme = "system",
    storageKey = "theme",
    ...props
}) => {
    const [theme, setTheme] = useState(() => {
        return (localStorage.getItem(storageKey) || defaultTheme);
    })

    useEffect(() => {
        const root = window.document.body;
        
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

            root.classList.add(systemTheme);
            return
        }

        root.classList.add(theme);
    }, [theme])

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

    return context;
}
export default ThemeProvider