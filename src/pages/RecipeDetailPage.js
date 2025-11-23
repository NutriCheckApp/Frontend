import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RecipeDetailPage.module.css';
import Header from '../components/Header';

const recipeDetails = {
  1: {
    title: '닭가슴살 쿠키',
    image: '/recipe1.jpg',
    description: '강아지가 좋아하는 건강한 닭가슴살로 만든 바삭한 쿠키입니다.',
    ingredients: [
      '닭가슴살 200g',
      '고구마 100g',
      '달걀 1개',
      '귀리가루 50g'
    ],
    instructions: [
      '닭가슴살을 삶아서 잘게 찢어주세요.',
      '고구마를 삶아서 으깨주세요.',
      '모든 재료를 섞어 반죽을 만듭니다.',
      '작은 크기로 모양을 만들어 오븐에 굽습니다.',
      '180도에서 15-20분간 구워주세요.'
    ]
  },
  2: {
    title: '고구마 간식',
    image: '/food2.png',
    description: '달콤하고 부드러운 고구마로 만든 영양만점 간식입니다.',
    ingredients: [
      '고구마 300g',
      '현미가루 30g',
      '올리브오일 1큰술'
    ],
    instructions: [
      '고구마를 찌거나 삶아서 으깨주세요.',
      '현미가루와 올리브오일을 넣고 섞습니다.',
      '동그랗게 모양을 만듭니다.',
      '170도 오븐에서 12-15분간 구워주세요.'
    ]
  },
  3: {
    title: '연어 트릿',
    image: '/food1.png',
    description: '오메가3가 풍부한 연어로 만든 건강한 간식입니다.',
    ingredients: [
      '연어 150g',
      '쌀가루 40g',
      '달걀 흰자 1개'
    ],
    instructions: [
      '연어를 익혀서 뼈를 제거하고 으깨주세요.',
      '쌀가루와 달걀 흰자를 넣고 반죽합니다.',
      '작은 크기로 성형합니다.',
      '160도에서 20분간 구워주세요.'
    ]
  },
  4: {
    title: '당근 케이크',
    image: '/food2.png',
    description: '비타민이 풍부한 당근으로 만든 부드러운 케이크입니다.',
    ingredients: [
      '당근 200g',
      '바나나 1개',
      '귀리가루 60g',
      '요거트 2큰술'
    ],
    instructions: [
      '당근을 강판에 갈아주세요.',
      '바나나를 으깨서 당근과 섞습니다.',
      '귀리가루와 요거트를 넣고 반죽합니다.',
      '틀에 넣고 180도에서 25분간 구워주세요.'
    ]
  },
  5: {
    title: '바나나 쿠키',
    image: '/food1.png',
    description: '달콤한 바나나 향이 나는 부드러운 쿠키입니다.',
    ingredients: [
      '바나나 2개',
      '귀리 100g',
      '아몬드가루 30g'
    ],
    instructions: [
      '바나나를 으깨주세요.',
      '귀리와 아몬드가루를 넣고 섞습니다.',
      '쿠키 모양으로 만듭니다.',
      '170도에서 15분간 구워주세요.'
    ]
  },
  6: {
    title: '치킨 저키',
    image: '/food2.png',
    description: '쫄깃하고 맛있는 닭고기 저키입니다.',
    ingredients: [
      '닭가슴살 300g',
      '소금 조금'
    ],
    instructions: [
      '닭가슴살을 얇게 슬라이스합니다.',
      '소금을 아주 조금 뿌려주세요.',
      '오븐이나 식품건조기에서 건조시킵니다.',
      '완전히 마를 때까지 4-6시간 건조합니다.'
    ]
  }
};

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipeDetails[id];

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
            <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
            <div className={styles.recipeInfo}>
              <h1 className={styles.recipeTitle}>{recipe.title}</h1>
              <p className={styles.recipeDescription}>{recipe.description}</p>
            </div>
          </div>

          <div className={styles.recipeContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>재료</h3>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>만드는 법</h3>
              <ol className={styles.instructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className={styles.instruction}>{instruction}</li>
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