import Link from "next/link";
import { RefreshCw, Ticket } from "lucide-react";
import { getSeatId, getSeatLabel } from "@/helpers/seat-helpers";
import styles from "./seat-selection.module.scss";

const RESERVATION_STATUS_LABELS = {
  PENDING: "Odeme bekliyor",
  CONFIRMED: "Onaylandi",
  CANCELLED: "Iptal edildi",
};

function getReservationStatusLabel(status) {
  return (
    RESERVATION_STATUS_LABELS[String(status || "PENDING").toUpperCase()] ||
    "Odeme bekliyor"
  );
}

export default function BookingSummary({
  showtime,
  selectedSeats = [],
  totalPrice = 0,
  seatPrice = 0,
  remainingSeconds = null,
  isSubmitting,
  isAuthenticated,
  booking,
  isBookable = true,
  bookingUnavailableMessage = "",
  errorMessage,
  successMessage,
  onCreateBooking,
  onRefresh,
}) {
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <aside className={styles.summaryPanel}>
      <span className='ct-eyebrow'>Rezervasyon ozeti</span>
      <h2>Secim ozeti</h2>

      <div className={styles.summaryFacts}>
        <p>
          <span>Film</span>
          <strong>{showtime?.movieTitle || "Seans bilgisi"}</strong>
        </p>
        <p>
          <span>Birim fiyat</span>
          <strong>{seatPrice ? `${seatPrice} TL` : "Fiyat bekleniyor"}</strong>
        </p>
      </div>

      <div className={styles.selectedList}>
        <strong>Secili koltuklar</strong>
        {selectedSeats.length === 0 ? (
          <p>Henuz koltuk secilmedi.</p>
        ) : (
          <div>
            {selectedSeats.map((seat) => (
              <span key={getSeatId(seat)}>{getSeatLabel(seat)}</span>
            ))}
          </div>
        )}
      </div>

      {remainingSeconds !== null && !booking && (
        <p
          className={
            remainingSeconds <= 30 ? styles.countdownUrgent : styles.countdown
          }
        >
          Koltuk secim sureniz: <strong>{formatTime(remainingSeconds)}</strong>
        </p>
      )}

      <div className={styles.totalRow}>
        <span>Toplam</span>
        <strong>{totalPrice.toFixed(2)} TL</strong>
      </div>

      {!isBookable && bookingUnavailableMessage && (
        <p className={styles.warning} role='status'>
          {bookingUnavailableMessage}
        </p>
      )}
      {errorMessage && (
        <p className={styles.error} role='alert'>
          {errorMessage}
        </p>
      )}
      {successMessage && <p className={styles.success}>{successMessage}</p>}

      {!isAuthenticated && (
        <Link href='/login' className='ct-button ct-button-ghost'>
          Rezervasyon icin giris yap
        </Link>
      )}

      {isAuthenticated && !booking && (
        <button
          type='button'
          className='ct-button ct-button-primary'
          onClick={onCreateBooking}
          disabled={isSubmitting || selectedSeats.length === 0 || !isBookable}
        >
          <Ticket size={17} />{" "}
          {isSubmitting ? "Rezervasyon olusturuluyor..." : "Odemeye gec"}
        </button>
      )}

      {booking && (
        <div className={styles.bookingResult}>
          <strong>Rezervasyon #{booking.id}</strong>
          <span>{getReservationStatusLabel(booking.status)}</span>
        </div>
      )}

      <button
        type='button'
        className={styles.refreshButton}
        onClick={onRefresh}
      >
        <RefreshCw size={15} /> Koltuklari yenile
      </button>
    </aside>
  );
}
