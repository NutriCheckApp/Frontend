import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import NutriCheckLogo from './NutriCheckLogo';

const Header = ({ onProfileClick }) => {
  const menu2Ref = useRef(null);
  const menu3Ref = useRef(null);
  const menu4Ref = useRef(null);
  const menu5Ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [hideHeader, setHideHeader] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const lastScrollY = useRef(0);
  const profileMenuRef = useRef(null);

  const handleProfileClick = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      onProfileClick && onProfileClick();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleMyPageClick = () => {
    setShowProfileMenu(false);
    navigate('/mypage');
  };

  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 스크롤 시 헤더 숨김 처리
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // 초기 로드 시 기록(menu2) 중앙으로 설정
  useEffect(() => {
    if (menu2Ref.current) {
      const menuRect = menu2Ref.current.getBoundingClientRect();
      const headerRect = menu2Ref.current.parentElement.getBoundingClientRect();
      const menuCenter = menuRect.left - headerRect.left + menuRect.width / 2;
      const newLeft = menuCenter - 78; // 156 / 2 = 78
      setIndicatorLeft(newLeft);
    }
  }, []);
  
  // 위치(페이지 경로) 또는 hover로 indicator 위치 업데이트
  useEffect(() => {
    // choose active ref based on current pathname
    let activeRef = menu4Ref; // default: 식단추천
    try {
      const path = location && location.pathname ? location.pathname : '';
      if (path.startsWith('/calendar')) activeRef = menu2Ref;
      else if (path.startsWith('/analysis')) activeRef = menu3Ref;
      else if (path.startsWith('/mypage')) activeRef = menu5Ref;
      else activeRef = menu4Ref;
    } catch (e) {
      activeRef = menu4Ref;
    }

    if (activeRef && activeRef.current) {
      const menuRect = activeRef.current.getBoundingClientRect();
      const headerRect = activeRef.current.parentElement.getBoundingClientRect();
      const menuCenter = menuRect.left - headerRect.left + menuRect.width / 2;
      const newLeft = menuCenter - 78; // 156 / 2 = 78
      setIndicatorLeft(newLeft);
    }
  }, [location]);

  const handleMouseEnter = (ref) => {
    if (ref.current) {
      const menuRect = ref.current.getBoundingClientRect();
      const headerRect = ref.current.parentElement.getBoundingClientRect();
      const menuCenter = menuRect.left - headerRect.left + menuRect.width / 2;
      const newLeft = menuCenter - 78;
      setIndicatorLeft(newLeft);
    }
  };

  const setIndicatorFromRef = (ref) => {
    if (ref && ref.current) {
      const menuRect = ref.current.getBoundingClientRect();
      const headerRect = ref.current.parentElement.getBoundingClientRect();
      const menuCenter = menuRect.left - headerRect.left + menuRect.width / 2;
      const newLeft = menuCenter - 78;
      setIndicatorLeft(newLeft);
    }
  };

  const getActiveRefFromPath = () => {
    try {
      const path = location && location.pathname ? location.pathname : '';
      if (path.startsWith('/calendar')) return menu2Ref;
      if (path.startsWith('/analysis')) return menu3Ref;
      if (path.startsWith('/mypage')) return menu5Ref;
    } catch (e) {
      // fall through
    }
    return menu4Ref; // default
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed', 
          top: 10, 
          left: 180, 
          zIndex: 1200,
          transform: hideHeader ? 'translateY(-100px)' : 'translateY(0)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <NutriCheckLogo type="compact" />
      </div>
      <div
        className={styles.header}
        style={{
          transform: hideHeader ? 'translate(-50%, -100px)' : 'translateX(-50%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseLeave={() => setIndicatorFromRef(getActiveRefFromPath())}
      >
        <div className={styles.child} />
      
        <b
          ref={menu2Ref}
          className={styles.menu2}
          onMouseEnter={() => handleMouseEnter(menu2Ref)}
          onClick={() => navigate('/calendar')}
          style={{ cursor: 'pointer' }}
        >
          기록
        </b>
        <b
          ref={menu3Ref}
          className={styles.menu3}
          onMouseEnter={() => handleMouseEnter(menu3Ref)}
          onClick={() => navigate('/analysis')}
          style={{ cursor: 'pointer' }}
        >
          추천
        </b>

        <b
          ref={menu5Ref}
          className={styles.menu5}
          onMouseEnter={() => handleMouseEnter(menu5Ref)}
          onClick={() => navigate('/mypage')}
          style={{ cursor: 'pointer' }}
        >
          마이페이지
        </b>

        <div
          className={styles.item}
          style={{ left: `${indicatorLeft}px` }}
        />

        <div ref={profileMenuRef} className={styles.profileContainer}>
          <div
            className={styles.profileCircle}
            onClick={handleProfileClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleProfileClick(); }}
          >
            <div
              className={styles.profileIcon}
              onClick={handleProfileClick}
              style={{ cursor: 'pointer' }}
            >
              <FaUser size={30} color="#222" />
            </div>
          </div>

          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <button className={styles.menuItem} onClick={handleMyPageClick}>
                마이페이지
              </button>
              <button className={styles.menuItem} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;