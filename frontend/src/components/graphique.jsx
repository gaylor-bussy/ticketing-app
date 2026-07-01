import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function Graphique({userr}) {
  const [demandes, setDemandes] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/dashboard/manageur/graphique", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(Array.isArray(data));
        setDemandes(data);
      })
      .catch((error) => console.error(error));
  }, []);
  console.log(demandes)
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const margin = { right: 24 };

  const xLabels = demandes.map((d) => mois[d.mois - 1]);
  const crees = demandes.map((d) => d.crees);
  const realisees = demandes.map((d) => d.realisees);
  





  return (
        <>
             <section className="flex flex-col p-3 sm:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <p className="text-white mb-6">Bonjour {userr.nom}</p>
                 
                <p className="text-white">Role du compte : {userr.nom_role}</p>
               
             </div>
              <Link  to={"/dashboard/manageur"}>
                <button className="btn btn-success w-full sm:w-auto" >
                Retour
                </button>
                </Link>
                <Link  to={"/dashboard/manageur/graphique/annee"}>
                <button class="btn btn-dash btn-success w-full sm:w-auto mt-2" >
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-plus" viewBox="0 0 16 16">
  <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
</svg>
                Par Année
                </button>
                </Link>
             </section>
        <div className="w-full overflow-x-auto px-3 sm:px-6">
       <Box sx={{ minWidth: 320, width: '100%', height: 300 }}>
      <LineChart 
  series={[
    {
      data: crees,
      label: "Demandes crées",
    },
    {
      data: realisees,
      label: "Demandes réalisées",
    },
  ]}
  xAxis={[
    {
      scaleType: "point",
      data: xLabels,
    },
  ]}
  yAxis={[{ width: 50 }]}
/>
    </Box>
    </div>
    </>
  );
}

















