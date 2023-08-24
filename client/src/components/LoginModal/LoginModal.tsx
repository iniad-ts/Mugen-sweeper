import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import { getUserIdFromLocalStorage, loginWithLocalStorage } from 'src/utils/loginWithLocalStorage';
import styles from './LoginModal.module.css';
import Modal from './Modal';

const LoginModal: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');

  const fetchPlayers = useCallback(async () => {
    const res = await apiClient.player.$get();
    const playerId = getUserIdFromLocalStorage();
    const isLoggedIn =
      typeof res.find((player) => Boolean(player) && player.id === playerId) === 'object'
        ? true
        : false;
    if (isLoggedIn) {
      router.push({ query: { playerId } });
    }
  }, [router]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);
  const handleButtonClick = async () => {
    if (username.length === 0) return;
    const player = await apiClient.player.create.$post({ body: { name: username } });
    if (player === null) return <p>game is not found</p>;
    loginWithLocalStorage(player.id);
    router.push({ query: { playerId: player.id } });
  };
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div>
      {/* <button onClick={() => setIsModalOpen(true)}>モーダルを開く</button> */}
      <Modal isOpen onClose={() => null}>
        <div className={styles.modalContent}>
          <h2>Mugen Sweeper</h2>
          <label>ユーザー名:</label>
          <input type="text" placeholder="ユーザー名を入力してください" onChange={onChangeInput} />
          <button onClick={handleButtonClick}>はじめる</button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;
