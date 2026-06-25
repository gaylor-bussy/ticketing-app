import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
import Search_Bar from "../components/Search_Bar";
import Modal_Add_Demande from "../components/Modal_Add_Demande";

export default function Dashboard_Manager({userr}) {
  const [demandes, setDemandes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [priorite, setPriorite] = useState("2");
  const user = JSON.parse(localStorage.getItem("user"));
  const [showPrioriteModal, setShowPrioriteModal] = useState(false);
  const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
  const [nouvellePriorite, setNouvellePriorite] = useState("2");

  const demandesFiltrees = demandes.filter((demande) => {
    const recherche = search.toLowerCase();

    return (
        <section className="flex flex-col p-6">
            <section className="flex justify-between items-center mb-4">
                <Search_Bar search={search} setSearch={setSearch} />

                <button className="btn btn-success" onClick={() => setShowModal(true)}>
                    Ajouter une demande
                </button>
            </section>

            <Table_Demandes
                demandes={demandesFiltrees}
                isManageur={true}
                ouvrirModalPriorite={ouvrirModalPriorite}
                approuverPositionnement={approuverPositionnement}
                refuserPositionnement={refuserPositionnement}
                idUser={user?.id_user}
            />

            <Modal_Add_Demande
                showModal={showModal}
                setShowModal={setShowModal}
                description={description}
                setDescription={setDescription}
                priorite={priorite}
                setPriorite={setPriorite}
                ajouterDemande={ajouterDemande}
            />

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setDemandes((prev) =>
        prev.map((demande) =>
          demande.id_demande === demandeSelectionnee.id_demande
            ? { ...demande, id_status: Number(nouvellePriorite) }
            : demande,
        ),
      );

      setShowPrioriteModal(false);
      setDemandeSelectionnee(null);
    }
  };

  return (
    <section className="flex flex-col p-6">
      <div className="flex justify-between">
        <p className="text-white mb-6">Bonjour {userr.nom}</p>
        <p className="text-white">Role du compte : {userr.nom_role}</p>
      </div>
      <section className="flex justify-between items-center mb-4">
        <Search_Bar search={search} setSearch={setSearch} />

        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          Ajouter une demande
        </button>
      </section>

      <Table_Demandes
        demandes={demandesFiltrees}
        isManageur={true}
        ouvrirModalPriorite={ouvrirModalPriorite}
        idUser={user?.id_user}
      />

      <Modal_Add_Demande
        showModal={showModal}
        setShowModal={setShowModal}
        description={description}
        setDescription={setDescription}
        priorite={priorite}
        setPriorite={setPriorite}
        ajouterDemande={ajouterDemande}
      />

      {showPrioriteModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Modifier la priorité</h3>

            <select
              className="select select-bordered w-full mb-4"
              value={nouvellePriorite}
              onChange={(e) => setNouvellePriorite(e.target.value)}
            >
              <option value="1">Urgent</option>
              <option value="2">Peut attendre</option>
              <option value="3">Pressant</option>
            </select>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => setShowPrioriteModal(false)}
              >
                Annuler
              </button>

              <button
                className="btn btn-success"
                onClick={validerChangementPriorite}
              >
                Valider
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
