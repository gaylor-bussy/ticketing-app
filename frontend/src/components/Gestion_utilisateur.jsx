import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal_Modification_Utilisateur from "./Modal_Modification_utilisateur";



export default function GestionUtilisateur({userr}){
    const user = JSON.parse(localStorage.getItem("user"));
    const [gestion,setGestion]=useState([]);
    const [showModalModification, setShowModalModification] = useState(false);
     const [userSelectionnee, setUserSelectionnee] = useState(null);


 useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/dashboard/manageur/gestion_utilisateur", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(Array.isArray(data));
        setGestion(data);
      })
      .catch((error) => console.error(error));

  }, []);


const ModificationUtilisateur = async () => {
    const token = localStorage.getItem("token");
console.log(userSelectionnee);
    const response = await fetch(
      `http://localhost:3000/dashboard/manageur/gestion_utilisateur/modification/${userSelectionnee.id_user}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },body: JSON.stringify({
  Nom: userSelectionnee.Nom,
  Prenom: userSelectionnee.Prenom,
  Num_AFPA: userSelectionnee.Num_AFPA,
  id_role: userSelectionnee.id_role,
}),
       
      },
    );

    const data = await response.json();
    console.log(response.status);
console.log(data);

    if (response.ok) {
      setGestion((prev) =>
        prev.map((u) =>
          u.id_user == data.id_user ? data:  u,
        ),
      );

      setShowModalModification(false);
      setUserSelectionnee(null);
    }
  };






return(

<>
 <section className="flex flex-col p-6">
            <div className="flex justify-between">
                <p className="text-white mb-6">Bonjour {userr.nom}</p>
                 
                <p className="text-white">Role du compte : {userr.nom_role}</p>
               
             </div>
              <Link  to={"/dashboard/manageur"}>
                <button className="btn btn-success " >
                Retour
                </button>
                </Link>
             </section>
             
             
        
              <table className="table table-zebra bg-green-200">
            <thead className="bg-zinc-800 text-white text-xl">
                <tr>
                    <th>Numéro utilisateur</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Numéro AFPA</th>
                    <th>Rôle</th>
                    <th>Modifier</th>
                    <th>Supprimer</th>
                </tr>
            </thead>
              <tbody className="text-xl">
                 {gestion.map((user_) => (
                    <tr key={user_.id_user}>

                    <td>{user_.id_user}</td>
                    <td >{user_.Nom }</td>
                    <td >{user_.Prenom }</td>
                    <td>{user_.Num_AFPA }</td>
                    <td>{user_.Nom_role }</td>
                    <td><button class="btn btn-xs btn-outline ml-2" onClick={() =>{
                         setUserSelectionnee(user_);
                         setShowModalModification(true);
                    }}>✏️</button></td>
                    <td><button class="btn btn-xs btn-error ">❌</button></td>
                   

                    </tr>
                    

))}

         <Modal_Modification_Utilisateur
              showModalModification={showModalModification}
              setShowModalModification={setShowModalModification}
              userSelectionnee={userSelectionnee}
              setUserSelectionnee={setUserSelectionnee}

              ModificationUtilisateur={ModificationUtilisateur}
                
            />

              </tbody>
             
             </table>
             
             </>





)



}
