import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/v1/profile';

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
      
      if (!jwt) {
        setError('로그인이 필요합니다.');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('로그인이 만료되었습니다.');
          localStorage.removeItem('jwt');
          setTimeout(() => navigate('/'), 2000);
        } else if (response.status === 404) {
          setError('사용자 정보를 찾을 수 없습니다.');
        } else if (response.status === 500) {
          const errorText = await response.text();
          console.error('❌ 서버 오류:', errorText);
          setError('🚫 서버 내부 오류가 발생했습니다.');
        } else {
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          setError(`서버 오류: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      
      if (data.pet_list && Array.isArray(data.pet_list) && data.pet_list.length > 0) {
        const pet = data.pet_list[0];
        setUserInfo({
          username: data.username,
          email: data.email,
          pet_weight: pet.pet_weight,
          Gender: pet.pet_gender,
          pet_age: pet.pet_age,
          activityLevel: pet.activity_level,
          dailyCalories: pet.daily_calories,
          dailyCrudeProtein: pet.daily_crude_protein,
          dailyCrudeFat: pet.daily_crude_fat,
          dailyCrudeFiber: pet.daily_crude_fiber,
          dailyCalcium: pet.daily_calcium
        });
      } else {
        setUserInfo(data);
      }

    } catch (err) {
      console.error('❌ 사용자 정보 로딩 실패:', err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('🔌 서버에 연결할 수 없습니다. Spring Boot 서버가 실행 중인지 확인해주세요.');
      } else {
        setError(`오류가 발생했습니다: ${err.message}`);
      }
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
    switch (gender) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'NM': return '중성화 수컷';
      case 'NF': return '중성화 암컷';
      default: return gender;
    }
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
                      {userInfo.pet_age}개월 ({Math.floor(userInfo.pet_age / 12)}년 {userInfo.pet_age % 12}개월)
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>활동 수준</span>
                    <span className={styles.value}>{getActivityLabel(userInfo.activityLevel)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📊 하루 권장 영양 정보</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>칼로리</span>
                    <span className={styles.value}>
                      {userInfo.dailyCalories ? `${userInfo.dailyCalories.toFixed(1)} kcal` : '미설정'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>조단백질</span>
                    <span className={styles.value}>
                      {userInfo.dailyCrudeProtein ? `${userInfo.dailyCrudeProtein.toFixed(1)} g` : '미설정'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>조지방</span>
                    <span className={styles.value}>
                      {userInfo.dailyCrudeFat ? `${userInfo.dailyCrudeFat.toFixed(1)} g` : '미설정'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>조섬유</span>
                    <span className={styles.value}>
                      {userInfo.dailyCrudeFiber ? `${userInfo.dailyCrudeFiber.toFixed(1)} mg` : '미설정'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>칼슘</span>
                    <span className={styles.value}>
                      {userInfo.dailyCalcium ? `${userInfo.dailyCalcium.toFixed(1)} g` : '미설정'}
                    </span>
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
