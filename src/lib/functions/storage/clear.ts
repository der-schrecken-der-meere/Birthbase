const clear_local_storage = () => {
    localStorage.clear();
};

const clear_session_storage = () => {
    sessionStorage.clear();
};

const clear_app_storage = () => {
    clear_local_storage();
    clear_session_storage();
};

export {
    clear_local_storage,
    clear_session_storage,
    clear_app_storage,
};