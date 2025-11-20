import React, { useState } from 'react';
import styles from './Register.module.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [goalType, setGoalType] = useState('GAIN');
  const [activityLevel, setActivityLevel] = useState('ACTIVE');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !age || !height || !weight || !goalWeight) {
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
    setError('');
    // 회원가입 처리 로직
  };

  return (
    <div className={styles.pageWrap} style={{ padding: '48px 16px' }}>
      <h2 className={styles.title}>회원가입</h2>
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
          비밀번호 확인
          <input className={styles.input} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="비밀번호 확인" />
        </label>
        <label className={styles.label}>
          나이
          <input className={styles.input} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" min="1" max="150" />
        </label>
        <label className={styles.label}>
          성별
          <select className={styles.input} value={gender} onChange={e => setGender(e.target.value)}>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </label>
        <label className={styles.label}>
          키 (cm)
          <input className={styles.input} type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="180" min="100" max="250" step="0.1" />
        </label>
        <label className={styles.label}>
          체중 (kg)
          <input className={styles.input} type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="80" min="30" max="300" step="0.1" />
        </label>
        <label className={styles.label}>
          목표 체중 (kg)
          <input className={styles.input} type="number" value={goalWeight} onChange={e => setGoalWeight(e.target.value)} placeholder="85" min="30" max="300" step="0.1" />
        </label>
        <label className={styles.label}>
          목표 유형
          <select className={styles.input} value={goalType} onChange={e => setGoalType(e.target.value)}>
            <option value="GAIN">체중 증가</option>
            <option value="LOSE">체중 감소</option>
            <option value="MAINTAIN">체중 유지</option>
          </select>
        </label>
        <label className={styles.label}>
          활동 수준
          <select className={styles.input} value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
            <option value="SEDENTARY">앉아서 생활</option>
            <option value="LIGHT">가벼운 활동</option>
            <option value="MODERATE">보통 활동</option>
            <option value="ACTIVE">활발한 활동</option>
            <option value="VERY_ACTIVE">매우 활발</option>
          </select>
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submit} type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterPage;
