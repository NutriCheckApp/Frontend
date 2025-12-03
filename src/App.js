import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import RegisterPage from './pages/RegisterPage';
import RecommendPage from './pages/RecommendPage';
import CalendarPage from './pages/CalendarPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/analysis" element={<RecommendPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;