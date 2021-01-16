const isValidUrl = (str) => {
    try {
        const url = new URL(str);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

module.exports = {
    isValidUrl,
};
