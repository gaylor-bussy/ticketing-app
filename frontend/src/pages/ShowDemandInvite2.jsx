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
  return <Table_Demandes demandes={demandes} />;
}
