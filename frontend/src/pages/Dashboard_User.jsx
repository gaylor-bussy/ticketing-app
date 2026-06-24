import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";

export default function Dashboard_User() {
    const [demandes, setDemandes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [priorite, setPriorite] = useState("2");

    function DescriptionCell({ description = "" }) {
        const [open, setOpen] = useState(false);

        const words = description.split(" ");
        const shortText = words.slice(0, 5).join(" ");

        const formattedDescription = words.reduce((acc, word, index) => {
            return acc + word + ((index + 1) % 10 === 0 ? "\n" : " ");
        }, "");

        return (
            <td className="whitespace-pre-line">
                {open ? formattedDescription : shortText}

                {words.length > 5 && (
                    <button
                        className="btn btn-xs btn-success ml-2"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? "-" : "+"}
                    </button>
                )}
            </td>
        );
    }

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

    const ajouterDemande = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3000/dashboard/utilisateur/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Description: description,
                    id_status: priorite,
                }),
            });

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
        <section className="flex flex-col p-6">
            <section className="flex justify-between items-center mb-4">
                <label className="input">
                    <input
                        type="search"
                        placeholder="Recherche par numéro ou description"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>

                <button
                    className="btn btn-success"
                    onClick={() => setShowModal(true)}
                >
                    Ajouter une demande
                </button>
            </section>

            <div className="overflow-x-auto">
                <Table_Demandes demandes={demandesFiltrees} />
            </div>

            {showModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            Nouvelle demande
                        </h3>

                        <textarea
                            className="textarea textarea-bordered w-full mb-4"
                            placeholder="Description de la demande"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <select
                            className="select select-bordered w-full mb-4"
                            value={priorite}
                            onChange={(e) => setPriorite(e.target.value)}
                        >
                            <option value="1">Urgent</option>
                            <option value="2">Peut attendre</option>
                            <option value="3">Pressant</option>
                        </select>

                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={ajouterDemande}
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