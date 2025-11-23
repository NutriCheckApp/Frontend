import React, { useState } from 'react';
import { motion } from "framer-motion";
import Header from '../components/Header';
import styles from './Main.module.css';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  
  return (
    <>
      {/* 배경을 최상위로 이동 */}
      <div className={styles.globalBackground} />
      
      <div className={styles.scrollContainer}>
        {/* === 첫 번째 섹션: 기존 화면 유지 === */}
        <section className={styles.section}>
          <div className={styles.container}>
            <img className={styles.backgroundIcon} src="/background.png" alt="배경" />
            <div className={styles.contentWrapper}>
              <Header onProfileClick={() => setShowLogin(true)} />
              <div className={styles.imageContainer}>
                <img className={styles.image1} src="/food1.png" alt="" />
                <img className={styles.image2} src="/food2.png" alt="" />
                <img className={styles.image3} src="/food1.png" alt="" />
                <img className={styles.image4} src="/food2.png" alt="" />
              </div>
              <div className={styles.mainText}>
                오직 당신의 반려견을 위한, <br />
                스마트한 식단 솔루션
              </div>
            </div>
          </div>
        </section>

        {/* === 두 번째 섹션: 프레이머 모션 적용 === */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.nextContent}>
            <h2>맞춤 간식 레시피</h2>
            <p>강아지의 건강 상태와 기호에 맞춘 수제 간식 레시피를 추천해드려요.</p>
          </div>
        </motion.section>

        {/* === 세 번째 섹션도 동일하게 적용 가능 === */}
        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className={styles.nextContent}>
            <h2>사진 일기</h2>
            <p>우리 강아지의 특별한 순간을 사진으로 간단하게 기록해보세요.</p>
          </div>
        </motion.section>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onOpenRegister={() => { setShowLogin(false); navigate('/register'); }}
        />
      )}
    </>
  );
};

export default Main;