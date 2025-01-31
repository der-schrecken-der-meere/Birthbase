import { useEffect, lazy, Suspense } from "react";

// React Routers
import { 
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

// Shadcn UI

// React Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setBooting } from "../store/app/appSlice";

// Pages
import Home from '../pages/Home';
import NotFound from "../pages/NotFound";

// Components
import MainLayout from './layouts/MainLayout';
import { SettingsEntriesSkeleton } from "./PageWrapper";

// lib
import { initTauri } from "../backend/init";
import init from "../frontend/init";
// import { promise_delay } from "@/lib/main_util";
import { AppToastProvider } from "./povider/AppToastProvider";
// import ConfirmProvider from "./contexts/confirmContext";
// import BirthdayFormProvider from "./contexts/birthdayFormContext";
import { SettingsLayout } from "./layouts/SettingsLayout";
import { delay_promise } from "@/lib/functions/promise/delay";
import { ConfirmDialogProvider } from "./povider/ConfirmDialogProvider";
import { BirthdayFormProvider } from "./povider/BirthdayFormProvider";
import { NavbarProvider } from "./povider/NavbarProvider";
import { useAppToast } from "@/hooks/useAppToast";
import { isTauri } from "@tauri-apps/api/core";
import { MyBirthdaysSkeleton } from "./skeletons/MyBirthdaysSkeleton";
import { PageLinks } from "@/globals/constants/links";

type ToastError = {
    description?: string,
    title: string,
};

const MyBirthdays = lazy(() => delay_promise(() => import("../pages/MyBirthdays"), 0));
const Settings = lazy(() => delay_promise(() => import("../pages/Settings/Settings"), 0));
const Appearance = lazy(() => delay_promise(() => import("../pages/Settings/Appearance/Appearance"), 0));
const NotificationsSettings = lazy(() => delay_promise(() => import("../pages/Settings/Notifications/Notifications"), 0));
const Notifications = lazy(() => delay_promise(() => import("../pages/Notifications"), 0));
const Info = lazy(() => delay_promise(() => import("../pages/Settings/Info/Info"), 0));
const Storage = lazy(() => delay_promise(() => import("../pages/Settings/Storage/Storage"), 0));
const Time = lazy(() => delay_promise(() => import("../pages/Settings/Time/Time"), 0));
const Language = lazy(() => delay_promise(() => import("../pages/Settings/Language/Language"), 0));
const SettingsApp = lazy(() => delay_promise(() => import("../pages/Settings/App/App"), 0));

const App = () => {
    const isBooting = useSelector((state: RootState) => state.app.isBooting);
    const dispatch = useDispatch<AppDispatch>();
    const { setErrorNotification } = useAppToast();

    useEffect(() => {
        (async () => {
            if (isTauri()) await initTauri(dispatch);
            await init(dispatch);

            dispatch(setBooting(false));
        })();
    }, []);

    useEffect(() => {
        const onToastError = (e: CustomEvent<ToastError>) => {
            setErrorNotification(e.detail);
        };

        window.addEventListener("toast-error", onToastError as EventListener);

        return () => {
            window.removeEventListener("toast-error", onToastError as EventListener);
        }
    }, []);

    const _router = createBrowserRouter(
        createRoutesFromElements(
            <Route
                path={PageLinks.HOME}
                element={<MainLayout/>}
                errorElement={<NotFound/>}
            >
                <Route errorElement={<NotFound/>}>
                    <Route index element={<Home/>}/>
                    <Route
                        path={PageLinks.SETTINGS}
                        element={<SettingsLayout/>}
                    >
                        <Route index element={
                            <Suspense fallback={
                                <SettingsEntriesSkeleton entries={6}/>
                            }>
                                <Settings/>
                            </Suspense>
                        } />
                        <Route
                            path={PageLinks.SETTINGS_APPEARANCE}
                            element={
                                <Suspense fallback={
                                    <SettingsEntriesSkeleton entries={2}/>
                                }>
                                    <Appearance/> 
                                </Suspense>
                            }
                        />
                        <Route
                            path={PageLinks.SETTINGS_NOTIFICATION}
                            element={
                                <Suspense fallback={
                                    <SettingsEntriesSkeleton entries={2}/>
                                }>
                                    <NotificationsSettings/>
                                </Suspense>
                            }
                        />
                        <Route
                            path={PageLinks.SETTINGS_INFO}
                            element={
                                <Suspense fallback={
                                    <></>
                                }>
                                    <Info/>
                                </Suspense>
                            }
                        />
                        <Route
                            path={PageLinks.SETTINGS_STORAGE}
                            element={
                                <Suspense fallback={
                                    <SettingsEntriesSkeleton entries={1} />
                                }>
                                    <Storage/>
                                </Suspense>
                            }
                        />
                        <Route
                            path={PageLinks.SETTINGS_TIME}
                            element={
                                <Suspense fallback={
                                    <></>
                                }>
                                    <Time/>
                                </Suspense>
                            }
                        />
                        <Route
                            path={PageLinks.SETTINGS_LANGUAGE}
                            element={
                                <Suspense fallback={
                                    <></>
                                }>
                                    <Language/>
                                </Suspense>
                            }
                        />
                        <Route
                            path={PageLinks.SETTINGS_APP}
                            element={
                                <Suspense fallback={
                                    <></>
                                }>
                                    <SettingsApp/>
                                </Suspense>
                            }
                        />
                    </Route>
                    <Route path={PageLinks.MY_BIRTHDAYS} element={
                        <Suspense fallback={
                            <MyBirthdaysSkeleton/>
                        }>
                            <MyBirthdays/>
                        </Suspense>
                    }/>
                    <Route
                        path={PageLinks.NOTIFICATIONS}
                        element={
                            <Suspense
                                fallback={
                                    <></>
                                }
                            >
                                <Notifications/>
                            </Suspense>
                        }
                    />
                </Route>
            </Route>
        )
    );

    if (isBooting) return null;

    return (
        <AppToastProvider>
            <NavbarProvider>
                <ConfirmDialogProvider>
                    <BirthdayFormProvider>
                        <RouterProvider router={_router}/>
                    </BirthdayFormProvider>
                </ConfirmDialogProvider>
            </NavbarProvider>
        </AppToastProvider>
    )
}

export default App;
export type { ToastError };
