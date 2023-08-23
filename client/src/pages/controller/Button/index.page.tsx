import { useMemo } from 'react';
import type { ActionModel } from 'src/types/types';
import styles from './index.module.css';

const arrowStyles = {
  up: `${styles['top-row']} ${styles['middle-column']}`,
  left: `${styles['middle-row']} ${styles['left-column']}`,
  right: `${styles['middle-row']} ${styles['right-column']}`,
  down: `${styles['bottom-row']} ${styles['middle-column']}`,
  ul: `${styles['top-row']} ${styles['left-column']} ${styles.ul}`,
  ur: `${styles['right-column']} ${styles['top-row']} ${styles.ur}`,
  dl: `${styles['bottom-row']} ${styles['left-column']} ${styles.dl}`,
  dr: `${styles['bottom-row']} ${styles['right-column']} ${styles.dr}`,
};

export const ArrowButton = ({
  action,
  text,
  onClick,
}: {
  action: ActionModel;
  text: string;
  onClick: () => void;
}) => {
  return useMemo(
    () => (
      <button className={`${styles.button} ${arrowStyles[action]}`} onClick={onClick}>
        {text}
      </button>
    ),
    [onClick, text, action]
  );
};
