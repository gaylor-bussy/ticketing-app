export default function Modal_Add_Demande({
    showModal,
    setShowModal,
    description,
    setDescription,
    priorite,
    setPriorite,
    ajouterDemande,
}) {
    if (!showModal) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-lg">
                <h3 className="font-bold text-lg mb-4">
                    Nouvelle demande
                </h3>

                <textarea
                    className="textarea textarea-bordered w-full mb-4"
                    placeholder="Description de la demande"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select
                    className="select select-bordered w-full mb-4"
                    value={priorite}
                    onChange={(e) => setPriorite(e.target.value)}
                >
                    <option value="1">Urgent</option>
                    <option value="2">Peut attendre</option>
                    <option value="3">Pressant</option>
                </select>

                <div className="modal-action flex-col sm:flex-row">
                    <button
                        className="btn btn-error w-full sm:w-auto"
                        onClick={() => setShowModal(false)}
                    >
                        Annuler
                    </button>

                    <button
                        className="btn btn-success w-full sm:w-auto"
                        onClick={ajouterDemande}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </dialog>
    );
}
