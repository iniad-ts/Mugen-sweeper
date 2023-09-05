export const deepCopy = <T>(object: T): T => {
  if (typeof object === 'undefined') return object;
  return JSON.parse(JSON.stringify(object));
};
