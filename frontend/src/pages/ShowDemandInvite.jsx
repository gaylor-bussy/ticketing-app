import { useState, useEffect } from "react";
import Table_Demandes from "../components/Table_Demandes";
export default function ShowDemandinvite({ idDemandeInvitee, numDemande }) {
  const [demandes, setDemandes] = useState([]);

  if (numDemande === "") {
    useEffect(() => {
      fetch(`http://localhost:3000/invite/request/${idDemandeInvitee}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => setDemandes(data))
        .catch((error) => console.error(error));
    }, []);
  } else {
    useEffect(() => {
      fetch(`http://localhost:3000/invite/request/${numDemande}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => setDemandes(data))
        .catch((error) => console.error(error));
    }, []);
  }
  return <Table_Demandes demandes={demandes} />;
}
