exports.pickProperties = (obj, properties) => {
    const result = {};
    for (const property of properties) {
        result[property] = obj[property];
    }
    return result;
};