import Link from "next/link";
import { RefreshCw, Ticket } from "lucide-react";
import { getSeatId, getSeatLabel } from "@/helpers/seat-helpers";
import styles from "./seat-selection.module.scss";

export default function BookingSummary({
  showtime,
  selectedSeats = [],
  totalPrice = 0,
  seatPrice = 0,
  isSubmitting,
  isAuthenticated,
  booking,
  errorMessage,
  successMessage,
  onCreateBooking,
  onRefresh,
}) {
  return (
    <aside className={styles.summaryPanel}>
      <span className="ct-eyebrow">Booking Summary</span>
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

      <div className={styles.totalRow}>
        <span>Toplam</span>
        <strong>{totalPrice.toFixed(2)} TL</strong>
      </div>

      {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}

      {!isAuthenticated && (
        <Link href="/login" className="ct-button ct-button-ghost">
          Booking icin giris yap
        </Link>
      )}

      {isAuthenticated && !booking && (
        <button
          type="button"
          className="ct-button ct-button-primary"
          onClick={onCreateBooking}
          disabled={isSubmitting || selectedSeats.length === 0}
        >
          <Ticket size={17} /> {isSubmitting ? "Booking olusturuluyor..." : "Booking olustur"}
        </button>
      )}

      {booking && (
        <div className={styles.bookingResult}>
          <strong>Booking #{booking.id}</strong>
          <span>{booking.status || "PENDING"}</span>
        </div>
      )}

      <button type="button" className={styles.refreshButton} onClick={onRefresh}>
        <RefreshCw size={15} /> Koltuklari yenile
      </button>
    </aside>
  );
}
