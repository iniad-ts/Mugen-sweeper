import type { ActionModel } from 'src/types/types';
import styles from './index.module.css';

const arrowStyles = {
  up: `${styles['topRow']} ${styles['middleColumn']}`,
  left: `${styles['middleRow']} ${styles['leftColumn']}`,
  right: `${styles['middleRow']} ${styles['rightColumn']}`,
  down: `${styles['bottomRow']} ${styles['middleColumn']}`,
  ul: `${styles['topRow']} ${styles['leftColumn']} ${styles.ul}`,
  ur: `${styles['rightColumn']} ${styles['topRow']} ${styles.ur}`,
  dl: `${styles['bottomRow']} ${styles['leftColumn']} ${styles.dl}`,
  dr: `${styles['bottomRow']} ${styles['rightColumn']} ${styles.dr}`,
};

export const ArrowButton = ({
  action,
  text,
  onClick,
}: {
  action: ActionModel;
  text: string;
  onClick: () => void;
}) => (
  <button className={`${styles.button} ${arrowStyles[action]}`} onClick={onClick}>
    {text}
  </button>
);
