import { Fragment, useState } from "react";

function DescriptionCell({ description = "", className = "" }) {
  const [open, setOpen] = useState(false);

  const words = description.split(" ");
  const shortText = words.slice(0, 5).join(" ");

  const formattedDescription = words.reduce((acc, word, index) => {
    return acc + word + ((index + 1) % 10 === 0 ? "\n" : " ");
  }, "");

  return (
    <td className={`whitespace-pre-line ${className}`}>
      {open ? formattedDescription : shortText}

      {words.length > 5 && (
        <button
          className="btn btn-xs btn-success ml-2"
          onClick={() => setOpen(!open)}
        >
          {open ? "-" : "+"}
        </button>
      )}

      <button
        className="btn btn-xs btn-ghost ml-2"
        onClick={() => navigator.clipboard.writeText(description)}
        title="Copier la description"
      >
        📋
      </button>
    </td>
  );
}

export default function Table_Demandes({
  demandes,
  isFormateur = false,
  isTechnicien = false,
  isManageur = false,
  positionnerDemande,
  ouvrirModalPriorite,
  ouvrirMessagerie,
  idUser,
  idRole,
  approuverPositionnement,
  refuserPositionnement,
  validerRealisation,
}) {
  const [ligneOuverte, setLigneOuverte] = useState(null);

  const getDemandeur = (demande) => {
    if (demande.Nom || demande.Prenom) {
      return `${demande.Nom || ""} ${demande.Prenom || ""}`.trim();
    }

    if (demande.Nom_AFPA_invite || demande.Prenom_AFPA_invite) {
      return `${demande.Nom_AFPA_invite || ""} ${demande.Prenom_AFPA_invite || ""} (invité)`.trim();
    }

    return "Invité";
  };

  const getPriorite = (demande) => {
    if (demande.id_status === 1) return "Urgent";
    if (demande.id_status === 2) return "Peut attendre";
    return "Pressant";
  };

  const getPrioriteClass = (demande) => {
    if (demande.id_status === 1) return "badge-error";
    if (demande.id_status === 2) return "badge-success";
    return "badge-warning";
  };

  const getPriseEnCharge = (demande) => {
    if (demande.realise === 1) {
      return `Réalisé le ${new Date(demande.Date_realise).toLocaleDateString("fr-FR")}`;
    }

    if (demande.id_technicien) return "Confirmé";
    if (demande.id_positionneur === 8) return "En attente";
    return "En attente de validation";
  };

  return (
    <>
      <section className="grid w-full max-w-full gap-3 overflow-hidden md:hidden">
        {demandes.map((demande) => (
          <article
            key={demande.id_demande}
            className="w-full max-w-full overflow-hidden rounded-lg bg-green-200 p-4 text-sm shadow"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold">Demande #{demande.id_demande}</p>
                <p className="break-words">{getDemandeur(demande)}</p>
              </div>
              <span className={`badge shrink-0 ${getPrioriteClass(demande)}`}>
                {getPriorite(demande)}
              </span>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Date :</strong>{" "}
                {new Date(demande.Date_creation).toLocaleDateString("fr-FR")}
              </p>
              <p className="break-words">
                <strong>Description :</strong> {demande.Description}
              </p>
              <p className="break-words">
                <strong>Prise en charge :</strong> {getPriseEnCharge(demande)}
              </p>
              {isManageur && (
                <p>
                  <strong>Réalisé :</strong>{" "}
                  {demande.realise === 1 ? "Oui" : "Non"}
                </p>
              )}
            </div>

            {(isFormateur || isTechnicien || isManageur) && (
              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  className="btn btn-xs btn-outline w-full"
                  onClick={() => ouvrirModalPriorite(demande)}
                >
                  Modifier la priorité
                </button>

                {isManageur &&
                  demande.id_positionneur &&
                  demande.id_positionneur !== 1 &&
                  !demande.id_technicien && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="btn btn-xs btn-success w-full"
                        onClick={() => approuverPositionnement(demande.id_demande)}
                      >
                        Accepter
                      </button>
                      <button
                        className="btn btn-xs btn-error w-full"
                        onClick={() => refuserPositionnement(demande.id_demande)}
                      >
                        Refuser
                      </button>
                    </div>
                  )}

                {isManageur && demande.id_technicien && (
                  <button
                    className="btn btn-xs btn-info w-full"
                    onClick={() => ouvrirMessagerie(demande)}
                  >
                    Messagerie
                  </button>
                )}

                {isManageur && demande.realise !== 1 && (
                  <button
                    className="btn btn-xs btn-success w-full"
                    onClick={() => validerRealisation(demande.id_demande)}
                  >
                    Valider réalisation
                  </button>
                )}

                {isFormateur && demande.id_positionneur === 8 && (
                  <button
                    className="btn btn-xs btn-success w-full"
                    onClick={() => positionnerDemande(demande.id_demande)}
                  >
                    Se positionner
                  </button>
                )}

                {isFormateur && demande.id_technicien === idUser && (
                  <button
                    className="btn btn-xs btn-info w-full"
                    onClick={() => ouvrirMessagerie(demande)}
                  >
                    Messagerie
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </section>

      <div className="hidden w-full overflow-x-auto rounded-lg md:block">
        <table className="table table-zebra min-w-[520px] bg-green-200 md:min-w-full">
          <thead className="bg-zinc-800 text-xs text-white sm:text-sm xl:text-lg">
            <tr>
              <th>Numéro demande</th>
              <th className="hidden lg:table-cell">Description</th>
              <th className="hidden md:table-cell">Date de la demande</th>
              <th>Demandeur</th>
              <th className="hidden xl:table-cell">Priorité</th>
              <th className="hidden xl:table-cell">Prise en charge</th>
              {isManageur && <th className="hidden lg:table-cell">Réalisé</th>}
              <th className="xl:hidden">Détails</th>
            </tr>
          </thead>

          <tbody className="text-xs sm:text-sm xl:text-lg">
            {demandes.map((demande) => (
              <Fragment key={demande.id_demande}>
                <tr key={demande.id_demande}>
                  <td className="whitespace-nowrap">{demande.id_demande}</td>

                  <DescriptionCell
                    description={demande.Description}
                    className="hidden lg:table-cell"
                  />

                  <td className="hidden md:table-cell">
                    {new Date(demande.Date_creation).toLocaleDateString("fr-FR")}
                  </td>

                  <td className="max-w-36 break-words sm:max-w-44 lg:max-w-none">
                    {getDemandeur(demande)}
                  </td>

                  <td className="hidden xl:table-cell">
                    {demande.id_status === 1 && (
                      <span className="badge badge-error">Urgent</span>
                    )}

                    {demande.id_status === 2 && (
                      <span className="badge badge-success">Peut attendre</span>
                    )}

                    {demande.id_status === 3 && (
                      <span className="badge badge-warning">Pressant</span>
                    )}

                    {(isFormateur || isTechnicien || isManageur) && (
                      <button
                        className="btn btn-xs btn-outline ml-2"
                        onClick={() => ouvrirModalPriorite(demande)}
                      >
                        ✏️
                      </button>
                    )}
                  </td>

                  <td className="hidden xl:table-cell">
                    {demande.realise === 1 ? (
                      <span className="badge badge-success">
                        ✅ Réalisé le{" "}
                        {new Date(demande.Date_realise).toLocaleDateString("fr-FR")}
                      </span>
                    ) : isManageur &&
                      demande.id_positionneur &&
                      demande.id_positionneur !== 1 &&
                      !demande.id_technicien ? (
                      <div className="flex items-center gap-2">
                        <span>
                          {demande.Prenom_positionneur} {demande.Nom_positionneur}
                        </span>

                        <button
                          className="btn btn-xs btn-success"
                          onClick={() =>
                            approuverPositionnement(demande.id_demande)
                          }
                        >
                          ✅
                        </button>

                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => refuserPositionnement(demande.id_demande)}
                        >
                          ❌
                        </button>
                      </div>
                    ) : isManageur && demande.id_technicien ? (
                      <div className="flex items-center gap-2">
                        <span>
                          ✅{" "}
                          {demande.id_technicien === 1
                            ? "Technicien"
                            : `${demande.Prenom_positionneur} ${demande.Nom_positionneur}`}
                        </span>

                        <button
                          className="btn btn-xs btn-info"
                          title="Messagerie"
                          onClick={() => ouvrirMessagerie(demande)}
                        >
                          💬
                        </button>
                      </div>
                    ) : isFormateur &&
                      idRole !== 3 &&
                      demande.id_positionneur === 8 ? (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => positionnerDemande(demande.id_demande)}
                      >
                        Se positionner
                      </button>
                    ) : isFormateur &&
                      demande.id_positionneur === idUser &&
                      !demande.id_technicien ? (
                      <span className="badge badge-warning">
                        Positionné, en attente
                      </span>
                    ) : isFormateur && demande.id_technicien === idUser ? (
                      <div className="flex items-center gap-2">
                        <span>✅ Vous êtes confirmé</span>

                        <button
                          className="btn btn-xs btn-info"
                          title="Messagerie"
                          onClick={() => ouvrirMessagerie(demande)}
                        >
                          💬
                        </button>
                      </div>
                    ) : (
                      <span>En attente</span>
                    )}
                  </td>

                  {isManageur && (
                    <td className="hidden lg:table-cell">
                      {demande.realise === 1 ? (
                        <span className="badge badge-success !text-xs whitespace-nowrap">
                          ✅ Réalisé
                        </span>
                      ) : (
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => validerRealisation(demande.id_demande)}
                        >
                          Valider
                        </button>
                      )}
                    </td>
                  )}

                  <td className="xl:hidden">
                    <button
                      className="btn btn-xs btn-info whitespace-nowrap"
                      onClick={() =>
                        setLigneOuverte(
                          ligneOuverte === demande.id_demande
                            ? null
                            : demande.id_demande,
                        )
                      }
                    >
                      {ligneOuverte === demande.id_demande ? "Masquer" : "Détails"}
                    </button>
                  </td>
                </tr>

                {ligneOuverte === demande.id_demande && (
                  <tr className="xl:hidden">
                    <td colSpan={isManageur ? 7 : 6}>
                      <div className="bg-base-200 space-y-3 rounded-lg p-3 text-sm sm:p-4 sm:text-base">
                        <p className="break-words">
                          <strong>Description :</strong> {demande.Description}
                        </p>

                        <p>
                          <strong>Date :</strong>{" "}
                          {new Date(demande.Date_creation).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>

                        <p className="break-words">
                          <strong>Demandeur :</strong>{" "}
                          {getDemandeur(demande)}
                        </p>

                        <p>
                          <strong>Priorité :</strong>{" "}
                          {getPriorite(demande)}
                        </p>

                        <p className="break-words">
                          <strong>Prise en charge :</strong>{" "}
                          {getPriseEnCharge(demande)}
                        </p>

                        {isManageur && (
                          <p>
                            <strong>Réalisé :</strong>{" "}
                            {demande.realise === 1 ? "Oui" : "Non"}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
