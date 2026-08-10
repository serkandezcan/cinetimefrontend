import { CalendarDays, Clock3, MapPin, Ticket, XCircle } from "lucide-react";
import styles from "./ticket-card.module.scss";

const STATUS_LABELS = {
  ACTIVE: "Aktif",
  CONFIRMED: "Aktif",
  USED: "Kullanildi",
  CANCELLED: "Iptal edildi",
  UNKNOWN: "Aktif",
};

const STATUS_CLASSES = {
  ACTIVE: styles.statusActive,
  CONFIRMED: styles.statusActive,
  USED: styles.statusUsed,
  CANCELLED: styles.statusCancelled,
  UNKNOWN: styles.statusActive,
};

function formatDate(date) {
  if (!date) {
    return "Tarih yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time) {
  return time ? time.slice(0, 5) : "Saat yok";
}

function formatSeatType(seatType) {
  if (!seatType) return "Bilgi yok";
  return String(seatType).replaceAll("_", " ");
}

function getTicketStatus(ticket) {
  return String(ticket?.status || ticket?.ticketStatus || "ACTIVE").toUpperCase();
}

function canCancelTicket(ticket, status) {
  return Boolean(ticket?.bookingId) && !["CANCELLED", "USED"].includes(status);
}

export default function TicketCard({ ticket, isCanceling = false, onCancel }) {
  if (!ticket) {
    return null;
  }

  const status = getTicketStatus(ticket);
  const seat =
    ticket.rowLetter && ticket.seatNumber !== undefined
      ? `${ticket.rowLetter}${ticket.seatNumber}`
      : "Koltuk yok";
  const isCancelable = canCancelTicket(ticket, status);

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.eyebrow}>Sinema bileti</span>
          <h3>{ticket.movieTitle ?? "Sinema bileti"}</h3>
          <p>Bilet No: {ticket.ticketNumber ?? "Bilgi yok"}</p>
        </div>

        <span className={`${styles.status} ${STATUS_CLASSES[status] ?? styles.statusUnknown}`}>
          {STATUS_LABELS[status] ?? "Aktif"}
        </span>
      </div>

      <dl className={styles.details}>
        <div>
          <dt><MapPin size={15} /> Sinema</dt>
          <dd>{ticket.cinemaName ?? "Bilgi yok"}</dd>
        </div>

        <div>
          <dt>Salon</dt>
          <dd>{ticket.hallName ?? "Bilgi yok"}</dd>
        </div>

        <div>
          <dt><CalendarDays size={15} /> Tarih</dt>
          <dd>{formatDate(ticket.showtimeDate)}</dd>
        </div>

        <div>
          <dt><Clock3 size={15} /> Saat</dt>
          <dd>{formatTime(ticket.startTime)}</dd>
        </div>

        <div>
          <dt><Ticket size={15} /> Koltuk</dt>
          <dd>{seat}</dd>
        </div>

        <div>
          <dt>Koltuk tipi</dt>
          <dd>{formatSeatType(ticket.seatType)}</dd>
        </div>
      </dl>

      {isCancelable && (
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => onCancel?.(ticket)}
          disabled={isCanceling}
        >
          <XCircle size={17} />
          {isCanceling ? "Iptal ediliyor..." : "Bileti iptal et"}
        </button>
      )}
    </article>
  );
}
