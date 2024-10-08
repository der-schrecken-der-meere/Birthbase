import { useEffect, lazy, Suspense } from "react";

// React Routers
import { 
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

// React Redux
import { useDispatch, useSelector } from "react-redux";

// Pages
import Home from './pages/Home';

// Layouts
import MainLayout from './layouts/MainLayout';

// Store Slices
import { isTauri } from "../globals/constants/environment";
import { initTauri } from "../backend/init";

import { AppDispatch, RootState } from "./store/store";
import init from "./init";
import { setBooting } from "./store/app/appSlice";
import NotFound from "./pages/NotFound";
import { promise_delay } from "@/lib/main_util";
import { PageWrapperSkeleton, SettingsEntriesSkeleton } from "./components/PageWrapper";
import { Skeleton } from "./components/ui/skeleton";

const MyBirthdays = lazy(() => promise_delay(() => import("./pages/MyBirthdays"), 1000));
const Settings = lazy(() => promise_delay(() => import("./pages/Settings/Settings"), 1000));
const Appearance = lazy(() => promise_delay(() => import("./pages/Settings/Appearance/Appearance"), 1000));
const Notifications = lazy(() => promise_delay(() => import("./pages/Settings/Notifications/Notifications"), 1000));
const Info = lazy(() => promise_delay(() => import("./pages/Settings/Info/Info"), 1000));
const Storage = lazy(() => promise_delay(() => import("./pages/Settings/Storage/Storage"), 1000));
const Time = lazy(() => promise_delay(() => import("./pages/Settings/Time/Time"), 1000));
const Language = lazy(() => promise_delay(() => import("./pages/Settings/Language/Language"), 1000));

const App = () => {
    const isBooting = useSelector((state: RootState) => state.app.isBooting);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        (async () => {
            if (isTauri) await initTauri(dispatch);
            await init(dispatch);

            dispatch(setBooting(false));
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
                    <Route path="/settings" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>
                                <SettingsEntriesSkeleton entries={6}/>
                            </PageWrapperSkeleton>
                        }>
                            <Settings/>
                        </Suspense>
                    }/>
                    <Route path="/settings/appearance" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>
                                <SettingsEntriesSkeleton entries={2}/>
                            </PageWrapperSkeleton>
                        }>
                            <Appearance/> 
                        </Suspense>
                    }/>
                    <Route path="/settings/notifications" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>
                                <SettingsEntriesSkeleton entries={1}/>
                            </PageWrapperSkeleton>
                        }>
                            <Notifications/>
                        </Suspense>
                    }/>
                    <Route path="/settings/info" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>

                            </PageWrapperSkeleton>
                        }>
                            <Info/>
                        </Suspense>
                    }/>
                    <Route path="/settings/storage" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>
                                <SettingsEntriesSkeleton entries={1} />
                            </PageWrapperSkeleton>
                        }>
                            <Storage/>
                        </Suspense>
                    }/>
                    <Route path="/settings/time" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>

                            </PageWrapperSkeleton>
                        }>
                            <Time/>
                        </Suspense>
                    } />
                    <Route path="/settings/language" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton goBack>

                            </PageWrapperSkeleton>
                        }>
                            <Language/>
                        </Suspense>
                    } />
                    <Route path="/my_birthdays" element={
                        <Suspense fallback={
                            <PageWrapperSkeleton className="h-full">
                                <div className="inline-block">
                                    <Skeleton className="w-[12.5rem] h-8"/>
                                </div>
                                <div className="py-4">
                                    <Skeleton className="h-10 w-full"/>
                                </div>
                                <Skeleton className="h-36 w-full"/>
                                <div className="py-2 mt-auto">
                                    <Skeleton className="h-8 w-full"/>
                                </div>
                            </PageWrapperSkeleton>
                        }>
                            <MyBirthdays/>
                        </Suspense>
                    }/>
                </Route>
            </Route>
        )
    );

    if (isBooting) return null;

    return (
        <RouterProvider router={_router}/>
    )
}

export default App;
