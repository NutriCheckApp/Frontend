import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendPage.module.css';
import Header from '../components/Header';

const dogRecipes = [
  { id: 1, title: '닭가슴살 쿠키', image: '/recipe1.jpg' },
  { id: 2, title: '고구마 간식', image: '/food2.png' },
  { id: 3, title: '연어 트릿', image: '/food1.png' },
  { id: 4, title: '당근 케이크', image: '/food2.png' },
  { id: 5, title: '바나나 쿠키', image: '/food1.png' },
  { id: 6, title: '치킨 저키', image: '/food2.png' },
];

const RecommendPage = () => {
  const navigate = useNavigate();

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

        <div className={styles.recipeGrid}>
          {dogRecipes.map((recipe) => (
            <div 
              className={styles.recipeCard} 
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
              <h3 className={styles.recipeTitle}>{recipe.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendPage;
