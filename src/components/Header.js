import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.child} />
      <b className={styles.menu2}>캘린더</b>
      <b className={styles.menu3}>분석</b>
      <div className={styles.item} />
      <b className={styles.menu4}>식단추천</b>
      <b className={styles.menu5}>마이페이지</b>
      <div className={styles.profileCircle} />
      <img className={styles.profileIcon} alt="" />
    </div>
  );
};

export default Header;