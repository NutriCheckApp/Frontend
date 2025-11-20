import React, { useState } from 'react';
import styles from './CalendarPage.module.css';
import Header from '../components/Header';

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

const sampleMeals = {
  morning: [
    { name: '햄치즈 샌드위치', kcal: 90, img: '/food1.png' },
  ],
  lunch: [
    { name: '된장찌개', kcal: 170, img: '/food2.png' },
    { name: '공기밥', kcal: 300, img: '/food1.png' },
    { name: '김치', kcal: 30, img: '/food2.png' },
  ],
  dinner: [],
};

const MealPanel = ({ selectedMeal, isFuture }) => {
  if (isFuture) {
    return (
      <div className={styles.mealCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
        <div className={styles.recommendText}>식단을 추천받을 수 있습니다.</div>
        <button className={styles.recommendBtn}>식단 추천받기</button>
      </div>
    );
  }
  const list = selectedMeal === 'morning' ? sampleMeals.morning : selectedMeal === 'lunch' ? sampleMeals.lunch : sampleMeals.dinner;
  return (
    <div className={styles.mealCard}>
      <div className={styles.mealList}>
        {list.length === 0 ? (
          <div className={styles.empty}>작성하기</div>
        ) : (
          list.map((it, i) => (
            <div key={i} className={styles.mealItem}>
              <img src={it.img} alt="" className={styles.thumb} />
              <div className={styles.mealInfo}>
                <div className={styles.mealName}>{it.name}</div>
                <div className={styles.mealKcal}>{it.kcal}kcal</div>
              </div>
              <button className={styles.writeBtn}>작성하기</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [selected, setSelected] = useState(new Date());
  const [mealTab, setMealTab] = useState('lunch');

  const goDay = (dir) => {
    setSelected((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir);
      return d;
    });
  };

  const today = new Date();
  const isFuture = selected > today.setHours(0,0,0,0);

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
          <div className={styles.mealTabsBar}>
            <button className={`${styles.mealTabBtn} ${mealTab === 'morning' ? styles.activeTab : ''}`} onClick={() => setMealTab('morning')}>아침</button>
            <button className={`${styles.mealTabBtn} ${mealTab === 'lunch' ? styles.activeTab : ''}`} onClick={() => setMealTab('lunch')}>점심</button>
            <button className={`${styles.mealTabBtn} ${mealTab === 'dinner' ? styles.activeTab : ''}`} onClick={() => setMealTab('dinner')}>저녁</button>
          </div>
          <div className={styles.mealContent}>
            <MealPanel selectedMeal={mealTab} isFuture={isFuture} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
