import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RecipeDetailPage.module.css';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipeDetail();
  }, [id]);

  const fetchRecipeDetail = async () => {
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await fetch(`${API_BASE_URL}/recipes/detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt && { 'Authorization': `Bearer ${jwt}` })
        },
        body: JSON.stringify({ recipe_id: parseInt(id) })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.image_name) {
          data.imageUrl = `${IMAGE_BASE_URL}/${data.image_name}`;
          console.log('Generated Image URL:', data.imageUrl);
        } else {
          console.warn('Recipe data is missing image_name.');
          data.imageUrl = ''; 
        }
        
        setRecipe(data);
      }
    } catch (err) {
      console.error('레시피 상세 정보 로딩 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.content}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.content}>
          <div className={styles.notFound}>
            <h2>레시피를 찾을 수 없습니다</h2>
            <button onClick={() => navigate('/analysis')} className={styles.backButton}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <button onClick={() => navigate('/analysis')} className={styles.backButton}>
          ← 목록으로 돌아가기
        </button>
        
        <div className={styles.recipeContainer}>
          <div className={styles.recipeHeader}>
            <img 
              src={recipe.imageUrl} 
              alt={recipe.recipe_name} 
              className={styles.recipeImage} 
              onError={(e) => {
                  console.error('Image failed to load for recipe:', recipe.recipe_name);
                  console.error('Attempted URL:', recipe.imageUrl);
                  e.target.style.display = 'none'; 
              }}
            />
            <div className={styles.recipeInfo}>
              <h1 className={styles.recipeTitle}>{recipe.recipe_name}</h1>
              <p className={styles.recipeDescription}>{recipe.description}</p>
              <div className={styles.nutritionInfo}>
                <h3>영양 정보</h3>
                <p>총 칼로리: {recipe.calories} kcal</p>
                <p>조단백질: {recipe.CrudeProtein}g</p>
                <p>조지방: {recipe.CrudeFat}g</p>
                <p>칼슘: {recipe.calcium}g</p>
              </div>
            </div>
          </div>

          <div className={styles.recipeContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>재료</h3>
              <ul className={styles.ingredientsList}>
                {recipe.recipe_ingredients?.sort((a, b) => a.displayOrder - b.displayOrder).map((ingredient) => (
                  <li key={ingredient.ingredientId} className={styles.ingredient}>
                    {ingredient.ingredientName} {ingredient.amount}{ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>만드는 법</h3>
              <ol className={styles.instructionsList}>
                {recipe.recipe_steps?.sort((a, b) => a.step_number - b.step_number).map((step) => (
                  <li key={step.stepId} className={styles.instruction}>{step.instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;