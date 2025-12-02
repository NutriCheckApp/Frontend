import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendPage.module.css';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const IMAGE_BASE_URL = `${API_BASE_URL}/recipes/image`;

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
        const recipesWithImageUrls = data.map(recipe => ({
          ...recipe,
          imageUrl: `${IMAGE_BASE_URL}/${recipe.image_name}`
        }));
        setRecipes(recipesWithImageUrls);
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
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.recipe_name} 
                  className={styles.recipeImage} 
                />
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