import React, { useState, useEffect } from 'react';
import styles from './CalendarPage.module.css';
import Header from '../components/Header';

const API_URL = 'http://localhost:8080/api/v1/calendar';

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const matrix = [];
  let week = new Array(7).fill(null);
  let day = 1;
  // fill initial nulls until first weekday (assuming Mon-start)
  const startIndex = (first.getDay() + 6) % 7; // convert Sun=0 to Mon=0
  for (let i = 0; i < startIndex; i++) week[i] = null;
  for (let i = startIndex; day <= last.getDate(); i++) {
    week[i % 7] = new Date(year, month, day);
    if (i % 7 === 6 || day === last.getDate()) {
      matrix.push(week);
      week = new Array(7).fill(null);
    }
    day++;
  }
  return matrix;
}

const Calendar = ({ onSelect, selectedDate, dailyData = {} }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const matrix = getMonthMatrix(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className={styles.calendarCard}>
      <div className={styles.calHeader}>
        <div className={styles.monthTitle}>{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</div>
        <div className={styles.calNav}>
          <button onClick={prevMonth}>‹</button>
          <button onClick={nextMonth}>›</button>
        </div>
      </div>

      <div className={styles.weekdaysGrid}>
        {weekdays.map((d) => <div key={d} className={styles.weekday}>{d}</div>)}
      </div>

      <div className={styles.daysGrid}>
        {matrix.map((week, wi) => (
          <div key={wi} className={styles.weekRow}>
            {week.map((dt, di) => {
              const isToday = dt && dt.toDateString() === new Date().toDateString();
              const isSelected = dt && selectedDate && dt.toDateString() === selectedDate.toDateString();
              const hasData = dt && dailyData[dt.toDateString()] && 
                (dailyData[dt.toDateString()].morning || 
                 dailyData[dt.toDateString()].lunch || 
                 dailyData[dt.toDateString()].dinner);
              
              return (
                <div
                  key={di}
                  className={`${styles.dayCell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''} ${hasData ? styles.hasData : ''}`}
                  onClick={() => dt && onSelect && onSelect(dt)}
                >
                  <div className={styles.dayNumber}>{dt ? dt.getDate() : ''}</div>
                  {hasData && <div className={styles.dataIndicator}></div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const DogPanel = ({ selectedTime, uploadedImages, onImageUpload, canUpload, selectedDate }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(selectedTime, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentImage = uploadedImages[selectedTime];
  const today = new Date();
  const isToday = selectedDate && selectedDate.toDateString() === today.toDateString();
  const selectedDateObj = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isFuture = selectedDateObj > todayDateObj;

  return (
    <div className={styles.dogCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, gap: '15px' }}>
      {currentImage ? (
        <div className={styles.imageContainer}>
          <img src={currentImage} alt={selectedTime} className={styles.dogPhoto} />
          <div className={styles.imageInfo}>
            <span className={styles.timeLabel}>{
              selectedTime === 'morning' ? '아침' : 
              selectedTime === 'lunch' ? '점심' : '저녁'
            } 식사</span>
            {!canUpload && (
              <span className={styles.dateInfo}>
                {selectedDate.toLocaleDateString('ko-KR')}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.placeholderImage}>
          <span>
            {isFuture ? '미래 날짜입니다' : 
             canUpload ? '사진을 업로드해주세요' : 
             '저장된 사진이 없습니다'}
          </span>
        </div>
      )}
      {canUpload && !isFuture && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id={`file-upload-${selectedTime}`}
          />
          <label htmlFor={`file-upload-${selectedTime}`} className={styles.uploadButton}>
            사진 선택
          </label>
        </>
      )}
    </div>
  );
};

const CalendarPage = () => {
  const [selected, setSelected] = useState(new Date());
  const [timeTab, setTimeTab] = useState('lunch');
  const [uploadedImages, setUploadedImages] = useState({
    morning: null,
    lunch: null,
    dinner: null,
  });

  // API에서 가져온 날짜별 데이터 저장
  const [dailyData, setDailyData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 기본 강아지 사진들 (과거 날짜용)
  const defaultDogImages = {
    morning: '/dog1.jpg',
    lunch: '/dog2.jpg',
    dinner: '/dog3.jpg',
  };

  // 날짜별 이미지 데이터 저장 (로컬 업로드용)
  const [dailyImages, setDailyImages] = useState({});

  // 서버 연결 상태 확인
  const checkServerConnection = async () => {
    try {
      const baseUrl = API_URL.split('/api/')[0]; // http://localhost:8080
      const response = await fetch(baseUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return response.status >= 200 && response.status < 500;
    } catch (err) {
      console.error('서버 연결 확인 실패:', err);
      return false;
    }
  };

  // 특정 날짜의 데이터를 API에서 가져오는 함수
  const fetchDateData = async (date) => {
    setIsLoading(true);
    setError('');
    
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    const dateKey = date.toDateString();
    
    // 이미 가져온 데이터가 있으면 API 호출하지 않음
    if (dailyData[dateKey]) {
      setIsLoading(false);
      return;
    }
    
    try {
      console.log(`API 호출: ${API_URL}?date=${dateString}`);
      
      const response = await fetch(`${API_URL}?date=${dateString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 인증이 필요한 경우 토큰 추가
          // 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      console.log('응답 상태:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('데이터 없음 (404) - 빈 데이터로 설정');
          // 데이터가 없는 경우 빈 객체로 처리
          setDailyData(prev => ({
            ...prev,
            [dateKey]: { morning: null, lunch: null, dinner: null }
          }));
        } else if (response.status === 500) {
          const errorText = await response.text();
          console.error('서버 내부 오류:', errorText);
          setError(`서버 오류가 발생했습니다. (${response.status})`);
        } else if (response.status === 0 || !response.status) {
          // 네트워크 연결 오류
          setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          const errorText = await response.text().catch(() => '알 수 없는 오류');
          console.error('HTTP 오류:', response.status, errorText);
          setError(`서버 오류: ${response.status} - ${errorText}`);
        }
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('받은 데이터:', data);
          setDailyData(prev => ({
            ...prev,
            [dateKey]: data
          }));
        } else {
          console.error('JSON이 아닌 응답:', contentType);
          setError('서버에서 올바르지 않은 응답을 받았습니다.');
        }
      }
    } catch (err) {
      console.error('네트워크 오류:', err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('서버에 연결할 수 없습니다. Spring Boot 서버가 실행 중인지 확인해주세요.');
      } else if (err.name === 'AbortError') {
        setError('요청이 취소되었습니다.');
      } else {
        setError(`네트워크 오류: ${err.message}`);
      }
      
      // 오류 발생 시에도 빈 데이터로 설정 (404가 아닌 경우에만)
      if (!error.includes('서버에 연결할 수 없습니다')) {
        setDailyData(prev => ({
          ...prev,
          [dateKey]: { morning: null, lunch: null, dinner: null }
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log('캘린더 페이지 마운트됨, API URL:', API_URL);
    fetchDateData(selected);
  }, []);

  // 선택된 날짜가 변경될 때 데이터 가져오기
  useEffect(() => {
    fetchDateData(selected);
  }, [selected]);

  const goDay = (dir) => {
    setSelected((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir);
      return d;
    });
  };

  const handleImageUpload = (timeSlot, imageData) => {
    const dateKey = selected.toDateString();
    
    setDailyImages(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [timeSlot]: imageData
      }
    }));
  };

  // 현재 선택된 날짜의 이미지들 가져오기
  const getCurrentDayImages = () => {
    const dateKey = selected.toDateString();
    const today = new Date();
    const isToday = selected.toDateString() === today.toDateString();
    const selectedDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isFuture = selectedDate > todayDate;
    
    // 로컬에서 업로드된 이미지가 있으면 우선 사용
    if (dailyImages[dateKey]) {
      return dailyImages[dateKey];
    }
    
    // API에서 가져온 데이터가 있으면 사용
    if (dailyData[dateKey]) {
      return dailyData[dateKey];
    }
    
    // 오늘이거나 미래면 빈 상태, 과거 날짜면 기본 강아지 사진 표시
    if (isToday || isFuture) {
      return { morning: null, lunch: null, dinner: null };
    } else {
      return defaultDogImages;
    }
  };

  // 오늘이거나 미래인지 확인 (업로드 가능한 날짜)
  const canUpload = () => {
    const today = new Date();
    const selectedDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return selectedDate >= todayDate;
  };

  return (
    <div className={styles.wrap}>
      <img src="/background.png" alt="bg" className={styles.bgImage} />
      <div className={styles.bgOverlay} />
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.container}>
        <div className={styles.leftCard}>
          <Calendar 
            onSelect={(d) => {
              setSelected(d);
              fetchDateData(d);
            }} 
            selectedDate={selected}
            dailyData={dailyData}
          />
        </div>
        <div className={styles.rightCard}>
          <div className={styles.rightHeader}>
            <div className={styles.selectedDateDisplay}>
              <button className={styles.dayNav} onClick={() => goDay(-1)}>‹</button>
              <div className={styles.dateText}>{selected ? selected.toLocaleDateString() : ''}</div>
              <button className={styles.dayNav} onClick={() => goDay(1)}>›</button>
            </div>
            <div />
          </div>
          <div className={styles.timeTabsBar}>
            <button className={`${styles.timeTabBtn} ${timeTab === 'morning' ? styles.activeTab : ''}`} onClick={() => setTimeTab('morning')}>아침</button>
            <button className={`${styles.timeTabBtn} ${timeTab === 'lunch' ? styles.activeTab : ''}`} onClick={() => setTimeTab('lunch')}>점심</button>
            <button className={`${styles.timeTabBtn} ${timeTab === 'dinner' ? styles.activeTab : ''}`} onClick={() => setTimeTab('dinner')}>저녁</button>
          </div>
          <div className={styles.timeContent}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>데이터를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <p className={styles.errorMessage}>{error}</p>
                <div className={styles.errorDetails}>
                  <p>API URL: <code>{API_URL}</code></p>
                  <p>선택된 날짜: <code>{selected.toISOString().split('T')[0]}</code></p>
                  <br />
                  <p>문제 해결 방법:</p>
                  <ul>
                    <li>Spring Boot 서버가 8080 포트에서 실행 중인지 확인</li>
                    <li>서버의 `/api/v1/calendar` 엔드포인트가 구현되어 있는지 확인</li>
                    <li>CORS 설정이 올바른지 확인</li>
                    <li>네트워크 연결 상태 확인</li>
                  </ul>
                </div>
                <div className={styles.errorActions}>
                  <button 
                    className={styles.retryButton}
                    onClick={() => fetchDateData(selected)}
                  >
                    다시 시도
                  </button>
                  <button 
                    className={styles.checkServerButton}
                    onClick={async () => {
                      const isConnected = await checkServerConnection();
                      alert(isConnected ? 
                        '서버에 연결되었습니다!' : 
                        '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
                    }}
                  >
                    서버 연결 확인
                  </button>
                </div>
              </div>
            ) : (
              <DogPanel 
                selectedTime={timeTab} 
                uploadedImages={getCurrentDayImages()} 
                onImageUpload={handleImageUpload} 
                canUpload={canUpload()} 
                selectedDate={selected}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
