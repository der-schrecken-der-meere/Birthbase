import { useEffect, lazy, useState } from "react";

// React Routers
import { 
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

// React Redux
import { useDispatch } from "react-redux";

// Pages
// import Settings from "./pages/Settings";
// import MyBirthdays from "./pages/MyBirthdays";
import Home from '@/pages/Home';
// import NotFound from "./pages/NotFound";

// Layouts
import MainLayout from '@/layouts/MainLayout';

// Store Slices
import { isTauri } from "./constants/tauri";
import initTauri from "./backend/init";

import { ModuleLoader } from "./layouts/MainLayout";

import { mediaScreens, setScreen } from "./store/mediaType/mediaTypeSlice";
import { useMediaQuery } from "react-responsive";
import Appearance from '@/pages/Settings/Appearance/Appearance';
import Notifications from "@/pages/Settings/Notifications/Notifications";
import Info from "@/pages/Settings/Info/Info";
import Storage from "@/pages/Settings/Storage/Storage";
import Time from "@/pages/Settings/Time/Time";
import Language from "@/pages/Settings/Language/Language";
import { AppDispatch } from "./store/store";
import init from "./init";

const MyBirthdays = lazy(() => import("./pages/MyBirthdays"));
const Settings = lazy(
    () => 
        // new Promise(resolve => setTimeout(resolve, 300)).then(a => 
            import("./pages/Settings/Settings")
        // )    
);

const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
    const [isLoading, setIsloading] = useState(true);

    const dispatch = useDispatch<AppDispatch>();

    console.log("App wird gerendert");

    useEffect(() => {
        (async () => {
            if (isTauri) await initTauri(dispatch);
            await init(dispatch);

            setIsloading(false);
        })();
    }, []) 

    const _router = createBrowserRouter(
        createRoutesFromElements(
            <Route
                path="/"
                element={<MainLayout/>}
                errorElement={<NotFound/>}
            >
                <Route errorElement={<NotFound/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/settings/appearance" element={<Appearance/>}/>
                    <Route path="/settings/notifications" element={<Notifications/>}/>
                    <Route path="/settings/info" element={<Info/>} />
                    <Route path="/settings/storage" element={<Storage/>} />
                    <Route path="/settings/time" element={<Time/>} />
                    <Route path="/settings/language" element={<Language/>} />
                    <Route path="/my_birthdays" element={<MyBirthdays/>}/>
                </Route>
            </Route>
        )
    );

    return (
        <>
            <MediaQuery/>
            {
                isLoading ? 
                    <div className="h-screen">
                        <ModuleLoader msg="App wird initialisiert" />
                    </div>
                    :
                    <RouterProvider router={_router}/>
            }
        </>
        
    );
}

const MediaQuery = () => {
    const dispatch = useDispatch();

    mediaScreens.forEach(screen => {
        const matches = useMediaQuery(screen.mediaQuery);
        useEffect(() => {
            if (matches) {
                dispatch(setScreen(screen.name));
            }
        }, [matches, dispatch, screen.name]);
    });

    return (null);
}

export default App;
