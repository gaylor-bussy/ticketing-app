import { useEffect, useState } from "react";

export default function Modal_Modification_Utilisateur({
  showModalModification,
  setShowModalModification,
  userSelectionnee,
  setUserSelectionnee,
  ModificationUtilisateur,
}) {
  const [formulaire, setFormulaire] = useState({
    Nom: "",
    Prenom: "",
    Num_AFPA: "",
    id_role: "",
  });

  useEffect(() => {
    if (userSelectionnee) {
      setFormulaire({
        Nom: userSelectionnee.Nom,
        Prenom: userSelectionnee.Prenom,
        Num_AFPA: userSelectionnee.Num_AFPA,
        id_role: userSelectionnee.id_role,
      });
    }
  }, [userSelectionnee]);

  if (!showModalModification || !userSelectionnee) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">

        <h3 className="font-bold text-lg mb-4">
          Modifier un utilisateur
        </h3>

        <input
          className="input input-bordered w-full mb-3"
          value={formulaire.Nom}
          onChange={(e) =>
            setFormulaire({
              ...formulaire,
              Nom: e.target.value,
            })
          }
          placeholder="Nom"
        />

        <input
          className="input input-bordered w-full mb-3"
          value={formulaire.Prenom}
          onChange={(e) =>
            setFormulaire({
              ...formulaire,
              Prenom: e.target.value,
            })
          }
          placeholder="Prénom"
        />

        <input
          className="input input-bordered w-full mb-3"
          value={formulaire.Num_AFPA}
          onChange={(e) =>
            setFormulaire({
              ...formulaire,
              Num_AFPA: e.target.value,
            })
          }
          placeholder="Numéro AFPA"
        />

        <select
          className="select select-bordered w-full"
          value={formulaire.id_role}
          onChange={(e) =>
            setFormulaire({
              ...formulaire,
              id_role: e.target.value,
            })
          }
        >
          <option value="1">Manager</option>
          <option value="2">Formateur</option>
          <option value="3">Technicien</option>
          <option value="4">Utilisateur</option>
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
            onClick={() => {
              setUserSelectionnee({
                ...userSelectionnee,
                ...formulaire,
              });

              ModificationUtilisateur();
            }}
          >
            Valider
          </button>
        </div>

      </div>
    </dialog>
  );
}