import { useEffect, useState } from "react";

export default function Modal_Modification_Utilisateur({
  showModalModification,
  setShowModalModification,
  userSelectionnee,
  setUserSelectionnee,
  ModificationUtilisateur,
}) {
  if (!showModalModification || !userSelectionnee) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">

        <h3 className="font-bold text-lg mb-4">
          Modifier un utilisateur
        </h3>

        <input
          className="input input-bordered w-full mb-3"
          value={userSelectionnee.Nom}
          onChange={(e) =>
            setUserSelectionnee({
              ...userSelectionnee,
              Nom: e.target.value,
            })
          }
          placeholder="Nom"
        />

        <input
          className="input input-bordered w-full mb-3"
          value={userSelectionnee.Prenom}
          onChange={(e) =>
            setUserSelectionnee({
              ...userSelectionnee,
              Prenom: e.target.value,
            })
          }
          placeholder="Prénom"
        />

        <input
          className="input input-bordered w-full mb-3"
          value={userSelectionnee.Num_AFPA}
          onChange={(e) =>
            setUserSelectionnee({
              ...userSelectionnee,
              Num_AFPA: e.target.value,
            })
          }
          placeholder="Numéro AFPA"
        />

        <select
          className="select select-bordered w-full"
          value={userSelectionnee.id_role}
          onChange={(e) =>
            setUserSelectionnee({
              ...userSelectionnee,
              id_role: e.target.value,
            })
          }
        >
          <option value={1}>Manager</option>
          <option value={2}>Formateur</option>
          <option value={3}>Technicien</option>
          <option value={4}>Utilisateur</option>
        </select>

        <div className="modal-action">
          <button
            className="btn btn-error"
            onClick={() => setShowModalModification(false)}
          >
            Annuler
          </button>

          <button
            className="btn btn-success"
            onClick={ModificationUtilisateur}
          >
            Valider
          </button>
        </div>

      </div>
    </dialog>
  );
}