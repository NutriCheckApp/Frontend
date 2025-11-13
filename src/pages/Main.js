import React from 'react';
import Header from '../components/Header';
import styles from './Main.module.css';

const Main = () => {
  return (
    <div className={styles.container}>
      <img 
        className={styles.backgroundIcon} 
        src="/background.png" 
        alt="배경"
      />
      <div className={styles.contentWrapper}>
        <Header />
        <div className={styles.imageContainer}>
          <img className={styles.image1} src="/food1.png" alt="" />
          <img className={styles.image2} src="/food2.png" alt="/food2.png" />
          <img className={styles.image3} src="/food1.png" alt="" />
          <img className={styles.image4} src="/food2.png" alt="" />
        </div>
        <div className={styles.mainText}>
          건강 목표를 향한, <br />
          스마트한 식단 솔루션
        </div>
      </div>
    </div>
  );
};

export default Main;