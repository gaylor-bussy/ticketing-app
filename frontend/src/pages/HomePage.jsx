import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [nextPage,setNextPage] = useState(false);

  function handleNext(){
    setNextPage(true);
  }
  return (
    <section className="flex justify-center h-full items-center" >
      <form action="" className="flex flex-col w-xl" method="post">
        <div className="my-4">
          <label className="text-white text-2xl" htmlFor="">Numéro AFPA :</label>
          <input
            type="text"
            placeholder="Saisissez votre numéro AFPA"
            className="input input-success w-full placeholder:text-xl h-12"
          />
        </div>
        <div className="my-4">
          <label className="text-white text-2xl" htmlFor="">Nom :</label>
          <input
            type="text"
            placeholder="Saisissez votre Nom"
            className="input input-success w-full placeholder:text-xl h-12"
          />
        </div>
        <div className="my-4">
          <label className="text-white text-2xl" htmlFor="">Prénom :</label>
          <input
            type="text"
            placeholder="Saisissez votre Prénom"
            className="input input-success w-full placeholder:text-xl h-12"
          />
        </div>
        <Link to="/next">
          <button onClick={handleNext}
            className="btn btn-success h-14 w-full text-2xl my-4 text-black"
            type="submit"
          >
            Suivant
          </button>
        </Link>
      </form>
    </section>
  );
}
