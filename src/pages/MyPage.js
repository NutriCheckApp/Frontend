import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

const MyPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const jwt = localStorage.getItem('jwt');
      
      console.log('🔑 JWT Token:', jwt ? 'exists' : 'none');
      
      if (!jwt) {
        setError('로그인이 필요합니다.');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // JWT 토큰으로 사용자 정보 조회
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User data:', data);
        setUserInfo(data);
      } else if (response.status === 401) {
        setError('로그인이 만료되었습니다.');
        localStorage.removeItem('jwt');
        setTimeout(() => navigate('/'), 2000);
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`서버 오류: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ 사용자 정보 로딩 실패:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityLabel = (level) => {
    switch (level) {
      case 'INACTIVE': return '비활동적';
      case 'NORMAL': return '보통';
      case 'ACTIVE': return '활동적';
      case 'VERY_ACTIVE': return '매우 활동적';
      default: return level;
    }
  };

  const getGenderLabel = (gender) => {
    return gender === 'M' ? '수컷' : '암컷';
  };

  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrap}>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorMessage}>⚠️ {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <img src="/background.png" alt="bg" className={styles.bgImage} />
      <div className={styles.bgOverlay} />
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h2 className={styles.title}>내 정보</h2>
          
          {userInfo && (
            <div className={styles.infoSection}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>👤 사용자 정보</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>사용자명</span>
                    <span className={styles.value}>{userInfo.username}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>이메일</span>
                    <span className={styles.value}>{userInfo.email}</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🐕 반려견 정보</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>무게</span>
                    <span className={styles.value}>{userInfo.pet_weight} kg</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>성별</span>
                    <span className={styles.value}>{getGenderLabel(userInfo.Gender)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>나이</span>
                    <span className={styles.value}>
                      {userInfo.petAge}개월 ({Math.floor(userInfo.petAge / 12)}년 {userInfo.petAge % 12}개월)
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>활동 수준</span>
                    <span className={styles.value}>{getActivityLabel(userInfo.activityLevel)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
