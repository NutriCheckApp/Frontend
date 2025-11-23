import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import RegisterPage from './pages/RegisterPage';
import RecommendPage from './pages/RecommendPage';
import CalendarPage from './pages/CalendarPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/analysis" element={<RecommendPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;