import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Settings from "./pages/Settings";
import MyBirthdays from "./pages/MyBirthdays";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import FromBirthday from "./pages/FormBirthday";
import ThemeProvider from "./components/ThemeProvider";

import { invoke } from "@tauri-apps/api";

invoke("greet", {"name": "Hans"}).then((res) => alert(res)).catch((e) => alert(e));

function App() {

    const _router = createBrowserRouter(
        createRoutesFromElements(
            <Route
                path="/"
                element={<MainLayout/>}
                errorElement={<NotFound/>}
            >
                <Route errorElement={<NotFound/>}>
                    <Route index element={<Home/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="my_birthdays" element={<MyBirthdays/>}/>
                </Route>
            </Route>
        )
    );

    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="theme">
                <RouterProvider router={_router}/>
            </ThemeProvider>
        </>
    );
}

export default App;
