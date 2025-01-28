const registerServiceWorker = () => {
    return navigator
        .serviceWorker
        .register(new URL("../../sw.ts", import.meta.url), { type: "module", scope: "/" })
        .then((registration) => {
            console.log("Service worker successfully registered");
            return registration;
        })
        .catch((error) => {
            console.error("Unable to register service worker.", error);
        });
}

const init = async () => {
    if (!("serviceWorker" in navigator)) {
        console.info("Service Worker isn't supported on this browser");
        return;
    }
    if (!("PushManager" in window)) {
        console.info("Push isn't supported on this browser");
        return;
    }

    await registerServiceWorker();
}



export { init };