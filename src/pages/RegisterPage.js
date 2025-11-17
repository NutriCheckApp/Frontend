import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // TODO: 회원가입 API 호출
    console.log('회원가입 페이지에서 시도', { name, email });
    setError('');

    // 회원가입 후 홈으로 이동
    navigate('/');
  };

  return (
    <div className={styles.pageWrap} style={{ padding: '48px 16px' }}>
      <div className={styles.modal} style={{ position: 'static', boxShadow: 'none', maxWidth: 680, margin: '0 auto' }}>
        <h2 className={styles.title}>회원가입</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            이름
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
            />
          </label>

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
              placeholder="최소 6자"
            />
          </label>

          <label className={styles.label}>
            비밀번호 확인
            <input
              className={styles.input}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="비밀번호 확인"
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
