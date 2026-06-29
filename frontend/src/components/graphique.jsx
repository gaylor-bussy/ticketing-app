import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from "react";



export default function Graphique() {
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


       <Box sx={{ width: '100%', height: 300 }}>
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
  );
}


















