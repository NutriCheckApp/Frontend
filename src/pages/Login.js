import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ onClose, onOpenRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // TODO: 실제 로그인 API 호출 지점
    console.log('로그인 시도', { email, password });
    setError('');

    // 임시: 로그인 성공 가정 후 모달 닫기
    if (onClose) onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
        <h2 className={styles.title}>로그인</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            이메일
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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

