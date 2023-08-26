import Link from 'next/link';
import { useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import { maxMin } from 'src/utils/maxMIn';
import styles from './index.module.css';

type configs = {
  width: number;
  height: number;
  bombRatioPercent: number;
};

const Home = () => {
  const [configs, setConfigs] = useState<configs>({
    width: 10,
    height: 10,
    bombRatioPercent: 10,
  });

  const deleteAll = async () => await apiClient.game.$delete();

  const updateConfig = (key: keyof configs, value: number) => {
    const maxValues = {
      width: 300,
      height: 200,
      bombRatioPercent: 50,
    };
    setConfigs({ ...configs, [key]: maxMin(maxValues[key], 1, value) });
  };

  const saveConfig = async () => {
    await apiClient.game.config.$post({ body: configs });
  };

  const configTexts = {
    width: '幅',
    height: '高さ',
    bombRatioPercent: 'ボム',
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {Object.entries(configs).map(([keyString, value]) => {
          const key = keyString as keyof configs;
          return (
            <>
              <button className={styles.button} onClick={() => updateConfig(key, value - 10)}>
                -10
              </button>
              <button className={styles.button} onClick={() => updateConfig(key, value - 1)}>
                -1
              </button>
              <p className={styles.text}>
                {configTexts[key]} {configs[key]}
              </p>
              <button className={styles.button} onClick={() => updateConfig(key, value + 1)}>
                +1
              </button>
              <button className={styles.button} onClick={() => updateConfig(key, value + 10)}>
                +10
              </button>
            </>
          );
        })}
        <button className={`${styles.create} ${styles.button}`} onClick={saveConfig}>
          作成
        </button>
        <div className={styles.link}>
          <Link href="/game" tabIndex={0}>
            ゲーム画面へ
          </Link>
        </div>
        <button className={`${styles.delete} ${styles.button}`} onClick={deleteAll}>
          削除
        </button>
      </div>
    </div>
  );
};

export default Home;
