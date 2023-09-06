import { useQRCode } from 'next-qrcode';
import { useEffect, useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './index.module.css';

type Size = {
  width: number;
  height: number;
};

const QRCode = () => {
  const [ip, setIp] = useState<string>('');
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { Canvas } = useQRCode();

  useEffect(() => {
    const fetchIp = async () => {
      const res = await apiClient.ip.$get();
      if (res === null) return;

      setIp(res);
    };
    fetchIp();

    const timer = setInterval(() => {
      fetchIp();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span>無限</span>スイーパー
      </h1>
      {ip !== '' && (
        <Canvas
          text={`${ip}/controller`}
          options={{
            type: 'image/png',
            errorCorrectionLevel: 'L',
            width: Math.min(windowSize.width, windowSize.height) * 0.8,
            color: {
              dark: '#333',
              light: '#fff0',
            },
          }}
        />
      )}
    </div>
  );
};

export default QRCode;
