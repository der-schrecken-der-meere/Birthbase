import { useEffect, lazy, Suspense } from "react";

// React Routers
import { 
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

// Pages
// import Home from '../pages/Home';
import NotFound from "../pages/NotFound";

// Components
import MainLayout from './layouts/MainLayout';

// lib
// import { promise_delay } from "@/lib/main_util";
// import ConfirmProvider from "./contexts/confirmContext";
// import BirthdayFormProvider from "./contexts/birthdayFormContext";
import { SettingsLayout } from "./layouts/SettingsLayout";
import { SettingsEntriesSkeleton } from "./skeletons/SettingsEntriesSkeleton";
import { MyBirthdaysSkeleton } from "./skeletons/MyBirthdaysSkeleton";
import { HomeSkeleton } from "./skeletons/HomeSkeleton";

import { useAppStore } from "@/stores/use_app_store";

import { Toast } from "./singletons/Toast";
import { ConfirmDialog } from "./singletons/ConfirmDialog";
import { BirthdayFormDialog } from "./singletons/BirthdayFormDialog";
import { is_desktop } from "@/lib/functions/logic/desktop";
import { useTranslation } from "react-i18next";
import { isTauri } from "@tauri-apps/api/core";
import { PageLinks } from "@/globals/constants/links";

// Main pages
const Home =                    lazy(() => import("../pages/Home").catch(() => ({ default: () => <></> })));
const MyBirthdays =             lazy(() => import("../pages/MyBirthdays").catch(() => ({ default: () => <></> })));
const Notifications =           lazy(() => import("../pages/Notifications").catch(() => ({ default: () => <></> })));
const Settings =                lazy(() => import("../pages/Settings/Settings").catch(() => ({ default: () => <></> })));

// Settings pages
const Appearance =              lazy(() => import("../pages/Settings/Appearance/Appearance").catch(() => ({ default: () => <></> })));
const NotificationsSettings =   lazy(() => import("../pages/Settings/Notifications/Notifications").catch(() => ({ default: () => <></> })));
const Storage =                 lazy(() => import("../pages/Settings/Storage/Storage").catch(() => ({ default: () => <></> })));
const Time =                    lazy(() => import("../pages/Settings/Time/Time").catch(() => ({ default: () => <></> })));
const Language =                lazy(() => import("../pages/Settings/Language/Language").catch(() => ({ default: () => <></> })));
const Info =                    lazy(() => import("../pages/Settings/Info/Info").catch(() => ({ default: () => <></> })));
const SettingsApp =             lazy(() => import("../pages/Settings/__tauri__/App/App").catch(() => ({ default: () => <></> })));
const Update =                  lazy(() => import("../pages/Settings/__tauri__/Update/Update").catch(() => ({ default: () => <></> })));

const App = () => {
    const isBooting = useAppStore((state) => state.isBooting);
    const osType = useAppStore((state) => state.osType);
    const setFinishedBooting = useAppStore((state) => state.setFinishedBooting);

    const { i18n } = useTranslation();

    useEffect(() => {
        // Finish booting when virtual dom is ready
        setFinishedBooting();
    }, []);

    useEffect(() => {
        // Change language and direction when detected language changes
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
                    <Route index element={
                        <Suspense fallback={
                            <HomeSkeleton/>
                        }>
                            <Home/>
                        </Suspense>
                    }/>
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
                        {isTauri() && 
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
                        }
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