import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
import Search_Bar from "../components/Search_Bar";
import Modal_Add_Demande from "../components/Modal_Add_Demande";

export default function Dashboard_Manager() {
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
                console.log("Demandes formateur :", data);
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

    const positionnerDemande = async (id_demande) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/uptade/posionnement/${id_demande}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setDemandes((prevDemandes) =>
                prevDemandes.map((demande) =>
                    demande.id_demande === id_demande
                        ? {
                            ...demande,
                            id_positionneur: user.id_user,
                            Nom_positionneur: user.Nom,
                            Prenom_positionneur: user.Prenom,
                        }
                        : demande,
                ),
            );
        }
    };

    const ouvrirModalPriorite = (demande) => {
        setDemandeSelectionnee(demande);
        setNouvellePriorite(String(demande.id_status));
        setShowPrioriteModal(true);
    };

    const validerChangementPriorite = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/update/${demandeSelectionnee.id_demande}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_status: nouvellePriorite,
                }),
            },
        );

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

    const approuverPositionnement = async (id_demande) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/uptade/validation/${id_demande}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setDemandes((prev) =>
                prev.map((demande) =>
                    demande.id_demande === id_demande
                        ? { ...demande, id_technicien: demande.id_positionneur }
                        : demande
                )
            );
        }
    };

    const refuserPositionnement = async (id_demande) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:3000/dashboard/complet/uptade/validation/${id_demande}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/uptade/refus/${id_demande}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setDemandes((prev) =>
                prev.map((demande) =>
                    demande.id_demande === id_demande
                        ? { ...demande, id_positionneur: null }
                        : demande
                )
            );
        }
    };

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
