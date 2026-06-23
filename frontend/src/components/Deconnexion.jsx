import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Deconnexion({ user, setUser, token, setToken }) {
  const navigate = useNavigate();
  function handleDeconnexion() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  }
  return (
    <div className="flex">
      <button
        className="btn btn-success m-2 text-black h-14 text-2xl "
        onClick={handleDeconnexion}
      >
        Deconnexion
      </button>
    </div>
  );
}
