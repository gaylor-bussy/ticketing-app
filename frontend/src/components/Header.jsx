import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header className="flex bg-zinc-800 p-4 justify-between">
      <img src="public/images/logo-AFPA-final.png" alt="" className="h-52" />
      <Link className="text-white self-end text-2xl" to="/">
        Ajouter une demande
      </Link>
      <a href="" className="text-white self-end text-2xl">
        Consulter une demande
      </a>
      <div className="flex ">
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
        <Link className="text-white self-end text-2xl" to="/dashboard/user">
          <button className="btn btn-success m-2 text-black h-14 w-32 text-2xl ">
            dashboard
          </button>
        </Link>
      </div>
    </header>
  );
}
