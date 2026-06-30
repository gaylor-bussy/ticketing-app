import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Connexion({ user, setUser, token, setToken }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const userInfos = {
      Num_AFPA: formData.get("num_afpa"),
      Password: formData.get("password"),
    };

    const url = "http://localhost:3000/login";
    try {
      const reponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfos),
      });
      const resultat = await reponse.json();
      if (!reponse.ok) {
        setTypeMessage("error");
        setMessage(resultat.message);
        return;
      } else {
        localStorage.setItem("token", resultat.token);
        localStorage.setItem("user", JSON.stringify(resultat.user));
        setToken(resultat.token);
        setUser(resultat.user);
        // Redirection selon le rôle
        if (resultat.user.id_role === 4) {
          navigate("/dashboard/user");
        } else if (resultat.user.id_role === 3 || resultat.user.id_role === 2) {
          navigate("/dashboard/formateur-technicien");
        } else {
          navigate("/dashboard/manageur");
        }
      }
    } catch (erreur) {
      setTypeMessage("error");
      setMessage(resultat.message);
      console.error(erreur.message);
    }
  }


  return (
    <section className="flex justify-center h-full items-center">
      <form action="" className="flex flex-col w-xl" onSubmit={handleSubmit}>
        {message ? (
          <div
            role="alert"
            className={`alert ${typeMessage === "success" ? "alert-success" : "alert-error"}`}
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
        <div className="my-4">
          <label className="text-white text-2xl" htmlFor="">
            Numéro AFPA :
          </label>
          <input
            type="text"
            placeholder="Saisissez votre numéro AFPA"
            className="input input-success w-full placeholder:text-xl h-12"
            name="num_afpa"
            required
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
            required
          />
        </div>

        <button
          className="btn btn-success h-14 w-full text-2xl my-4 text-black"
          type="submit"
        >
          Connexion
        </button>
      </form>
    </section>
  );
}
