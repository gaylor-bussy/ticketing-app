import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal_Modification_Utilisateur from "./Modal_Modification_utilisateur";
import Modal_Supprime from "./Modal_Supprime";


export default function GestionUtilisateur({userr}){
    const user = JSON.parse(localStorage.getItem("user"));
    const [gestion,setGestion]=useState([]);
    const [showModalModification, setShowModalModification] = useState(false);
    const [userSelectionnee, setUserSelectionnee] = useState(null);
    const [showModalSupprime, setShowModalSupprime] = useState(false);

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

    const response = await fetch(
      `http://localhost:3000/dashboard/manageur/gestion_utilisateur/modification/${userSelectionnee.id_user}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },body: JSON.stringify(userSelectionnee),
       
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



const SupprimeUtilisateur = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/dashboard/manageur/gestion_utilisateur/supprime/${userSelectionnee.id_user}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },body: JSON.stringify(userSelectionnee),
       
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

      setShowModalSupprime(false);
      setUserSelectionnee(null);
       window.location.reload();
    }
  };






return(

<>
 <section className="flex min-w-0 flex-col px-3 py-4 sm:px-6 lg:py-8">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="break-words text-white">Bonjour {userr.nom}</p>
                 
                <p className="break-words text-white">Role du compte : {userr.nom_role}</p>
               
             </div>
              <Link  to={"/dashboard/manageur"}>
                <button className="btn btn-success w-full sm:w-auto" >
                Retour
                </button>
                </Link>
             </section>
             
             

              <section className="grid gap-3 px-3 pb-4 sm:px-6 md:hidden">
                 {gestion.map((user_) => (
                    <article key={user_.id_user} className="rounded-lg bg-green-200 p-4 text-sm shadow">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold break-words">
                            {user_.Nom} {user_.Prenom}
                          </p>
                          <p className="text-xs">Utilisateur #{user_.id_user}</p>
                        </div>
                        <span className="badge badge-success shrink-0">{user_.Nom_role}</span>
                      </div>

                      <p className="break-words">
                        <strong>Numéro AFPA :</strong> {user_.Num_AFPA}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button className="btn btn-xs btn-outline w-full" onClick={() =>{
                         setUserSelectionnee({...user_});
                         setShowModalModification(true);
                    }}>Modifier</button>
                        <button className="btn btn-xs btn-error w-full" onClick={() =>{
                         setUserSelectionnee({...user_});
                         setShowModalSupprime(true)}}>Supprimer</button>
                      </div>
                    </article>
                 ))}
              </section>

              <div className="hidden w-full overflow-x-auto rounded-lg px-3 pb-4 sm:px-6 md:block">
              <table className="table table-zebra min-w-[760px] bg-green-200">
            <thead className="bg-zinc-800 text-sm text-white lg:text-base xl:text-lg">
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
              <tbody className="text-sm lg:text-base xl:text-lg">
                 {gestion.map((user_) => (
                    <tr key={user_.id_user}>

                    <td className="whitespace-nowrap">{user_.id_user}</td>
                    <td className="break-words">{user_.Nom }</td>
                    <td className="break-words">{user_.Prenom }</td>
                    <td className="whitespace-nowrap">{user_.Num_AFPA }</td>
                    <td className="break-words">{user_.Nom_role }</td>
                    <td><button className="btn btn-xs btn-outline ml-2" onClick={() =>{
                         setUserSelectionnee({...user_});
                         setShowModalModification(true);
                    }}>✏️</button></td>
                    <td><button className="btn btn-xs btn-error "onClick={() =>{
                         setUserSelectionnee({...user_});
                         setShowModalSupprime(true)}}>❌</button></td>
                    </tr>
))}

              </tbody>
             </table>
             </div>
         <Modal_Modification_Utilisateur
              showModalModification={showModalModification}
              setShowModalModification={setShowModalModification}
              userSelectionnee={userSelectionnee}
              setUserSelectionnee={setUserSelectionnee}
              ModificationUtilisateur={ModificationUtilisateur}    
            />
             <Modal_Supprime
              showModalSupprime={showModalSupprime}
              setShowModalSupprime={setShowModalSupprime}
              userSelectionnee={userSelectionnee}
              setUserSelectionnee={setUserSelectionnee}
              SupprimeUtilisateur={SupprimeUtilisateur}    
            />

             </>





)



}
