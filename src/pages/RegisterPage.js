import React, { useState } from 'react';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dogWeight, setDogWeight] = useState('');
  const [dogGender, setDogGender] = useState('M');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !dogWeight) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    setError('');
    // 회원가입 처리 로직
  };

  return (
    <div className={styles.pageWrap} style={{ padding: '48px 16px' }}>
      <h2 className={styles.title}>강아지 정보 등록</h2>
      <form className={styles.form} onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto' }}>
        <label className={styles.label}>
          사용자명
          <input className={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="username1" />
        </label>
        <label className={styles.label}>
          비밀번호
          <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="최소 6자" />
        </label>
        <label className={styles.label}>
          강아지 무게 (kg)
          <input className={styles.input} type="number" value={dogWeight} onChange={e => setDogWeight(e.target.value)} placeholder="5.5" min="0.5" max="100" step="0.1" />
        </label>
        <label className={styles.label}>
          강아지 성별
          <select className={styles.input} value={dogGender} onChange={e => setDogGender(e.target.value)}>
            <option value="M">수컷</option>
            <option value="F">암컷</option>
          </select>
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submit} type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterPage;
