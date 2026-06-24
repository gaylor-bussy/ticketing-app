import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Consulter_Demande({setNumDemande}) {
    
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const num_demande =  formData.get("num_demande");

    setNumDemande(num_demande);

    navigate("/demand-invit-show");
    

    // const url = `http://localhost:3000/invite/request/${num_demande}`;
    // try {
    //   const reponse = await fetch(url, {
    //     method: "GET",
    //   });
    //   const resultat = await reponse.json();
    //   if (!reponse.ok) {
    //     return;
    //   }
    // } catch (erreur) {
    //   console.error(erreur.message);
    // }
  }
  return (
    <section className="flex w-full h-full justify-center items-center ">
      <form action="" className="flex flex-col w-1/3" onSubmit={handleSubmit}>
        <div className="my-4 flex flex-col">
          <label className="text-white text-2xl mb-4" htmlFor="">
            Numéro de demande :
          </label>
          <input
            type="text"
            placeholder="Saisissez votre numéro de demande"
            className="input input-success  placeholder:text-xl h-12 w-full"
            name="num_demande"
          />
        </div>
        <button type="submit" className="btn btn-success w-full h-20 mt-8">Consulter</button>
      </form>
    </section>
  );
}
