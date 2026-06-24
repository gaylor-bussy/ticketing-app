import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage({setIdDemandeInvitee,setNextPage,nextPage}) {
  const navigate = useNavigate();

 function handleNext() {
    setNextPage(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const user = {
      Num_AFPA_invite: formData.get("num_afpa"),
      Nom_AFPA_invite: formData.get("nom_afpa"),
      Prenom_AFPA_invite: formData.get("prenom_afpa"),
      Description: formData.get("description"),
      id_status: formData.get("status")
    };
 console.log(user);

    const url = "http://localhost:3000/invite/request";
    try {
      const reponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const resultat = await reponse.json();
      if (!reponse.ok) {
        return;
      }
      console.log(resultat[0].id_demande);
      setIdDemandeInvitee(resultat[0].id_demande);
    } catch (erreur) {
      console.error(erreur.message);
    }
    
    
  setNextPage(false);
  navigate("/resultat-demande");
    
    
  }
  return (
    <section className="flex justify-center h-full items-center">
      <form action="" className="flex flex-col w-xl" onSubmit={handleSubmit}>
        <section className={nextPage === false ? "null" : "hidden"}>
          <div className="my-4">
            <label className="text-white text-2xl" htmlFor="">
              Numéro AFPA :
            </label>
            <input
              type="text"
              placeholder="Saisissez votre numéro AFPA"
              className="input input-success w-full placeholder:text-xl h-12"
              name="num_afpa"
            />
          </div>
          <div className="my-4">
            <label className="text-white text-2xl" htmlFor="">
              Nom :
            </label>
            <input
              type="text"
              placeholder="Saisissez votre Nom"
              className="input input-success w-full placeholder:text-xl h-12"
              name="nom_afpa"
            />
          </div>
          <div className="my-4">
            <label className="text-white text-2xl" htmlFor="">
              Prénom :
            </label>
            <input
              type="text"
              placeholder="Saisissez votre Prénom"
              className="input input-success w-full placeholder:text-xl h-12"
              name="prenom_afpa"
            />
          </div>
          <div
            onClick={handleNext}
            className="btn btn-success h-14 w-full text-2xl my-4 text-black"
          >
            Suivant
          </div>
        </section>
        <div className={nextPage === true ? "null" : "hidden"}>
          <select defaultValue="" className="select block mb-2" name="status">
            <option disabled={true}>Selectionner un niveau d'urgence :</option>
            <option value={2}>Peu attendre</option>
            <option value={3}>Pressant</option>
            <option value={1}>Urgent</option>
          </select>
          <label className="text-white text-2xl" htmlFor="">
            Description :
          </label>
          <textarea
            placeholder="Saisir votre description"
            className="textarea textarea-success w-full h-36 mt-4"
            name="description"
          ></textarea>
          <button
            className="btn btn-success h-14 w-full text-2xl my-4 text-black "
            type=""
          >
            Envoyer la demande
          </button>
        </div>
      </form>
    </section>
  );
}
