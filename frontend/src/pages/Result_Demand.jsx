import { Link } from "react-router-dom";

export default function Result_Demand({idDemandeInvitee , setColorChange}) {
  const idDemandeInvite = localStorage.getItem("id_demande_invite");
  function noColorChangee() {
    setColorChange(true);
  }
  
  return (
    <section className="mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-4 px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-center text-2xl text-white sm:text-4xl lg:text-5xl">Votre Numéro de demande est : </h1>
      <p className="break-words text-center text-3xl text-white sm:text-5xl" >{idDemandeInvite}</p>
      <p className="text-center text-base text-white sm:text-2xl lg:text-3xl">
        Merci de bien vouloir garder ce numéro, il vous servira pour suivre
        votre demande.
      </p>
      <p className="text-center text-base text-white sm:text-2xl lg:text-3xl"><Link to={"/demand-invite-show2"} onClick={noColorChangee} className="text-blue-500">Cliquez-ici</Link> pour voir votre demande en cours</p>
    </section>
  );
}
