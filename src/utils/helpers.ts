export const isValidUrl = (str: string): boolean => {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch (err) {
    console.error(`${str} is not a valid url`);
    return false;
  }
};

export const isValidHandle = (handle: string): boolean => {
  return !!handle && !isValidUrl(handle) && !handle.includes('@');
};
