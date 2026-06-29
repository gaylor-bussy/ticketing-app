import { useState } from "react";


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

            <button
                className="btn btn-xs btn-ghost ml-2"
                onClick={() => navigator.clipboard.writeText(description)}
                title="Copier la description"
            >
                📋
            </button>
        </td>
    );
}

export default function Table_Demandes({
    demandes,
    isFormateur = false,
    isTechnicien = false,
    isManageur = false,
    positionnerDemande,
    ouvrirModalPriorite,
    ouvrirMessagerie,
    idUser,
    approuverPositionnement,
    refuserPositionnement,
}) {

    return (
        <table className="table table-zebra bg-green-200">
            <thead className="bg-zinc-800 text-white text-xl">
                <tr>
                    <th>Numéro demande</th>
                    <th>Description</th>
                    <th>Date de la demande</th>
                    <th>Demandeur</th>
                    <th>Priorité</th>
                    <th>Prise en charge</th>
                </tr>
            </thead>

            <tbody className="text-xl">
                {demandes.map((demande) => (
                    <tr key={demande.id_demande}>
                        <td>{demande.id_demande}</td>

                        <DescriptionCell description={demande.Description} />

                        <td>
                            {new Date(demande.Date_creation).toLocaleDateString("fr-FR")}
                        </td>

                        <td>{demande.Nom || demande.id_demandeur || "Invité"}</td>

                        <td >
                            {demande.id_status === 1 && (
                                <span className="badge badge-error">Urgent</span>
                            )}

                            {demande.id_status === 2 && (
                                <span className="badge badge-success">Peut attendre</span>
                            )}

                            {demande.id_status === 3 && (
                                <span className="badge badge-warning">Pressant</span>
                            )}

                            {(isFormateur || isTechnicien || isManageur) && (
                                <button
                                    className="btn btn-xs btn-outline ml-2"
                                    onClick={() => ouvrirModalPriorite(demande)}
                                >
                                    ✏️
                                </button>
                            )}
                        </td>

                        <td>
                            {isManageur && demande.id_positionneur && demande.id_positionneur !== 1 && !demande.id_technicien ? (
                                <div className="flex items-center gap-2">
                                    <span>
                                        {demande.Prenom_positionneur} {demande.Nom_positionneur}
                                    </span>

                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => approuverPositionnement(demande.id_demande)}
                                    >
                                        ✅
                                    </button>

                                    
                                    
                                </div>
                            ) : isManageur && demande.id_technicien ? (
                                <div className="flex items-center gap-2">
                                    <span>
                                        ✅ {demande.id_technicien === 1
                                            ? "Technicien"
                                            : `${demande.Prenom_positionneur} ${demande.Nom_positionneur}`}
                                    </span>

                                    <button
                                        className="btn btn-xs btn-info"
                                        title="Messagerie"
                                        onClick={() => ouvrirMessagerie(demande)}
                                    >
                                        💬
                                    </button>
                                </div>
                            ) : isFormateur && !demande.id_positionneur ? (
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={() => positionnerDemande(demande.id_demande)}
                                >
                                    Se positionner
                                </button>
                            ) : isFormateur && demande.id_positionneur === idUser && !demande.id_technicien ? (
                                <span>Vous êtes positionné, en attente de validation</span>
                            ) : isFormateur && demande.id_technicien === idUser ? (
                                <div className="flex items-center gap-2">
                                    <span>✅ Vous êtes confirmé</span>

                                    <button
                                        className="btn btn-xs btn-info"
                                        title="Messagerie"
                                        onClick={() => ouvrirMessagerie(demande)}
                                    >
                                        💬
                                    </button>
                                </div>
                            ) : (
                                <span>En attente</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table >
    );
}
