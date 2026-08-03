"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { fetchTrailerAction } from "../../../services/tmdb/actions";
import styles from "./trailer-button.module.scss";

export default function TrailerButton({ movieTitle }) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [notFound, setNotFound] = useState(false);

    function handleClick(event) {
        // kart tamami Link ise, tiklama karti tetiklemesin
        event.preventDefault();
        event.stopPropagation();
        setNotFound(false);

        startTransition(async () => {
            try {
                const trailer = await fetchTrailerAction(movieTitle);

                if (!trailer) {
                    setNotFound(true);
                    return;
                }

                setTrailerKey(trailer.key);
                setOpen(true);
            } catch (error) {
                console.error("Fragman cekilirken hata:", error);
                setNotFound(true);
            }
        });
    }

    function handleClose() {
        setOpen(false);
        setTrailerKey(null);
    }

    return (
        <>
            <button
                type="button"
                className={styles.trailerButton}
                onClick={handleClick}
                disabled={isPending}
            >
                <Play size={15} fill="currentColor" />
                {isPending ? "Araniyor..." : "Fragmani izle"}
            </button>

            {notFound && <p className={styles.notFound}>Fragman bulunamadi</p>}

            {open &&
                trailerKey &&
                createPortal(
                    <div className={styles.overlay} onClick={handleClose}>
                        <div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={handleClose}
                                aria-label="Kapat"
                            >
                                <X size={20} />
                            </button>
                            <div className={styles.videoWrapper}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                                    title="Fragman"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={styles.iframe}
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}