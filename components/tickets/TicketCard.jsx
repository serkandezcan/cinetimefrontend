const STATUS_LABELS = {
  ACTIVE: "Active",
  USED: "Used",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES = {
  ACTIVE: "text-bg-success",
  USED: "text-bg-secondary",
  CANCELLED: "text-bg-danger",
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

export default function TicketCard({ ticket }) {
  if (!ticket) {
    return null;
  }

  const status = ticket.status ?? "UNKNOWN";

  const seat =
    ticket.rowLetter && ticket.seatNumber !== undefined
      ? `${ticket.rowLetter}${ticket.seatNumber}`
      : "Unavailable";

  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="h5 card-title mb-1">
              {ticket.movieTitle ?? "Cinema Ticket"}
            </h3>

            <p className="text-muted mb-0">
              Ticket No: {ticket.ticketNumber ?? "Unavailable"}
            </p>
          </div>

          <span
            className={`badge ${STATUS_CLASSES[status] ?? "text-bg-light"}`}
          >
            {STATUS_LABELS[status] ?? "Unknown"}
          </span>
        </div>

        <dl className="mb-0">
          <div className="d-flex justify-content-between gap-3">
            <dt>Cinema</dt>
            <dd className="text-end">{ticket.cinemaName ?? "Unavailable"}</dd>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <dt>Hall</dt>
            <dd className="text-end">{ticket.hallName ?? "Unavailable"}</dd>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <dt>Date</dt>
            <dd className="text-end">{formatDate(ticket.showtimeDate)}</dd>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <dt>Time</dt>
            <dd className="text-end">{formatTime(ticket.startTime)}</dd>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <dt>Seat</dt>
            <dd className="text-end">{seat}</dd>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <dt>Seat Type</dt>
            <dd className="text-end">
              {ticket.seatType?.replaceAll("_", " ") ?? "Unavailable"}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

/*const STATUS_CLASSES = {
  ACTIVE: "text-bg-success",
  USED: "text-bg-secondary",
  CANCELLED: "text-bg-danger",
};

export default function TicketCard({ ticket }) {
  if (!ticket) {
    return null;
  }

  const status = ticket.status ?? "UNKNOWN";
  const statusClass = STATUS_CLASSES[status] ?? "text-bg-light";

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h5 className="card-title mb-1">Cinema Ticket</h5>

            <p className="text-muted mb-0">
              Ticket No: {ticket.ticketNumber ?? "Unavailable"}
            </p>
          </div>

          <span className={`badge ${statusClass}`}>{status}</span>
        </div>
      </div>
    </div>
  );
}
const STATUS_LABELS = {
  ACTIVE: "Active",
  USED: "Used",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES = {
  ACTIVE: "text-bg-success",
  USED: "text-bg-secondary",
  CANCELLED: "text-bg-danger",
};

export default function TicketCard({ ticket }) {
  if (!ticket) {
    return null;
  }

  const status = ticket.status ?? "UNKNOWN";
  const statusLabel = STATUS_LABELS[status] ?? "Unknown";
  const statusClass = STATUS_CLASSES[status] ?? "text-bg-light";

  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h3 className="h5 card-title mb-1">Cinema Ticket</h3>

            <p className="text-muted mb-0">
              Ticket No: {ticket.ticketNumber ?? "Unavailable"}
            </p>
          </div>

          <span className={`badge ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>
    </article>
  );
}
*/
