import { Link } from "react-router-dom";
import Deconnexion from "./Deconnexion";
export default function Header({
  user,
  setUser,
  token,
  setToken,
  setNextPage,
}) {
  function handleChange() {
    setNextPage(false);
  }


  return (
    <header className="flex bg-zinc-800 p-4 justify-between">
      <img src="/public/images/logo-AFPA-final.png" alt="" className="h-52"  />

      {user === null ? (
        <>
        <div className="flex">
          {" "}
          <Link
            className="text-white self-end text-2xl mr-48"
            to="/"
            onClick={handleChange}
          >
            Ajouter une demande
          </Link>
          <Link
            className="text-white self-end text-2xl"
            to="/consulter-demande"
          >
            Consulter une demande
          </Link>
        </div>
        <div>
          <Link to={"/inscription"}>
            <button className="btn btn-success m-2 text-black h-14 w-32 text-2xl ">
              S'inscrire
            </button>
          </Link>
          <Link to={"/connexion"}>
            <button className="btn btn-success m-2 text-black h-14 w-32 text-2xl">
              Connexion
            </button>
          </Link>
        </div>
        </>
      ) : (
        <Deconnexion
          user={user}
          setUser={setUser}
          token={token}
          setToken={setToken}
        />
      )}
    </header>
  );
}
