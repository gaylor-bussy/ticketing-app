import { useState, useEffect } from "react";


export default function Dashboard_User() {

    const [demandes, setDemandes] = useState([]);

    useEffect(() => {
        const url = `http://localhost:3000/dashboard/utilisateur`;
        const token = localStorage.getItem("token");
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Data reçue :", data);
                setDemandes(data);
            })
            .catch((error) => console.error(error));
    }, []);

    console.log("Demandes :", demandes);

    return (


        <section className="flex flex-col p-6">

            <section className="flex justify-center h-full items-center">
                <label className="input">
                    <input type="search" placeholder="Recherche" />
                </label>
            </section>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Demandeur</th>
                            <th>Date de la demande</th>
                            <th>Priorité</th>
                            <th>Prise en charge</th>
                        </tr>
                    </thead>

                    <tbody>
                        {demandes.map((demande) => (
                            <tr key={demande.id_demande}>
                                <td>{demande.id_demande}</td>
                                <td>{demande.Description}</td>
                                <td>{demande.Date_creation}</td>
                                <td>{demande.Nom}</td>
                                <td>{demande.Date_creation}</td>
                                <td>{demande.id_status === null ? "Peu préssant" : demande.id_status}</td>
                                <td>{demande.id_technicien === null ? "En cours de décison" : demande.id_technicien}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </section >


    )
}
