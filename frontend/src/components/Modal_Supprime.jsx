import { useEffect, useState } from "react";

export default function Modal_Supprime({
 showModalSupprime,
 setShowModalSupprime,
  userSelectionnee,
  setUserSelectionnee,
  SupprimeUtilisateur,
}) {
  if (!showModalSupprime || !userSelectionnee) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">

        <h3 className="font-bold text-lg mb-4">
          Supprimer un utilisateur
        </h3>

       

        <div className="modal-action">
          <button
            className="btn btn-error"
            onClick={() => setShowModalSupprime(false)}
          >
            Non
          </button>

          <button
            className="btn btn-success"
            onClick={SupprimeUtilisateur}
          >
            Oui
          </button>
        </div>

      </div>
    </dialog>
  );
}