import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

const API_URL = 'http://localhost:8080/api/v1/auth/register';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [petWeight, setDogWeight] = useState('');
  const [petGender, setDogGender] = useState('M');
  const [petAge, setPetAge] = useState(''); 
  const [activityLevel, setActivityLevel] = useState('NORMAL'); 

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);        

  const getActivityLabel = (level) => {
      switch (level) {
          case 'INACTIVE': return 'INACTIVE';
          case 'NORMAL': return 'NORMAL';
          case 'ACTIVE': return 'ACTIVE';
          case 'VERY_ACTIVE': return 'VERY ACTIVE';
          default: return level;
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage('');
    if (!username || !password || !email || !petWeight || !petAge ) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (isNaN(parseFloat(petWeight)) || parseFloat(petWeight) <= 0) {
        setError('유효한 강아지 무게를 입력해주세요.');
        return;
    }
    if (isNaN(parseInt(petAge)) || parseInt(petAge) <= 0) {
        setError('유효한 강아지 나이 (월)를 입력해주세요.');
        return;
    }

     setError('');
        
      // --- 2. Send data to server
      setIsLoading(true);

      const registrationData = {
            username: username,
            email: email,
            password: password,
            pet_weight: parseFloat(petWeight),  
            Gender: petGender,  
            petAge: parseInt(petAge, 10),
            activityLevel: activityLevel,
    };

      try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData), // convert to JSON
            });

            // Spring controller returns json as a string
            const resultText = await response.text(); 

            //  HTTP exception handler (4xx, 5xx)
            if (!response.ok) {
                setError(`등록 실패 (서버 오류): ${response.status}. ${resultText}`);
                throw new Error(`등록 실패 (서버 오류): ${response.status}. ${resultText}`); 
            }
            
            // Success 
            setSuccessMessage(`✅ 회원가입 성공: ${resultText}`);
            
            // Clear form
            setUsername('');
            setPassword('');
            setEmail('');
            setDogWeight('');
            setDogGender('M');
            setPetAge('');
            setActivityLevel('NORMAL');

            // 1초 후 메인 페이지로 이동
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            if (!error) { 
                setError('❌ 네트워크 오류. Spring Boot 서버가 실행 중인지 확인하세요.');
            }
            console.error("Fetch error:", err);
            
        } finally {
            setIsLoading(false);
        }
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
          이메일
          <input className={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="email"/>
        </label>
        <label className={styles.label}>
          비밀번호
          <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="최소 6자" />
        </label>
        <label className={styles.label}>
          강아지 무게 (kg)
          <input className={styles.input} type="number" value={petWeight} onChange={e => setDogWeight(e.target.value)} placeholder="5.5" min="0.5" max="100" step="0.1" />
        </label>
        <label className={styles.label}>
          강아지 성별
          <select className={styles.input} value={petGender} onChange={e => setDogGender(e.target.value)}>
            <option value="M">수컷</option>
            <option value="F">암컷</option>
          </select>
        </label>
        <label className={styles.label}>
          강아지 나이 (개월)
          <input 
            className={styles.input} 
            type="number" 
            value={petAge} 
            onChange={e => setPetAge(e.target.value)} 
            placeholder="12 (= 1년)" 
            min="1" 
            step="1" 
          />
        </label>
        <label className={styles.label}>
          활동 수준
          <select className={styles.input} value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
            <option value="INACTIVE">{getActivityLabel('INACTIVE')}</option>
            <option value="NORMAL">{getActivityLabel('NORMAL')}</option>
            <option value="ACTIVE">{getActivityLabel('ACTIVE')}</option>
            <option value="VERY_ACTIVE">{getActivityLabel('VERY_ACTIVE')}</option>
          </select>
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submit} type="submit" disabled={isLoading}>
          {isLoading ? '등록 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
