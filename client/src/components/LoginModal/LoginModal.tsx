import React, { useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './LoginModal.module.css';
import Modal from './Modal';

const LoginModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const handleButtonClick = async () => {
    const player = await apiClient.player.create.$post({ body: { name: username } });
    setIsModalOpen(false);
  };
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>モーダルを開く</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.ModalContent}>
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
