const calc_storage_size = (type: Storage) => {
    let n_size = 0;

    for (const key in type) {
        if (Object.hasOwn(type, key)) {
            n_size += (type[key].length + key.length) * 2
        }
    }

    return n_size;
};

const calc_local_storage_size = () => {
    return calc_storage_size(localStorage);
};

const calc_session_storage_size = () => {
    return calc_storage_size(sessionStorage);
};

const calc_app_storage_size = async () => {
    const obj_size = await navigator.storage.estimate();
    return obj_size;
};

export {
    calc_local_storage_size,
    calc_session_storage_size,
    calc_app_storage_size,
};