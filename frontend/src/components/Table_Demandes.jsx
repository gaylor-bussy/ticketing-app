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
        </td>
    );
}

export default function Table_Demandes({ demandes }) {
    return (
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Numéro demande</th>
                    <th>Description</th>
                    <th>Date de la demande</th>
                    <th>Demandeur</th>
                    <th>Priorité</th>
                    <th>Prise en charge</th>
                </tr>
            </thead>

            <tbody>
                {demandes.map((demande) => (
                    <tr key={demande.id_demande}>
                        <td>{demande.id_demande}</td>

                        <DescriptionCell description={demande.Description} />

                        <td>
                            {new Date(demande.Date_creation).toLocaleDateString("fr-FR")}
                        </td>

                        <td>{demande.Nom || demande.id_demandeur || "Invité"}</td>

                        <td>
                            {demande.id_status === 1 && (
                                <span className="badge badge-error">Urgent</span>
                            )}

                            {demande.id_status === 2 && (
                                <span className="badge badge-success">Peut attendre</span>
                            )}

                            {demande.id_status === 3 && (
                                <span className="badge badge-warning">Pressant</span>
                            )}
                        </td>

                        <td>
                            {demande.id_technicien === null
                                ? "En cours de décision"
                                : demande.id_technicien}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}