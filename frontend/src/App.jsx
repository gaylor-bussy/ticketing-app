import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomePage2 from "./pages/HomePage2";
import Dashboard_User from "./pages/Dashboard_User";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Dashboard_Manageur from "./pages/Dashboard_Manageur";
import Dashboard_Formateur from "./pages/Dashboard_Formateur";
import Consulter_Demande from "./pages/Consulter_Demande";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  return (
    <section className="h-screen grid grid-rows-[230px_1fr_50px]">
      <Header user={user} setUser={setUser} token={token} setToken={setToken} />
      <main className="bg-zinc-700">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/next" element={<HomePage2 />} />
          <Route path="/dashboard/user" element={<Dashboard_User />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion user={user} setUser={setUser} token={token} setToken={setToken} />} />
          <Route path="/dashboard/manageur" element={<Dashboard_Manageur/>} />
          <Route path="/dashboard/formateur-technicien" element={<Dashboard_Formateur/>} />
          <Route path="/consulter-demande" element={<Consulter_Demande />} />
        </Routes>
      </main>
      <Footer />
    </section>
  );
}

export default App;
