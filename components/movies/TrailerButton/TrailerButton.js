"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { fetchTrailerAction } from "../../../services/tmdb/actions";
import styles from "./trailer-button.module.scss";

function getDirectEmbedUrl(trailerUrl) {
  if (!trailerUrl || !String(trailerUrl).startsWith("http")) return null;

  try {
    const url = new URL(trailerUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    let videoId = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0];
    }

    if (hostname.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/").filter(Boolean)[1];
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/").filter(Boolean)[1];
      } else {
        videoId = url.searchParams.get("v");
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }

    return trailerUrl;
  } catch {
    return null;
  }
}

export default function TrailerButton({ movieTitle, trailerUrl }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [notFound, setNotFound] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    setNotFound(false);

    const directEmbedUrl = getDirectEmbedUrl(trailerUrl);

    if (directEmbedUrl) {
      setEmbedUrl(directEmbedUrl);
      setOpen(true);
      return;
    }

    startTransition(async () => {
      try {
        const trailer = await fetchTrailerAction(movieTitle);

        if (!trailer) {
          setNotFound(true);
          return;
        }

        setEmbedUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
        setOpen(true);
      } catch (error) {
        console.error("Fragman cekilirken hata:", error);
        setNotFound(true);
      }
    });
  }

  function handleClose() {
    setOpen(false);
    setEmbedUrl(null);
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
        embedUrl &&
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
                  src={embedUrl}
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