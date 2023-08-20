import { useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './index.module.css';

const Button = ({
  className,
  onClick,
  text,
}: {
  className: string;
  onClick: any;
  text: string;
}) => (
  <button onClick={onClick} className={(styles.button, className)}>
    {text}
  </button>
);

const Home = () => {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [bombRatioPercent, setBombRatioPercent] = useState(10);
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.width}>
          <Button onClick={() => setWidth(width - 1)} text={'-'} className={styles.center} />
          <div className={styles.center}>width</div>
          <Button onClick={() => setWidth(width + 1)} text={'+'} className={styles.center} />
        </div>
        <div className={styles.height}>
          <Button onClick={() => setHeight(height - 1)} text={'-'} className={styles.center} />
          <div className={styles.center}>height</div>
          <Button onClick={() => setHeight(height + 1)} text={'+'} className={styles.center} />
        </div>{' '}
        <div className={styles.bomb}>
          <Button
            onClick={() => setBombRatioPercent(bombRatioPercent - 1)}
            text={'-'}
            className={styles.center}
          />
          <div className={styles.center}>bombRatioPercent</div>
          <Button
            onClick={() => setBombRatioPercent(bombRatioPercent + 1)}
            text={'+'}
            className={styles.center}
          />
        </div>
        <Button
          className={styles.create}
          onClick={async () =>
            await apiClient.game.config.$post({
              body: { width, height, bombRatioPercent },
            })
          }
          text={`${width}/${height}/${bombRatioPercent}`}
        />
      </div>
    </div>
  );
};

export default Home;
