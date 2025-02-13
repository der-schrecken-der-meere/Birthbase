import { useEffect, lazy, Suspense } from "react";

// React Routers
import { 
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

// Pages
import Home from '../pages/Home';
import NotFound from "../pages/NotFound";

// Components
import MainLayout from './layouts/MainLayout';

// lib
// import { promise_delay } from "@/lib/main_util";
// import ConfirmProvider from "./contexts/confirmContext";
// import BirthdayFormProvider from "./contexts/birthdayFormContext";
import { SettingsLayout } from "./layouts/SettingsLayout";
import { delay_promise } from "@/lib/functions/promise/delay";
import { isTauri } from "@tauri-apps/api/core";
import { MyBirthdaysSkeleton } from "./skeletons/MyBirthdaysSkeleton";
import { PageLinks } from "@/globals/constants/links";
import { init_tauri } from "@/init/tauri_init";

import { unset_is_booting, use_app_store } from "@/hooks/use_app_store";

import { Toast } from "./singletons/Toast";
import { ConfirmDialog } from "./singletons/ConfirmDialog";
import { BirthdayFormDialog } from "./singletons/BirthdayFormDialog";
import { is_desktop } from "@/lib/functions/logic/desktop";
import { SettingsEntriesSkeleton } from "./skeletons/SettingsEntriesSkeleton";

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
const Update = lazy(() => delay_promise(() => import("../pages/Settings/Update/Update"), 0));

const App = () => {
    const is_booting = use_app_store((state) => state.is_booting);

    useEffect(() => {
        (async () => {
            unset_is_booting();
        })();
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
                                <SettingsEntriesSkeleton entries={8}/>
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
                        {is_desktop(use_app_store.getState().os_type) && (
                            <Route
                                path={PageLinks.SETTINGS_UPDATE}
                                element={
                                    <Suspense fallback={
                                        <></>
                                    }>
                                        <Update/>
                                    </Suspense>
                                }
                            />
                        )}
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

    if (is_booting) return null;

    return (
        <>
            <ConfirmDialog/>
            <BirthdayFormDialog/>
            <RouterProvider router={_router}/>
            <Toast/>
        </>
    )
}

export default App;