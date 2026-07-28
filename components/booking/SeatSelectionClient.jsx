"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { getSeatId, isSeatAvailable } from "@/helpers/seat-helpers";
import { getShowtimeUnavailableMessage, translateBookingError } from "@/helpers/showtime-helpers";
import { createBooking } from "@/services/booking-service";
import { getShowtimeSeats, getShowtimes } from "@/services/showtime-service";
import BookingSummary from "./BookingSummary";
import SeatLegend from "./SeatLegend";
import SeatMap from "./SeatMap";
import styles from "./seat-selection.module.scss";

const BOOKING_EXIT_CONFIRM_MESSAGE =
  "Biletleme adimindan cikmak istiyor musun? Secili koltuklar ve bu ekrandaki booking akisi sifirlanacak.";

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

function normalizeSessionRole(role) {
  return String(role ?? "").replace(/^ROLE_/, "").toUpperCase();
}

export default function SeatSelectionClient({ showtimeId }) {
  const router = useRouter();
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
      setSelectedSeatIds((current) =>
        current.filter((id) =>
          normalizedSeats.some((seat) => String(getSeatId(seat)) === String(id) && isSeatAvailable(seat))
        )
      );
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
  const bookingUnavailableMessage = getShowtimeUnavailableMessage(showtime);
  const normalizedRole = normalizeSessionRole(session?.user?.role);
  const isCustomer = normalizedRole === "CUSTOMER";
  const bookingAccessMessage = status === "authenticated" && !isCustomer
    ? "Booking olusturmak icin customer hesabi ile giris yapmalisin. Admin hesabi bu akista sadece koltuklari goruntuleyebilir."
    : "";
  const bookingBlockedMessage = bookingUnavailableMessage || bookingAccessMessage;
  const isBookable = !bookingBlockedMessage;
  const hasBookingProgress = selectedSeatIds.length > 0 || Boolean(booking) || isSubmitting;

  const resetBookingFlow = useCallback(() => {
    setSelectedSeatIds([]);
    setBooking(null);
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const confirmBookingExit = useCallback(() => {
    if (!hasBookingProgress) return true;

    const shouldExit = window.confirm(BOOKING_EXIT_CONFIRM_MESSAGE);
    if (shouldExit) resetBookingFlow();
    return shouldExit;
  }, [hasBookingProgress, resetBookingFlow]);

  useEffect(() => {
    if (!hasBookingProgress) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasBookingProgress]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!hasBookingProgress || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextHref === currentHref) return;

      event.preventDefault();
      if (confirmBookingExit()) router.push(nextHref);
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [confirmBookingExit, hasBookingProgress, router]);

  function handleToggleSeat(seat) {
    if (!isSeatAvailable(seat) || booking || !isBookable) return;

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

    if (!isBookable) {
      setErrorMessage(bookingBlockedMessage);
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
      setErrorMessage(translateBookingError(error.message));
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
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={handleToggleSeat}
              isInteractionDisabled={!isBookable || !!booking}
            />
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
            isBookable={isBookable}
            bookingUnavailableMessage={bookingBlockedMessage}
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