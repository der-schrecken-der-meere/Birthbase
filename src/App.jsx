import { useEffect, lazy } from "react";

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
import Home from "./pages/Home";
// import NotFound from "./pages/NotFound";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Store Slices
import { setPermission } from "./store/notification/notificationSlice";

const MyBirthdays = lazy(() => import("./pages/MyBirthdays"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("fafasf");

        navigator.permissions.query({
            name: "notifications",
        }).then((perm) => {
            dispatch(setPermission(perm.state));
            perm.onchange = (e) => {
                dispatch(setPermission(e.target.state));
            }
        })
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
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="my_birthdays" element={
                        <MyBirthdays/>
                    }/>
                </Route>
            </Route>
        )
    );

    return (
        <RouterProvider router={_router}/>
    );
}

export default App;
