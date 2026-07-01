import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard_User from "./pages/Dashboard_User";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Dashboard_Manageur from "./pages/Dashboard_Manageur";
import Dashboard_Formateur from "./pages/Dashboard_Formateur";
import Consulter_Demande from "./pages/Consulter_Demande";
import Result_Demand from "./pages/Result_Demand";
import ShowDemandinvite from "./pages/ShowDemandInvite";
import ShowDemandinvite2 from "./pages/ShowDemandInvite2";
import GestionUtilisateur from "./components/Gestion_utilisateur";
import Graphique from "./components/Graphique";
import GraphiqueAnnee from "./components/GraphiqueAnnee";

function App() {
  const [idDemandeInvitee, setIdDemandeInvitee] = useState("");
  const [nextPage, setNextPage] = useState(false);
  const [numDemande,setNumDemande] = useState("");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  return (
    <section className="grid min-h-screen w-full max-w-full grid-rows-[auto_1fr_auto] overflow-x-hidden">
      <Header user={user} setUser={setUser} token={token} setToken={setToken} setNextPage={setNextPage}/>
      <main className="min-h-0 w-full max-w-full overflow-x-hidden bg-zinc-700">
        <Routes>
          <Route path="/" element={<HomePage setIdDemandeInvitee={setIdDemandeInvitee} setNextPage={setNextPage} nextPage={nextPage}/>} />
          <Route path="/dashboard/user" element={<Dashboard_User user={user}/>} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion user={user} setUser={setUser} token={token} setToken={setToken} />} />
          <Route path="/dashboard/manageur" element={<Dashboard_Manageur userr={user}/>} />
          <Route path="/dashboard/formateur-technicien" element={<Dashboard_Formateur userr={user}/>} />
          <Route path="/consulter-demande" element={<Consulter_Demande setNumDemande={setNumDemande}/>} />
          <Route path="/resultat-demande" element={<Result_Demand idDemandeInvitee={idDemandeInvitee} />} />
          <Route path="/demand-invit-show" element={<ShowDemandinvite idDemandeInvitee={idDemandeInvitee} numDemande={numDemande}/>} />
          <Route path="/demand-invite-show2" element={<ShowDemandinvite2 />} />
          <Route path="/dashboard/manageur/graphique" element={<Graphique userr={user}/>} />
          <Route path="/dashboard/manageur/graphique/annee" element={<GraphiqueAnnee userr={user}/>} />
          <Route path="/dashboard/manageur/gestion_utilisateur" element={<GestionUtilisateur userr={user} />} />
        </Routes>
      </main>
      <Footer user={user}/>
    </section>
  );
}

export default App;
