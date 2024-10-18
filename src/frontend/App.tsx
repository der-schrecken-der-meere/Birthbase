import { useEffect, lazy, Suspense } from "react";

// React Routers
import { 
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

// Shadcn UI
import { Skeleton } from "./components/ui/skeleton";

// React Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { setBooting } from "./store/app/appSlice";

// Pages
import Home from './pages/Home';
import NotFound from "./pages/NotFound";

// Components
import MainLayout from './layouts/MainLayout';
import { PageWrapperSkeleton, SettingsEntriesSkeleton } from "./components/PageWrapper";

// lib
import { isTauri } from "../globals/constants/environment";
import { initTauri } from "../backend/init";
import init from "./init";
import { promise_delay } from "@/lib/main_util";
import ToastProvider from "./contexts/toastContext";
import ConfirmProvider from "./contexts/confirmContext";

const MyBirthdays = lazy(() => promise_delay(() => import("./pages/MyBirthdays"), 0));
const Settings = lazy(() => promise_delay(() => import("./pages/Settings/Settings"), 0));
const Appearance = lazy(() => promise_delay(() => import("./pages/Settings/Appearance/Appearance"), 0));
const Notifications = lazy(() => promise_delay(() => import("./pages/Settings/Notifications/Notifications"), 0));
const Info = lazy(() => promise_delay(() => import("./pages/Settings/Info/Info"), 0));
const Storage = lazy(() => promise_delay(() => import("./pages/Settings/Storage/Storage"), 0));
const Time = lazy(() => promise_delay(() => import("./pages/Settings/Time/Time"), 0));
const Language = lazy(() => promise_delay(() => import("./pages/Settings/Language/Language"), 0));

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
        <ToastProvider>
            <ConfirmProvider>
                <RouterProvider router={_router}/>
            </ConfirmProvider>
        </ToastProvider>
    )
}

export default App;
