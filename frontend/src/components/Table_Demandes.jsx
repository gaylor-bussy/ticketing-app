import { responsiveFontSizes } from "@mui/material/styles";
import { useState } from "react";

function DescriptionCell({ description = "", className = "" }) {
    const [open, setOpen] = useState(false);

    const words = description.split(" ");
    const shortText = words.slice(0, 5).join(" ");

    const formattedDescription = words.reduce((acc, word, index) => {
        return acc + word + ((index + 1) % 10 === 0 ? "\n" : " ");
    }, "");

    return (
        <td className={`whitespace-pre-line ${className}`}>
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
    validerRealisation,
}) {
    const [ligneOuverte, setLigneOuverte] = useState(null);

    return (
        <table className="table table-zebra bg-green-200">
            <thead className="bg-zinc-800 text-white text-xl">
                <tr>
                    <th>Numéro demande</th>
                    <th className="hidden lg:table-cell">Description</th>
                    <th className="hidden md:table-cell">Date de la demande</th>
                    <th>Demandeur</th>
                    <th className="hidden xl:table-cell">Priorité</th>
                    <th className="hidden xl:table-cell">Prise en charge</th>
                    {isManageur && <th className="hidden lg:table-cell">Réalisé</th>}
                    <th className="xl:hidden">Détails</th>
                </tr>
            </thead>

            <tbody className="text-xl">
                {demandes.map((demande) => (
                    <>
                        <tr key={demande.id_demande}>
                            <td>{demande.id_demande}</td>

                            <DescriptionCell
                                description={demande.Description}
                                className="hidden lg:table-cell"
                            />

                            <td className="hidden md:table-cell">
                                {new Date(demande.Date_creation).toLocaleDateString("fr-FR")}
                            </td>

                            <td>
                                {demande.Nom || demande.id_demandeur || "Invité"}
                            </td>

                            <td className="hidden xl:table-cell">
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

                            <td className="hidden xl:table-cell">
                                {demande.realise === 1 ? (
                                    <span className="badge badge-success">
                                        ✅ Réalisé le{" "}
                                        {new Date(demande.Date_realise).toLocaleDateString("fr-FR")}
                                    </span>
                                ) : isManageur &&
                                    demande.id_positionneur &&
                                    demande.id_positionneur !== 1 &&
                                    !demande.id_technicien ? (
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {demande.Prenom_positionneur} {demande.Nom_positionneur}
                                        </span>

                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() =>
                                                approuverPositionnement(demande.id_demande)
                                            }
                                        >
                                            ✅
                                        </button>

                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() =>
                                                refuserPositionnement(demande.id_demande)
                                            }
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ) : isManageur && demande.id_technicien ? (
                                    <div className="flex items-center gap-2">
                                        <span>
                                            ✅{" "}
                                            {demande.id_technicien === 1
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
                                ) : isFormateur && demande.id_positionneur === 8 ? (
                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => positionnerDemande(demande.id_demande)}
                                    >
                                        Se positionner
                                    </button>
                                ) : isFormateur &&
                                    demande.id_positionneur === idUser &&
                                    !demande.id_technicien ? (
                                    <span className="badge badge-warning">
                                        Positionné, en attente
                                    </span>
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

                            {isManageur && (
                                <td className="hidden lg:table-cell">
                                    {demande.realise === 1 ? (
                                        <span className="badge badge-success !text-xs whitespace-nowrap">
                                            ✅ Réalisé
                                        </span>
                                    ) : (
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() =>
                                                validerRealisation(demande.id_demande)
                                            }
                                        >
                                            Valider
                                        </button>
                                    )}
                                </td>
                            )}

                            <td className="xl:hidden">
                                <button
                                    className="btn btn-xs btn-info"
                                    onClick={() =>
                                        setLigneOuverte(
                                            ligneOuverte === demande.id_demande
                                                ? null
                                                : demande.id_demande
                                        )
                                    }
                                >
                                    {ligneOuverte === demande.id_demande ? "Masquer" : "Détails"}
                                </button>
                            </td>
                        </tr>

                        {ligneOuverte === demande.id_demande && (
                            <tr className="lg:hidden">
                                <td colSpan={isManageur ? 7 : 6}>
                                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                                        <p>
                                            <strong>Description :</strong> {demande.Description}
                                        </p>

                                        <p>
                                            <strong>Date :</strong>{" "}
                                            {new Date(demande.Date_creation).toLocaleDateString("fr-FR")}
                                        </p>

                                        <p>
                                            <strong>Demandeur :</strong>{" "}
                                            {demande.Nom || demande.id_demandeur || "Invité"}
                                        </p>

                                        <p>
                                            <strong>Priorité :</strong>{" "}
                                            {demande.id_status === 1
                                                ? "Urgent"
                                                : demande.id_status === 2
                                                    ? "Peut attendre"
                                                    : "Pressant"}
                                        </p>

                                        <p>
                                            <strong>Prise en charge :</strong>{" "}
                                            {demande.realise === 1
                                                ? `Réalisé le ${new Date(demande.Date_realise).toLocaleDateString("fr-FR")}`
                                                : demande.id_technicien
                                                    ? "Confirmé"
                                                    : demande.id_positionneur === 8
                                                        ? "En attente"
                                                        : "En attente de validation"}
                                        </p>

                                        {isManageur && (
                                            <p>
                                                <strong>Réalisé :</strong>{" "}
                                                {demande.realise === 1 ? "Oui" : "Non"}
                                            </p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
            </tbody>
        </table>
    );
}