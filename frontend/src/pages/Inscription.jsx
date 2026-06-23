import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Inscription() {
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const user = {
      numAfpa: formData.get("num_afpa"),
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      password: formData.get("password"),
    };

    console.log(user);
    

    const url = "http://localhost:3000/register";
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
      setTimeout(() => {
        navigate("/connexion");
      }, 3000);
    } catch (erreur) {
      console.error(erreur.message);
    }
  }
  return (
    <section className="flex justify-center h-full items-center">
      <form action="" className="flex flex-col w-xl" onSubmit={handleSubmit}>
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
            name="nom"
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
            name="prenom"
          />
        </div>
        <div className="my-4">
          <label className="text-white text-2xl" htmlFor="">
            Mot de passe :
          </label>
          <input
            type="password"
            placeholder="Saisissez votre mot de passe"
            className="input input-success w-full placeholder:text-xl h-12"
            name="password"
          />
        </div>
        <button
          className="btn btn-success h-14 w-full text-2xl my-4 text-black"
          type="submit"
        >
          Inscription
        </button>
      </form>
    </section>
  );
}
