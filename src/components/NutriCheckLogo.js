import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/nutricheck-logo.png";

const NutriCheckLogo = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer"
      }}
      aria-label="메인으로 이동"
    >
      <img src={logoImg} alt="NutriCheck Logo" style={{ width: 100, height: 'auto', display: 'block' }} />
    </button>
  );
};

export default NutriCheckLogo;
