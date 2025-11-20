import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ onClose, onOpenRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    // TODO: 실제 로그인 API 호출 지점
    console.log('로그인 시도', { username, password });
    setError('');
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            아이디
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username1"
            />
          </label>
          <label className={styles.label}>
            비밀번호
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.submit} type="submit">로그인</button>
        </form>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.link}
            onClick={() => { if (onOpenRegister) onOpenRegister(); }}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

