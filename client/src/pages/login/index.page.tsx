import type { UserId } from 'commonTypesWithClient/branded';
import crypto from 'crypto';
import { useEffect, useState } from 'react';
import { staticPath } from 'src/utils/$path';
import {
  getUserIdFromLocalStorage,
  loginWithLocalStorage,
  logoutWithLocalStorage,
} from 'src/utils/loginWithLocalStorage';
import { userIdParser } from '../../../../server/service/idParsers';
import styles from './index.module.css';

const Login = () => {
  const [userId, setUserId] = useState<UserId | null>(null);
  const login = () => {
    //FIXME ここでIDを振るのではなく、サーバー側でのプレイヤー生成時にIDを受け取って振るようにする
    const userId = userIdParser.parse(`user-${crypto.randomBytes(16).toString('hex')}`);
    try {
      loginWithLocalStorage(userId);
      setUserId(userId);
    } catch (error) {
      alert('すでにログインしています');
    }
  };

  const logout = () => {
    logoutWithLocalStorage();
    setUserId(null);
  };

  useEffect(() => {
    const userId = getUserIdFromLocalStorage();
    if (userId) {
      setUserId(userIdParser.parse(userId));
    }
  }, []);
  return (
    <div
      className={styles.container}
      style={{ background: `center/cover url('${staticPath.images.odaiba_jpg}')` }}
    >
      <div className={styles.main}>
        <div className={styles.title}>next-frourio-starter</div>
        <div onClick={login}>
          <div className={styles.btn}>
            <span>Login with LocalStorage</span>
          </div>
        </div>
        <div onClick={logout}>
          <div className={styles.btn}>
            <span>logout</span>
          </div>
        </div>
        <div style={{ background: 'white' }}>{userId && <span>userId: {userId}</span>}</div>
      </div>
    </div>
  );
};

export default Login;
