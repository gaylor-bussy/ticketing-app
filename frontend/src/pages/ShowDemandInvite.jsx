import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
export default function ShowDemandinvite({ idDemandeInvitee, numDemande }) {
  const [demandes, setDemandes] = useState([]);


    const getNumDemande = localStorage.getItem("num_demande");
    console.log(demandes);
    
    useEffect(() => {
      fetch(`http://localhost:3000/invite/request/${getNumDemande}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => setDemandes(data))
        .catch((error) => console.error(error));
    }, []);
  return (
    <section className="w-full px-3 py-4 sm:px-6 lg:py-8">
      <Table_Demandes demandes={demandes} />
    </section>
  );
}
