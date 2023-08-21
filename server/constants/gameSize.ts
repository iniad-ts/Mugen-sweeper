import { gameRepository } from '$/repository/gameRepository';

export const GAME_SIZE = async () => {
  const res = await gameRepository.find();
  if (res === null) return null;
  return { width: res.bombMap[0].length, height: res.bombMap.length };
};
