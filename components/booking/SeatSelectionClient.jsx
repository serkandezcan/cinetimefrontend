"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { createBooking } from "@/services/booking-service";
import { getShowtimeSeats, getShowtimes } from "@/services/showtime-service";
import BookingSummary from "./BookingSummary";
import SeatLegend from "./SeatLegend";
import SeatMap from "./SeatMap";
import styles from "./seat-selection.module.scss";

function getSeatId(seat) {
  return seat.seatId ?? seat.id;
}

function getShowtimeDate(showtime) {
  if (!showtime) return "Tarih yok";
  if (showtime.date) return showtime.date;
  if (showtime.startTime) return showtime.startTime.slice(0, 10);
  return "Tarih yok";
}

function getShowtimeTime(showtime) {
  if (!showtime) return "--:--";
  if (showtime.startTime?.includes("T")) return showtime.startTime.slice(11, 16);
  if (showtime.startTime) return showtime.startTime.slice(0, 5);
  return "--:--";
}

export default function SeatSelectionClient({ showtimeId }) {
  const { data: session, status } = useSession();
  const [seats, setSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadSeatData({ silent = false } = {}) {
    if (!silent) setIsLoading(true);
    setErrorMessage("");

    try {
      const [seatList, showtimeList] = await Promise.all([
        getShowtimeSeats(showtimeId),
        getShowtimes(),
      ]);

      const normalizedSeats = Array.isArray(seatList) ? seatList : [];
      setSeats(normalizedSeats);
      setShowtime((showtimeList || []).find((item) => String(item.id) === String(showtimeId)) || null);
      setSelectedSeatIds((current) => current.filter((id) => normalizedSeats.some((seat) => String(getSeatId(seat)) === String(id) && seat.available)));
    } catch (error) {
      setErrorMessage(error.message || "Koltuk bilgileri yuklenemedi.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSeatData() {
      try {
        const [seatList, showtimeList] = await Promise.all([
          getShowtimeSeats(showtimeId),
          getShowtimes(),
        ]);

        if (!isMounted) return;
        setSeats(Array.isArray(seatList) ? seatList : []);
        setShowtime((showtimeList || []).find((item) => String(item.id) === String(showtimeId)) || null);
      } catch (error) {
        if (isMounted) setErrorMessage(error.message || "Koltuk bilgileri yuklenemedi.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialSeatData();

    return () => {
      isMounted = false;
    };
  }, [showtimeId]);

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(getSeatId(seat))),
    [seats, selectedSeatIds]
  );

  const seatPrice = Number(showtime?.price || 0);
  const totalPrice = selectedSeats.length * seatPrice;

  function handleToggleSeat(seat) {
    if (!seat.available || booking) return;

    const seatId = getSeatId(seat);
    setSuccessMessage("");
    setErrorMessage("");
    setSelectedSeatIds((current) =>
      current.includes(seatId)
        ? current.filter((id) => id !== seatId)
        : [...current, seatId]
    );
  }

  async function handleCreateBooking() {
    if (!session?.accessToken) {
      setErrorMessage("Booking olusturmak icin customer olarak giris yapmalisin.");
      return;
    }

    if (selectedSeatIds.length === 0) {
      setErrorMessage("En az bir koltuk secmelisin.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const createdBooking = await createBooking(
        {
          showtimeId: Number(showtimeId),
          seatIds: selectedSeatIds.map(Number),
        },
        session.accessToken
      );

      setBooking(createdBooking);
      setSuccessMessage(`Booking #${createdBooking?.id || ""} olusturuldu.`);
      await loadSeatData({ silent: true });
    } catch (error) {
      setErrorMessage(error.message || "Booking olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <Link href="/showtimes" className={styles.backLink}>
        <ArrowLeft size={18} /> Seanslara don
      </Link>

      <div className={styles.header}>
        <span className="ct-eyebrow">Seat Selection</span>
        <h1>Koltuk secimi</h1>
        <p>
          {showtime?.movieTitle || `Seans #${showtimeId}`} / {showtime?.cinemaName || "Sinema"} / {getShowtimeDate(showtime)} {getShowtimeTime(showtime)}
        </p>
      </div>

      {isLoading && <div className={styles.stateBox}>Koltuklar yukleniyor...</div>}

      {!isLoading && errorMessage && !seats.length && (
        <div className={styles.stateBox} role="alert">
          <strong>Koltuklar alinamadi.</strong>
          <span>{errorMessage}</span>
          <button type="button" onClick={() => loadSeatData()}>
            <RefreshCw size={16} /> Tekrar dene
          </button>
        </div>
      )}

      {!isLoading && seats.length > 0 && (
        <div className={styles.layout}>
          <div className={styles.mapPanel}>
            <div className={styles.screen}>Perde</div>
            <SeatMap seats={seats} selectedSeatIds={selectedSeatIds} onToggleSeat={handleToggleSeat} />
            <SeatLegend />
          </div>

          <BookingSummary
            showtime={showtime}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            seatPrice={seatPrice}
            isSubmitting={isSubmitting}
            isAuthenticated={status === "authenticated"}
            booking={booking}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onCreateBooking={handleCreateBooking}
            onRefresh={() => loadSeatData({ silent: true })}
          />
        </div>
      )}

      {booking && (
        <div className={styles.successPanel}>
          <CheckCircle2 size={22} /> Booking olustu. Deniz payment/ticket akisini bu booking uzerinden devam ettirecek.
        </div>
      )}
    </section>
  );
}

