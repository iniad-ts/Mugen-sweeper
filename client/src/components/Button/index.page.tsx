import styles from './index.module.css';

export const ArrowButton = ({
  gridRowColumn,
  text,
  onClick,
}: {
  gridRowColumn: number[];
  text: string;
  onClick: () => void;
}) => {
  const [a, b, c, d] = gridRowColumn;
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={{ gridRow: `${a}/${b}`, gridColumn: `${c}/${d}` }}
    >
      {text}
    </button>
  );
};
