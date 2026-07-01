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
    <div className="flex w-full sm:w-auto">
      <button
        className="btn btn-success h-12 w-full text-base text-black sm:w-auto lg:text-lg"
        onClick={handleDeconnexion}
      >
        Deconnexion
      </button>
    </div>
  );
}
