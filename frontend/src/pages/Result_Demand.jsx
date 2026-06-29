import { Link } from "react-router-dom";

export default function Result_Demand({idDemandeInvitee}) {
  const idDemandeInvite = localStorage.getItem("id_demande_invite");
  return (
    <section className="flex flex-col justify-center h-full">
      <h1 className="text-5xl text-white text-center">Votre Numéro de demande est : </h1>
      <p className="text-5xl text-white text-center" >{idDemandeInvite}</p>
      <p className="text-3xl text-white text-center">
        Merci de bien vouloir garder ce numéro, il vous servira pour suivre
        votre demande.
      </p>
      <p className="text-3xl text-white text-center"><Link to={"/demand-invite-show2"} className="text-3xl text-blue-500">Cliquez-ici</Link> pour voir votre demande en cours</p>
    </section>
  );
}
