import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Settings from "./pages/Settings";
import MyBirthdays from "./pages/MyBirthdays";
import Home from "./pages/Home";
import ThemeProvider from "./components/ThemeProvider";

function App() {

    const router = (
        <ThemeProvider defaultTheme="dark" storageKey="theme">
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/my_birthdays" element={<MyBirthdays/>}/>
                </Route>
            </Routes>
        </ThemeProvider>
    );

    return (
        <>
            {router}
        </>
    );
}

export default App;
