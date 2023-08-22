import styles from './index.module.css';

export const ArrowButton = ({
  grid,
  text,
  onClick,
}: {
  grid: { rowStart: number; rowEnd: number; columnStart: number; columnEnd: number };
  text: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={{
        gridRow: `${grid.rowStart}/${grid.rowEnd}`,
        gridColumn: `${grid.columnStart}/${grid.columnEnd}`,
      }}
    >
      {text}
    </button>
  );
};
