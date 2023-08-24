import { useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import { maxMin } from 'src/utils/maxMIn';
import styles from './index.module.css';

const Button = ({
  className,
  onClick,
  text,
}: {
  className: string;
  onClick: () => void;
  text: string;
}) => (
  <button onClick={onClick} className={`${styles.button} ${className}`}>
    {text}
  </button>
);

const rowModel = [
  { text: '', num: -10 },
  { text: '', num: -1 },
  { text: 'text', num: 0 },
  { text: '+', num: 1 },
  { text: '+', num: 10 },
];

const OptionRow = ({
  className,
  onClick,
  parameter,
  text,
  max,
  min,
}: {
  className: string;
  onClick: (value: number) => void;
  parameter: number;
  text: string;
  max: number;
  min: number;
}) => (
  <div className={className}>
    {rowModel.map((section, i) =>
      section.text === 'text' ? (
        <div className={styles.text} key={i}>
          {text}
        </div>
      ) : (
        <Button
          className={styles.button}
          onClick={() => onClick(maxMin(max, min, parameter + section.num))}
          text={section.text + String(section.num)}
          key={i}
        />
      )
    )}
  </div>
);

const Home = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [bombRatioPercent, setBombRatioPercent] = useState(10);
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <OptionRow
          className={styles.width}
          onClick={setWidth}
          parameter={width}
          text="width"
          max={300}
          min={1}
        />
        <OptionRow
          className={styles.height}
          onClick={setHeight}
          parameter={height}
          text="height"
          max={200}
          min={1}
        />
        <OptionRow
          className={styles.bomb}
          onClick={setBombRatioPercent}
          parameter={bombRatioPercent}
          text="bombRatioPercent"
          max={50}
          min={10}
        />
        <Button
          className={styles.create}
          onClick={async () =>
            await apiClient.game.config.$post({
              body: { width, height, bombRatioPercent },
            })
          }
          text={`display/${width}*${height} bomb/${bombRatioPercent}%`}
        />
        <Button
          className={styles.delete}
          onClick={async () => await apiClient.game.delete()}
          text="delete"
        />
      </div>
    </div>
  );
};

export default Home;
