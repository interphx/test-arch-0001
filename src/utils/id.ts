export const generateRandomId = (() => {
    let lastId = Number.MIN_SAFE_INTEGER;

    return function() {
        return (lastId++).toString(36);
    };
})();