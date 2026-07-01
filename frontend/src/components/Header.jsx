import { Link } from "react-router-dom";
import Deconnexion from "./Deconnexion";
import { useState } from "react";
export default function Header({
  user,
  setUser,
  token,
  setToken,
  setNextPage,
}) {
  const [colorChange, setColorChange] = useState(false);
  const [noColorChange, setNoColorChange] = useState(false);

  function handleChange() {
    setNextPage(false);
    setNoColorChange(false);
    setColorChange(false);
  }
  function changeColor() {
    setNoColorChange(false);
    setColorChange(true);
  }
  function noColorChangee() {
    setNoColorChange(true);
  }

  return (
    <header className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden bg-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <img
        src="/public/images/logo-AFPA-final.png"
        alt=""
        className="h-20 w-auto object-contain sm:h-24 lg:h-32"
      />

      {user === null ? (
        <>
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:gap-5 md:gap-8">
            {" "}
            <Link
              className={
                noColorChange
                  ? "text-white text-base sm:text-lg lg:text-xl"
                  : !colorChange && !noColorChange
                    ? "text-green-400 text-base underline sm:text-lg lg:text-xl"
                    : "text-white text-base sm:text-lg lg:text-xl"
              }
              to="/"
              onClick={handleChange}
            >
              Ajouter une demande
            </Link>
            <Link
              className={
                noColorChange
                  ? "text-white text-base sm:text-lg lg:text-xl"
                  : !colorChange && !noColorChange
                    ? "text-white text-base sm:text-lg lg:text-xl"
                    : "text-green-400 text-base underline sm:text-lg lg:text-xl"
              }
              to="/consulter-demande"
              onClick={changeColor}
            >
              Consulter une demande
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link to={"/inscription"} onClick={noColorChangee}>
              <button className="btn btn-success w-full text-black text-sm sm:w-28 sm:text-base lg:w-32">
                S'inscrire
              </button>
            </Link>
            <Link to={"/connexion"} onClick={noColorChangee}>
              <button className="btn btn-success w-full text-black text-sm sm:w-28 sm:text-base lg:w-32">
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
