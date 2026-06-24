

export default function Table_Demandes({ demandes }) {
    return (
        <div className="overflow-x-auto">
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
                            <td>{demande.Description}</td>

                            <td>
                                {new Date(
                                    demande.Date_creation
                                ).toLocaleDateString("fr-FR")}
                            </td>

                            <td>{demande.Nom}</td>

                            <td>
                                {demande.id_status === 1 && (
                                    <span className="badge badge-error">
                                        Urgent
                                    </span>
                                )}

                                {demande.id_status === 2 && (
                                    <span className="badge badge-success">
                                        Peut attendre
                                    </span>
                                )}

                                {demande.id_status === 3 && (
                                    <span className="badge badge-warning">
                                        Pressant
                                    </span>
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
        </div>
    );
}