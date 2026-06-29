import { useEffect, useState } from "react";

export default function Modal_Messagerie({ open, setOpen, demande }) {
    const [messages, setMessages] = useState([]);
    const [nouveauMessage, setNouveauMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const nomComplet = `${user?.prenom} ${user?.nom}`;

    useEffect(() => {
        if (!open || !demande) return;

        chargerMessages();
    }, [open, demande?.id_demande]);

    const chargerMessages = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/messagerie/${demande.id_demande}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        console.log("Messages chargés :", data);

        setMessages(Array.isArray(data) ? data : []);
    };

    const envoyerMessage = async () => {
        if (!nouveauMessage.trim()) return;

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/dashboard/complet/messagerie/${demande.id_demande}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Message: `${nomComplet} : ${nouveauMessage}`,
                }),
            }
        );

        const data = await response.json();

        setMessages(Array.isArray(data) ? data : []);
        setNouveauMessage("");
    };

    if (!open || !demande) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-xl mb-4">
                    Messagerie demande #{demande.id_demande}
                </h3>

                <div className="border rounded-lg p-3 h-96 overflow-y-auto bg-base-200">
                    {messages.length === 0 ? (
                        <p>Aucun message.</p>
                    ) : (
                        messages.map((msg) => {
                            const isMoi = msg.Message?.startsWith(nomComplet);

                            return (
                                <div
                                    key={msg.id_message}
                                    className={`chat ${isMoi ? "chat-end" : "chat-start"}`}
                                >
                                    <div
                                        className={`chat-bubble ${
                                            isMoi
                                                ? "chat-bubble-primary"
                                                : "chat-bubble-success"
                                        }`}
                                    >
                                        {msg.Message}
                                    </div>

                                    <div className="chat-footer opacity-60 text-xs">
                                        {new Date(msg.Date_heure).toLocaleString("fr-FR")}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <textarea
                    className="textarea textarea-bordered w-full mt-4"
                    rows="3"
                    placeholder="Votre message..."
                    value={nouveauMessage}
                    onChange={(e) => setNouveauMessage(e.target.value)}
                />

                <div className="modal-action">
                    <button
                        className="btn btn-error"
                        onClick={() => setOpen(false)}
                    >
                        Fermer
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={envoyerMessage}
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </dialog>
    );
}