import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
export default function ShowDemandinvite2({ idDemandeInvitee, numDemande }) {
  const [demandes, setDemandes] = useState([]);

  const idDemandeInvite = localStorage.getItem("id_demande_invite");

  useEffect(() => {
    fetch(`http://localhost:3000/invite/request/${idDemandeInvite}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setDemandes(data))
      .catch((error) => console.error(error));
  }, []);
  console.log(demandes);
  return (
    <section className="w-full px-3 py-4 sm:px-6 lg:py-8">
      <Table_Demandes demandes={demandes} />
    </section>
  );
}
