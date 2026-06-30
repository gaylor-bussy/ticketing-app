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
      <div className="modal-box w-11/12 max-w-md">

        <h3 className="font-bold text-lg mb-4">
          Supprimer un utilisateur
        </h3>

       

        <div className="modal-action flex-col sm:flex-row">
          <button
            className="btn btn-error w-full sm:w-auto"
            onClick={() => setShowModalSupprime(false)}
          >
            Non
          </button>

          <button
            className="btn btn-success w-full sm:w-auto"
            onClick={SupprimeUtilisateur}
          >
            Oui
          </button>
        </div>

      </div>
    </dialog>
  );
}
