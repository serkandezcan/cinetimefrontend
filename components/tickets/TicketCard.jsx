import { CalendarDays, Clock3, MapPin, Ticket, XCircle } from "lucide-react";
import styles from "./ticket-card.module.scss";

const STATUS_LABELS = {
  ACTIVE: "Active",
  CONFIRMED: "Active",
  USED: "Used",
  CANCELLED: "Cancelled",
  UNKNOWN: "Active",
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
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time) {
  return time ? time.slice(0, 5) : "Unavailable";
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
      : "Unavailable";
  const isCancelable = canCancelTicket(ticket, status);

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.eyebrow}>Cinema Ticket</span>
          <h3>{ticket.movieTitle ?? "Cinema Ticket"}</h3>
          <p>Ticket No: {ticket.ticketNumber ?? "Unavailable"}</p>
        </div>

        <span className={`${styles.status} ${STATUS_CLASSES[status] ?? styles.statusUnknown}`}>
          {STATUS_LABELS[status] ?? "Unknown"}
        </span>
      </div>

      <dl className={styles.details}>
        <div>
          <dt><MapPin size={15} /> Cinema</dt>
          <dd>{ticket.cinemaName ?? "Unavailable"}</dd>
        </div>

        <div>
          <dt>Hall</dt>
          <dd>{ticket.hallName ?? "Unavailable"}</dd>
        </div>

        <div>
          <dt><CalendarDays size={15} /> Date</dt>
          <dd>{formatDate(ticket.showtimeDate)}</dd>
        </div>

        <div>
          <dt><Clock3 size={15} /> Time</dt>
          <dd>{formatTime(ticket.startTime)}</dd>
        </div>

        <div>
          <dt><Ticket size={15} /> Seat</dt>
          <dd>{seat}</dd>
        </div>

        <div>
          <dt>Seat Type</dt>
          <dd>{ticket.seatType?.replaceAll("_", " ") ?? "Unavailable"}</dd>
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
          {isCanceling ? "Cancelling..." : "Cancel ticket"}
        </button>
      )}
    </article>
  );
}
