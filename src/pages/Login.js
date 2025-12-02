import React, { useState } from 'react';
import styles from './Login.module.css';

const API_URL = 'http://localhost:8080/api/v1/auth/login';

const Login = ({ onClose, onOpenRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    const loginData = {
      username: username,
      password: password
    };

    try {
      console.group('🔐 로그인 API 호출');
      console.log('📍 API URL:', API_URL);
      console.log('📤 요청 데이터:', loginData);
      console.log('⏰ 호출 시각:', new Date().toLocaleTimeString());

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      console.log('📡 응답 상태:', response.status);
      console.log('📋 응답 헤더:', Object.fromEntries(response.headers.entries()));

      // 응답 본문을 먼저 읽기
      const responseText = await response.text();
      console.log('📄 응답 본문:', responseText);

      if (!response.ok) {
        console.error('❌ 로그인 실패:', response.status);
        
        if (response.status === 401) {
          setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        } else if (response.status === 403) {
          setError('🚫 접근이 거부되었습니다. CSRF 설정을 확인해주세요.');
        } else if (response.status === 404) {
          setError('로그인 API를 찾을 수 없습니다.');
        } else if (response.status === 500) {
          setError('서버 내부 오류가 발생했습니다.');
        } else {
          setError(`로그인 실패: ${response.status}`);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      // JSON 파싱
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ JSON 파싱 오류:', parseError);
        throw new Error('서버 응답을 읽을 수 없습니다.');
      }

      console.log('✅ 로그인 성공:', data);

      // JWT 토큰 저장 (응답 구조에 맞게)
      if (data.jwt) {
        localStorage.setItem('jwt', data.jwt);
        console.log('💾 JWT 토큰 저장 완료');
      }
      
      if (data.username) {
        localStorage.setItem('username', data.username);
        console.log('💾 사용자명 저장 완료:', data.username);
      }

      // 팝업으로 로그인 성공 알림
      alert('로그인 성공!');
      
      if (onClose) onClose();
      // 페이지 새로고침으로 로그인 상태 반영
      window.location.reload();

    } catch (err) {
      console.error('❌ 로그인 오류:', err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('🔌 서버에 연결할 수 없습니다. Spring Boot 서버(http://localhost:8080)가 실행 중인지 확인해주세요.');
        console.error('🔧 해결방법:');
        console.error('1. Spring Boot 애플리케이션 실행 확인');
        console.error('2. CORS 설정 확인');
        console.error('3. 포트 8080 사용 가능 여부 확인');
      } else if (!error) {
        // 이미 설정된 error가 없을 때만 기본 메시지 설정
        setError(`오류가 발생했습니다: ${err.message}`);
      }
    } finally {
      console.groupEnd();
      setIsLoading(false);
    }
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
              placeholder="testUser03"
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.submit} type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.link}
            onClick={() => { if (onOpenRegister) onOpenRegister(); }}
          >
            회원가입
          </button>
          {error && error.includes('서버에 연결할 수 없습니다') && (
            <button
              type="button"
              className={styles.testButton}
              onClick={async () => {
                console.clear();
                console.log('🔍 서버 연결 테스트 시작...');
                try {
                  const response = await fetch('http://localhost:8080/api/v1/login', { 
                    method: 'OPTIONS',
                    signal: AbortSignal.timeout(5000)
                  });
                  console.log('✅ 서버 연결 성공:', response.status);
                  alert(`서버 연결 성공! 상태: ${response.status}\n콘솔에서 자세한 정보를 확인하세요.`);
                } catch (err) {
                  console.error('❌ 서버 연결 실패:', err);
                  alert(`서버 연결 실패: ${err.message}\n콘솔에서 자세한 정보를 확인하세요.`);
                }
              }}
            >
              서버 연결 테스트
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;