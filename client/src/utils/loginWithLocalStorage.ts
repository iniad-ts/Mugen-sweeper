import type { UserId } from 'commonTypesWithClient/branded';
import { userIdParser } from './../../../server/service/idParsers';

export const getUserIdFromLocalStorage = (): UserId | null => {
  const userId = localStorage.getItem('userId');
  if (userId !== null) {
    return userIdParser.parse(userId);
  }
  return null;
};
export const loginWithLocalStorage = (userId: UserId) => {
  const storage = localStorage.getItem('userId');
  if (storage === null) {
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const logoutWithLocalStorage = () => {
  localStorage.clear();
};
