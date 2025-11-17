import React from 'react';
import styles from './AnalysisPage.module.css';
import Header from '../components/Header';

const nutrients = [
  { key: 'carb', name: '탄수화물', status: '적정', statusClass: 'ok', current: 280, target: 324, unit: 'g', color: '#2db84c' },
  { key: 'protein', name: '단백질', status: '적정', statusClass: 'ok', current: 95, target: 81, unit: 'g', color: '#2db84c' },
  { key: 'fat', name: '지방', status: '적정', statusClass: 'ok', current: 45, target: 54, unit: 'g', color: '#2db84c' },
  { key: 'fiber', name: '식이섬유', status: '부족', statusClass: 'low', current: 18, target: 25, unit: 'g', color: '#ff4d4f' },
  { key: 'sodium', name: '나트륨', status: '초과', statusClass: 'over', current: 2800, target: 2000, unit: 'mg', color: '#ff9f1a' },
  { key: 'vitc', name: '비타민C', status: '적정', statusClass: 'ok', current: 85, target: 100, unit: 'mg', color: '#2db84c' },
  { key: 'calcium', name: '칼슘', status: '적정', statusClass: 'ok', current: 620, target: 700, unit: 'mg', color: '#2db84c' },
  { key: 'iron', name: '철분', status: '적정', statusClass: 'ok', current: 14, target: 14, unit: 'mg', color: '#2db84c' },
];

const AnalysisPage = () => {
  return (
    <div className={styles.page}>
      <Header />

      {/* 콘텐츠가 헤더와 겹치지 않도록 여유 공간을 준 래퍼 */}
      <div className={styles.content}>
        <div className={styles.top}>
          <h2 className={styles.title}>오늘의 영양 분석</h2>
          <p className={styles.subtitle}>권장 섭취량 대비 현재 섭취 상태를 확인하세요</p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>영양성분 분석</h3>

          <div className={styles.list}>
            {nutrients.map((n) => {
              const percent = Math.min(100, Math.round((n.current / n.target) * 100));
              return (
                <div className={styles.row} key={n.key}>
                  <div className={styles.rowLeft}>
                    <div className={styles.label}>{n.name}</div>
                    <div className={`${styles.pill} ${styles[n.statusClass]}`}>{n.status}</div>
                  </div>

                  <div className={styles.rowCenter}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${percent}%`, backgroundColor: n.color }}
                      />
                    </div>
                  </div>

                  <div className={styles.rowRight}>
                    <div className={styles.value}>{n.current} / {n.target} {n.unit}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
