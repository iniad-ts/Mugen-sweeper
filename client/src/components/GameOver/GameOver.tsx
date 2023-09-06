import type { UserId } from 'commonTypesWithClient/branded';
import type { PlayerModel } from 'commonTypesWithClient/models';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './GameOver.module.css';

export const GameOver = ({ userId }: { userId: UserId }) => {
  const [players, setPlayers] = useState<PlayerModel[]>();
  const router = useRouter();

  const fetchPlayer = useCallback(async () => {
    const res = await apiClient.player.$get();
    setPlayers(res);
  }, []);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  const tryAgain = () => {
    router.push('controller');
  };
  const playerRank = players?.findIndex((player) => (player.id = userId));

  if (playerRank === undefined) return;
  const player = players?.[playerRank];
  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <p>you dead ...</p>
        <p>your score : {player?.score}</p>
        <p>your rank : {playerRank + 1}</p>
        <p>{'-'.repeat(20)}</p>
        <button onClick={() => tryAgain()}>try again</button>
      </div>
    </div>
  );
};
