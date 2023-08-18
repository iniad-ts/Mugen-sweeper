import styles from './index.module.css';

const Controller = () => {
  return (
    <div className={styles.controller}>
      <div className={styles['cross-container']}>
        <div className={styles['cross-layout']}>
          <button className={styles['cross-layout-position-top']}>▲</button>
          <button className={styles['cross-layout-position-bottom']}>▼</button>
          <button className={styles['cross-layout-position-left']}>◀</button>
          <button className={styles['cross-layout-position-right']}>▶</button>
        </div>
      </div>
      <div>{/*ディスプレイ*/}</div>
      <div className={styles['button-layout']}>
        <button className={styles['flag-button']}>🚩</button>
        <button className={styles['open-button']}>open</button>
      </div>
    </div>
  );
};

export default Controller;
