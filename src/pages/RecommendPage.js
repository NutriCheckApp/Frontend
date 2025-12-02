import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendPage.module.css';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const RecommendPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt && { 'Authorization': `Bearer ${jwt}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        // 레시피 이름에 따른 이미지 매칭
        const imageMap = {
          '안티에이징스무디': '/antiaging.png',
          '사라다': '/saladbun.png',
          '치즈핫도그': '/cheesehotdog.png',
          '부침개': '/buchimgae.png',
          '배잡채': '/pearjapche.png',
          '참치 볶음밥': '/tunarice.png',
          '참치 샐러드': '/tunasalad.png',
          '햄버그스테이크': '/hambak.png',
          '마가레뜨': '/magarette.png',
          '당근케이크': '/carrotcake.png',
          '쿠키': '/cookie.png',
          '단호박빵': '/danhobak.png',
        };
        const recipesWithLocalImages = data.map(recipe => ({
          ...recipe,
          imageUrl: imageMap[recipe.recipe_name] || '/recipe1.jpg'
        }));
        setRecipes(recipesWithLocalImages);
      }
    } catch (err) {
      console.error('레시피 목록 로딩 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.content}>
        <div className={styles.top}>
          <h2 className={styles.title}>강아지 간식 레시피 추천</h2>
          <p className={styles.subtitle}>우리 강아지를 위한 건강한 수제 간식을 만들어보세요</p>
        </div>

        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : (
          <div className={styles.recipeGrid}>
            {recipes.map((recipe) => (
              <div 
                className={styles.recipeCard} 
                key={recipe.recipe_id}
                onClick={() => handleRecipeClick(recipe.recipe_id)}
              >
                <img src={recipe.imageUrl} alt={recipe.recipe_name} className={styles.recipeImage} />
                <h3 className={styles.recipeTitle}>{recipe.recipe_name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendPage;
