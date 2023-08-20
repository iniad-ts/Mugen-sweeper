export const deepCopy = <T>(object: T): T => JSON.parse(JSON.stringify(object));
