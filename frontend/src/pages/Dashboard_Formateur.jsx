import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
import Search_Bar from "../components/Search_Bar";
import Modal_Add_Demande from "../components/Modal_Add_Demande";
import Modal_Messagerie from "../components/Modal_Messagerie";

export default function Dashboard_Formateur({ userr }) {
    const [demandes, setDemandes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [priorite, setPriorite] = useState("2");
    const [showPrioriteModal, setShowPrioriteModal] = useState(false);
    const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
    const [nouvellePriorite, setNouvellePriorite] = useState("2");
    const [showMessagerie, setShowMessagerie] = useState(false);
    const [demandeMessagerie, setDemandeMessagerie] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const ouvrirMessagerie = (demande) => {
        setDemandeMessagerie(demande);
        setShowMessagerie(true);
    };

    const demandesFiltrees = demandes.filter((demande) => {
        const recherche = search.toLowerCase();

        return (
            demande.id_demande.toString().includes(recherche) ||
            demande.Description?.toLowerCase().includes(recherche)
        );
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:3000/dashboard/formateur_technicien", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Demandes formateur :", data);

                if (Array.isArray(data)) {
                    setDemandes(data);
                } else {
                    setDemandes([]);
                }
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
            }
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
            }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setDemandes((prevDemandes) =>
                prevDemandes.map((demande) =>
                    demande.id_demande === id_demande
                        ? {
                            ...demande,
                            id_positionneur: user?.id_user,
                            Nom_positionneur: user?.nom,
                            Prenom_positionneur: user?.prenom,
                        }
                        : demande
                )
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
            }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setDemandes((prev) =>
                prev.map((demande) =>
                    demande.id_demande === demandeSelectionnee.id_demande
                        ? { ...demande, id_status: Number(nouvellePriorite) }
                        : demande
                )
            );

            setShowPrioriteModal(false);
            setDemandeSelectionnee(null);
        }
    };

    return (
        <section className="flex flex-col p-6">
            <div className="flex justify-between">
                <p className="text-white mb-6">Bonjour {userr?.nom || user?.nom}</p>
                <p className="text-white">
                    Role du compte : {userr?.nom_role || user?.nom_role}
                </p>
            </div>

            <section className="flex justify-between items-center mb-4">
                <Search_Bar search={search} setSearch={setSearch} />

                <button className="btn btn-success" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-dotted" viewBox="0 0 16 16">
                        <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                    </svg>
                    Ajouter une demande
                </button>
            </section>

            <Table_Demandes
                demandes={demandesFiltrees}
                isFormateur={user?.id_role === 2}
                isTechnicien={user?.id_role === 3}
                positionnerDemande={positionnerDemande}
                ouvrirModalPriorite={ouvrirModalPriorite}
                ouvrirMessagerie={ouvrirMessagerie}
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
            <Modal_Messagerie
                open={showMessagerie}
                setOpen={setShowMessagerie}
                demande={demandeMessagerie}
            />
        </section>
    );
}