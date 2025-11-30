import React, { useState, useEffect } from 'react';
import styles from './CalendarPage.module.css';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/v1/calendar';

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const matrix = [];
  let week = new Array(7).fill(null);
  let day = 1;
  const startIndex = (first.getDay() + 6) % 7;
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

const Calendar = ({ onSelect, selectedDate }) => {
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
              return (
                <div
                  key={di}
                  className={`${styles.dayCell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => dt && onSelect && onSelect(dt)}
                >
                  <div className={styles.dayNumber}>{dt ? dt.getDate() : ''}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const DogPanel = ({ selectedDate, calendarData, onSave, canUpload, isLoading }) => {
  const [memo, setMemo] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (calendarData) {
      setMemo(calendarData.memo || '');
      setImageFile(null);
      setIsEditing(false);
    } else {
      setMemo('');
      setImageFile(null);
      setIsEditing(false);
    }
  }, [calendarData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (!memo && !imageFile && !calendarData?.imageUrl) {
      alert('메모 또는 이미지를 입력해주세요.');
      return;
    }

    await onSave(selectedDate, memo, imageFile);
    setImageFile(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setMemo(calendarData?.memo || '');
    setImageFile(null);
    setIsEditing(false);
  };

  const currentImage = calendarData?.imageUrl;
  const hasData = calendarData?.imageUrl || calendarData?.memo;

  if (isLoading) {
    return (
      <div className={styles.dogCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.dogCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px' }}>
      {currentImage ? (
        <img src={currentImage} alt="uploaded" className={styles.dogPhoto} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
      ) : (
        <div className={styles.placeholderImage}>
          <span>{canUpload ? '이미지와 메모를 작성해주세요' : '저장된 데이터가 없습니다'}</span>
        </div>
      )}

      {canUpload && (hasData ? isEditing : true) && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className={styles.uploadButton} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#ff6b6b', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            {imageFile ? imageFile.name : '사진 선택'}
          </label>
        </>
      )}

      <textarea
        className={styles.memoInput}
        placeholder={canUpload ? "메모를 입력하세요..." : ""}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        readOnly={!canUpload || (hasData && !isEditing)}
        rows={4}
        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none', backgroundColor: (!canUpload || (hasData && !isEditing)) ? '#f5f5f5' : '#fff' }}
      />

      {canUpload && (
        <div style={{ display: 'flex', gap: '10px' }}>
          {hasData && !isEditing ? (
            <button onClick={handleEdit} className={styles.saveButton} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
              수정하기
            </button>
          ) : (
            <>
              <button onClick={handleSave} className={styles.saveButton} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                저장
              </button>
              {hasData && isEditing && (
                <button onClick={handleCancel} className={styles.saveButton} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#999', color: 'white', border: 'none', cursor: 'pointer' }}>
                  취소
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const CalendarPage = () => {
  const [selected, setSelected] = useState(new Date());
  const [calendarData, setCalendarData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCalendarData(selected);
  }, [selected]);

  const fetchCalendarData = async (date) => {
    setIsLoading(true);
    const formattedDate = formatDate(date);
    
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt && { 'Authorization': `Bearer ${jwt}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCalendarData(data);
      } else if (response.status === 404) {
        setCalendarData(null);
      }
    } catch (err) {
      console.error('캘린더 데이터 로딩 실패:', err);
      setCalendarData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCalendarData = async (date, memo, imageFile) => {
    setIsLoading(true);
    const formattedDate = formatDate(date);

    try {
      const jwt = localStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('date', formattedDate);
      formData.append('memo', memo);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...(jwt && { 'Authorization': `Bearer ${jwt}` })
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setCalendarData(data);
        alert('저장되었습니다!');
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('캘린더 데이터 저장 실패:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const goDay = (dir) => {
    setSelected((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir);
      return d;
    });
  };

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
          <Calendar onSelect={(d) => setSelected(d)} selectedDate={selected} />
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
          <div className={styles.timeContent}>
            <DogPanel 
              selectedDate={selected}
              calendarData={calendarData}
              onSave={handleSaveCalendarData}
              canUpload={canUpload()}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
