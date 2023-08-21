import styles from './index.module.css';

export const Button = ({
  className,
  text,
  onClick,
}: {
  className: string;
  text: string;
  onClick: () => void;
}) => (
  <button className={`${className} ${styles.button} `} onClick={onClick}>
    {text}
  </button>
);
