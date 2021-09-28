const isValidUrl = (str) => {
    try {
        const url = new URL(str)
        return true
    } catch (err) {
        console.error(`${str} is not a valid url`)
        return false
    }
}

export { isValidUrl }
