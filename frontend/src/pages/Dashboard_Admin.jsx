import { Link } from "react-router-dom";

export default function Dashboard_Admin() {
    return (

        <section className="flex flex-col p-6">

            <section className="flex justify-center h-full items-center">

                <label className="input" >
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" required placeholder="Recherche" />
                </label>
            </section>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Numéro de demande</th>
                            <th>Description</th>
                            <th>Collaborateur</th>
                            <th>Date de la demande</th>
                            <th>Priorité</th>
                            <th>Prise en charge</th>
                            <th>Slider</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr>
                            <th><button className="btn btn-success">Description <br></br> complète</button></th>
                            <td>1</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                            <td></td>
                            <td>
                                <div className="badge badge-success">Faible</div>
                                <div className="badge badge-warning">Moyenne</div>
                                <div className="badge badge-error">Haute</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </section>
    );
}


