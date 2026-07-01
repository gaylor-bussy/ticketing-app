import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
import Search_Bar from "../components/Search_Bar";
import Modal_Add_Demande from "../components/Modal_Add_Demande";
import Modal_Messagerie from "../components/Modal_Messagerie";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

export default function Dashboard_Manager({ userr }) {
    const [demandes, setDemandes] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [priorite, setPriorite] = useState("2");
    const user = JSON.parse(localStorage.getItem("user"));
    const [showPrioriteModal, setShowPrioriteModal] = useState(false);
    const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
    const [nouvellePriorite, setNouvellePriorite] = useState("2");
    const [showMessagerie, setShowMessagerie] = useState(false);
    const [demandeMessagerie, setDemandeMessagerie] = useState(null);
    const [techniciens, setTechniciens] = useState([]);
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(demandes);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Demandes");

        XLSX.writeFile(workbook, "demandes.xlsx");
    };
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

        fetch("http://localhost:3000/dashboard/manageur/gestion_utilisateur", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTechniciens(
                        data.filter((utilisateur) => Number(utilisateur.id_role) === 3),
                    );
                } else {
                    setTechniciens([]);
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
            },
        );

        const data = await response.json();
        console.log(data);

        setDescription("");
        setPriorite("2");
        setShowModal(false);
        window.location.reload();
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
            },
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setDemandes((prev) =>
                prev.map((demande) =>
                    demande.id_demande === id_demande
                        ? {
                            ...demande,
                            id_technicien: demande.id_positionneur,
                            Nom_technicien: demande.Nom_positionneur,
                            Prenom_technicien: demande.Prenom_positionneur,
                        }
                        : demande,
                ),
            );
        }
    };

    const choisirTechnicien = async (id_demande, id_technicien) => {
        if (!id_technicien) return;

        const token = localStorage.getItem("token");
        const idTechnicien = Number(id_technicien);
        const idPositionneur = idTechnicien === 8 ? user?.id_user : idTechnicien;
        const technicienSelectionne = techniciens.find(
            (technicien) => Number(technicien.id_user) === idTechnicien,
        );

        const appliquerTechnicien = (technicien = technicienSelectionne) => {
          setDemandes((prev) =>
            prev.map((demande) =>
                String(demande.id_demande) === String(id_demande)
                    ? {
                        ...demande,
                        id_technicien: idTechnicien,
                        id_positionneur: idPositionneur,
                        technicien_selectionne: true,
                        Nom_technicien: technicien?.Nom,
                        Prenom_technicien: technicien?.Prenom,
                        Nom_positionneur: technicien?.Nom,
                        Prenom_positionneur: technicien?.Prenom,
                    }
                    : demande,
            ),
          );
        };

        appliquerTechnicien();

        try {
            const response = await fetch(
                `http://localhost:3000/dashboard/complet/uptade/technicien/${id_demande}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ id_technicien }),
                },
            );

            const contentType = response.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await response.json()
                : { message: await response.text() };

            console.log(data);

            if (!response.ok) {
                console.error(data.message || "Le technicien n'a pas pu être enregistré.");
                return;
            }

            appliquerTechnicien(data.technicien || technicienSelectionne);
        } catch (error) {
            console.error(error);
        }
    };

    const refuserPositionnement = async (id_demande) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/uptade/refus/${id_demande}`,
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
            setDemandes((prev) =>
                prev.map((demande) =>
                    demande.id_demande === id_demande
                        ? { ...demande, id_positionneur: 1 }
                        : demande
                )
            );
        }
    };

    const validerRealisation = async (id_demande) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/update/realise/${id_demande}`,
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
            const dateNow = new Date().toISOString();

            setDemandes((prev) =>
                prev.map((demande) =>
                    demande.id_demande === id_demande
                        ? {
                            ...demande,
                            realise: 1,
                            Date_realise: dateNow,
                        }
                        : demande
                )
            );
        }
    };

    return (
        <section className="flex w-full min-w-0 max-w-full flex-col overflow-x-hidden px-3 py-4 sm:px-6 lg:py-8">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-words text-white">Bonjour {userr.nom}</p>
                <p className="break-words text-white">Role du compte : {userr.nom_role}</p>
            </div>
            <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)] lg:items-center">
                <Search_Bar search={search} setSearch={setSearch} />
                <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Link className="w-full" to={"/dashboard/manageur/gestion_utilisateur"}>
                <button className="btn btn-success w-full text-xs sm:text-sm" >
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-gear" viewBox="0 0 16 16">
  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
</svg>
                Gestion Utilisateur
                </button>
                </Link>
                <button className="btn btn-success w-full text-xs sm:text-sm" onClick={exportExcel}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
  <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
</svg>
                    Export Excel
                </button>
                <Link className="w-full" to={"/dashboard/manageur/graphique"}>
                    <button className="btn btn-success w-full text-xs sm:text-sm" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"/>
</svg>
                        Graphique
                    </button>
                </Link>
                <button className="btn btn-success w-full text-xs sm:text-sm" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square-dotted" viewBox="0 0 16 16">
  <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
</svg>
                    Ajouter une demande
                </button>
                </div>
            </section>

            <Table_Demandes
                demandes={demandesFiltrees}
                isManageur={true}
                ouvrirModalPriorite={ouvrirModalPriorite}
                approuverPositionnement={approuverPositionnement}
                refuserPositionnement={refuserPositionnement}
                ouvrirMessagerie={ouvrirMessagerie}
                validerRealisation={validerRealisation}
                techniciens={techniciens}
                choisirTechnicien={choisirTechnicien}
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
                    <div className="modal-box w-11/12 max-w-lg">
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

                        <div className="modal-action flex-col sm:flex-row">
                            <button
                                className="btn btn-error w-full sm:w-auto"
                                onClick={() => setShowPrioriteModal(false)}
                            >
                                Annuler
                            </button>

                            <button
                                className="btn btn-success w-full sm:w-auto"
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
