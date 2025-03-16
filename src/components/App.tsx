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
import { MyBirthdaysSkeleton } from "./skeletons/MyBirthdaysSkeleton";
import { PageLinks } from "@/globals/constants/links";

import { useAppStore } from "@/stores/use_app_store";

import { Toast } from "./singletons/Toast";
import { ConfirmDialog } from "./singletons/ConfirmDialog";
import { BirthdayFormDialog } from "./singletons/BirthdayFormDialog";
import { is_desktop } from "@/lib/functions/logic/desktop";
import { SettingsEntriesSkeleton } from "./skeletons/SettingsEntriesSkeleton";
import { useTranslation } from "react-i18next";

const MyBirthdays = lazy(() => delay_promise(() => import("../pages/MyBirthdays"), 0));
const Notifications = lazy(() => delay_promise(() => import("../pages/Notifications"), 0));
const Settings = lazy(() => delay_promise(() => import("../pages/Settings/Settings"), 0));

const Appearance = lazy(() => delay_promise(() => import("../pages/Settings/Appearance/Appearance"), 0));
const NotificationsSettings = lazy(() => delay_promise(() => import("../pages/Settings/Notifications/Notifications"), 0));
const Storage = lazy(() => delay_promise(() => import("../pages/Settings/Storage/Storage"), 0));
const Time = lazy(() => delay_promise(() => import("../pages/Settings/Time/Time"), 0));
const Language = lazy(() => delay_promise(() => import("../pages/Settings/Language/Language"), 0));
const Info = lazy(() => delay_promise(() => import("../pages/Settings/Info/Info"), 0));
const SettingsApp = lazy(() => delay_promise(() => import("../pages/Settings/App/App"), 0));
const Update = lazy(() => delay_promise(() => import("../pages/Settings/Update/Update"), 0));

const App = () => {
    const isBooting = useAppStore((state) => state.isBooting);
    const osType = useAppStore((state) => state.osType);
    const setFinishedBooting = useAppStore((state) => state.setFinishedBooting);

    const { i18n } = useTranslation();

    useEffect(() => {
        setFinishedBooting();
    }, []);

    useEffect(() => {
        if (i18n.resolvedLanguage) {
            document.documentElement.lang = i18n.resolvedLanguage;
            document.documentElement.dir = i18n.dir(i18n.resolvedLanguage);
        }
    }, [i18n.resolvedLanguage]);

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
                        {is_desktop(osType) && (
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

    if (isBooting) return <></>;

    return (
        <>
            <ConfirmDialog/>
            <BirthdayFormDialog/>
            <RouterProvider router={_router}/>
            <Toast/>
        </>
    );
};

export default App;