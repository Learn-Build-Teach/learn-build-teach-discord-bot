const isValidUrl = (str: string): boolean => {
  try {
    new URL(str)
    return true
  } catch (err) {
    console.error(`${str} is not a valid url`)
    return false
  }
}

export { isValidUrl }
