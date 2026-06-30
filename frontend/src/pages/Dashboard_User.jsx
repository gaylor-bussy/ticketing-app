import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
import SearchBar from "../components/Search_Bar";
import Modal_Add_Demande from "../components/Modal_Add_Demande";

export default function Dashboard_User({ user }) {
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

    fetch("http://localhost:3000/dashboard/utilisateur", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDemandes(data))
      .catch((error) => console.error(error));
  }, []);
console.log(demandes);

  const ajouterDemande = async () => {
    try {
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

      console.log("Status HTTP :", response.status);
      console.log("Réponse serveur :", data);

      if (!response.ok) {
        alert("Erreur : " + data.message);
        return;
      }

      setDescription("");
      setPriorite("2");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Erreur fetch :", error);
    }
  };

  return (
    <section className="flex w-full min-w-0 max-w-full flex-col overflow-x-hidden px-3 py-4 sm:px-6 lg:py-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-words text-white">Bonjour {user.nom}</p>
        <p className="break-words text-white">Role du compte : {user.nom_role}</p>
      </div>
      <section className="mb-4 flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchBar search={search} setSearch={setSearch} />

        <button className="btn btn-success w-full md:w-auto" onClick={() => setShowModal(true)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square-dotted" viewBox="0 0 16 16">
  <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
</svg>
          Ajouter une demande
        </button>
      </section>

      <div className="min-w-0 w-full">
        <Table_Demandes demandes={demandesFiltrees} />
      </div>

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
