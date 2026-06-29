import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function HomePage({
  setIdDemandeInvitee,
  setNextPage,
  nextPage,
}) {
  const navigate = useNavigate();
  const inputNomRef = useRef(null);
  const inputPrenomRef = useRef(null);
  const inputNumAfpaRef = useRef(null);
  const [messageInputNumAfpaInvite, setMessageInputNumAfpaInvite] =
    useState("");
  const [messageInputNom, setMessageInputNom] = useState("");
  const [messageInputPrenom, setMessageInputPrenom] = useState("");

  function isOnlyNumbers(str) {
    // Vérification du type
    if (typeof str !== "string") {
      return false;
    }

    // Supprimer les espaces en début et fin
    str = str.trim();

    // Chaîne vide => faux
    if (str.length === 0) {
      return false;
    }

    // Expression régulière : ^ début, $ fin, [0-9]+ un ou plusieurs chiffres
    return /^[0-9]+$/.test(str);
  }

  function handleNext() {
    if (isOnlyNumbers(inputNumAfpaRef.current.value) === false) {
      setMessageInputNumAfpaInvite("Champ ci dessus invalide !");
      setTimeout(() => {
        setMessageInputNumAfpaInvite("");
      }, 3000);
    }
    else if (inputNumAfpaRef.current.value === "") {
      setMessageInputNumAfpaInvite("Veuillez renseigner le champ ci dessus !");
      setTimeout(() => {
        setMessageInputNumAfpaInvite("");
      }, 3000);
    } else if (inputNomRef.current.value === "") {
      setMessageInputNom("Veuillez renseigner le champ ci dessus !");
      setTimeout(() => {
        setMessageInputNom("");
      }, 3000);
    } else if (inputPrenomRef.current.value === "") {
      setMessageInputPrenom("Veuillez renseigner le champ ci dessus !");
      setTimeout(() => {
        setMessageInputPrenom("");
      }, 3000);
    } else {
      setNextPage(true);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const user = {
      Num_AFPA_invite: formData.get("num_afpa"),
      Nom_AFPA_invite: formData.get("nom_afpa"),
      Prenom_AFPA_invite: formData.get("prenom_afpa"),
      Description: formData.get("description"),
      id_status: formData.get("status"),
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
      console.log(resultat.results);
      setIdDemandeInvitee(resultat.results);
      const idDemandeInviteLS = localStorage.setItem("id_demande_invite",resultat.results);
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
              ref={inputNumAfpaRef}
              required
            />
            {messageInputNumAfpaInvite !== "" ? (
              <div role="alert" className="alert alert-error">
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{messageInputNumAfpaInvite}</span>
              </div>
            ) : null}
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
              ref={inputNomRef}
              required
            />
            {messageInputNom !== "" ? (
              <div role="alert" className="alert alert-error">
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{messageInputNom}</span>
              </div>
            ) : null}
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
              ref={inputPrenomRef}
              required
            />
            {messageInputPrenom !== "" ? (
              <div role="alert" className="alert alert-error">
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
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{messageInputPrenom}</span>
              </div>
            ) : null}
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
            required
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
