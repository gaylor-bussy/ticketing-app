import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Consulter_Demande({ setNumDemande }) {
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const num_demande = formData.get("num_demande");

    setNumDemande(num_demande);

    const url = `http://localhost:3000/invite/request/${num_demande}`;
    try {
      const reponse = await fetch(url, {
        method: "GET",
      });
      const resultat = await reponse.json();
      if (!reponse.ok) {
        setTypeMessage("error");
        setMessage(resultat.message);
        return;
      }
      setTypeMessage("success");
      setMessage(resultat.message);
      const savedNumDemande = localStorage.setItem("num_demande",num_demande);
      navigate("/demand-invit-show")
      return savedNumDemande;
    

    } catch (erreur) {
      setTypeMessage("error");
      setMessage("Impossible de contacter le serveur.");
      console.error(erreur.message);
    }
  }
  return (
    <section className="flex min-h-full w-full items-center justify-center px-4 py-6 sm:px-6 lg:py-10">
      <form action="" className="flex w-full max-w-xl flex-col" onSubmit={handleSubmit}>
        {message ? (
          <div
            role="alert"
            className={`alert items-start text-sm sm:text-base ${typeMessage === "success" ? "alert-success" : "alert-error"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        ) : null}
        <div className="my-4 flex flex-col">
          <label className="mb-3 text-base text-white sm:text-xl" htmlFor="">
            Numéro de demande :
          </label>
          <input
            type="text"
            placeholder="Saisissez votre numéro de demande"
            className="input input-success h-12 w-full text-base placeholder:text-sm sm:placeholder:text-base"
            name="num_demande"
          />
        </div>
        <button type="submit" className="btn btn-success mt-6 h-12 w-full text-base sm:h-14 sm:text-xl">
          Consulter
        </button>
      </form>
    </section>
  );
}
