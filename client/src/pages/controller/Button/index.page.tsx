import { useMemo } from 'react';
import type { ActionModel } from 'src/types/types';
import styles from './index.module.css';

export const ArrowButton = ({
  text,
  onClick,
}: {
  action: ActionModel;
  text: string;
  onClick: () => void;
}) => {
  return useMemo(
    () => (
      <button className={`${styles.button}`} onClick={onClick}>
        {text}
      </button>
    ),
    [onClick, text]
  );
};
