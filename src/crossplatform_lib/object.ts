const hasProperty = (obj: Object, prop: string) => {
    if ("hasOwn" in Object) {
        return Object.hasOwn(obj, prop);
    } else if ("hasOwnProperty" in obj) {
        return obj.hasOwnProperty(prop);
    } else {
        return prop in obj;
    }
}

export { hasProperty };