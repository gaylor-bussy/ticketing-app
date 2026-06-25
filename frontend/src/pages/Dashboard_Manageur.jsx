import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
import Search_Bar from "../components/Search_Bar";
import Modal_Add_Demande from "../components/Modal_Add_Demande";

export default function Dashboard_Manageur({user}) {
  const [demandes, setDemandes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [priorite, setPriorite] = useState("2");

  const demandesFiltrees = demandes.filter((demande) => {
    const recherche = search.toLowerCase();

    return (
      demande.id_demande.toString().includes(recherche) ||
      demande.Description?.toLowerCase().includes(recherche)
    );
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/dashboard/complet", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Demandes manageur :", data);
        setDemandes(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const ajouterDemande = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/dashboard/utilisateur/request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Description: description,
          id_status: priorite,
        }),
      },
    );

    const data = await response.json();
    console.log(data);

    setDescription("");
    setPriorite("2");
    setShowModal(false);
    window.location.reload();
  };

  return (
    <section className="flex flex-col p-6">
      <div className="flex justify-between">
        <p className="text-white mb-6">Bonjour {user.nom}</p>
        <p className="text-white">Role du compte : {user.nom_role}</p>
      </div>
      <section className="flex justify-between items-center mb-4">
        <Search_Bar search={search} setSearch={setSearch} />

        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          Ajouter une demande
        </button>
      </section>

      <Table_Demandes demandes={demandesFiltrees} />

      <Modal_Add_Demande
        showModal={showModal}
        setShowModal={setShowModal}
        description={description}
        setDescription={setDescription}
        priorite={priorite}
        setPriorite={setPriorite}
        ajouterDemande={ajouterDemande}
      />
    </section>
  );
}
