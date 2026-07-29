/*import TicketCard from "./TicketCard";

export default function TicketList({ tickets = [] }) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return <p>No tickets found.</p>;
  }

  return (
    <div className="row g-4">
      {tickets.map((ticket) => (
        <div
          className="col-12 col-md-6 col-lg-4"
          key={ticket.id ?? ticket.ticketNumber}
        >
          <TicketCard ticket={ticket} />
        </div>
      ))}
    </div>
  );
}
import TicketCard from "./TicketCard";

export default function TicketList({ tickets = [] }) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return <p>No tickets found.</p>;
  }

  return (
    <div className="row g-4">
      {tickets.map((ticket, index) => (
        <div
          className="col-12 col-md-6 col-lg-4"
          key={ticket.id ?? ticket.ticketNumber ?? index}
        >
          <TicketCard ticket={ticket} />
        </div>
      ))}
    </div>
  );
}
*/
import TicketCard from "./TicketCard";

export default function TicketList({ tickets = [] }) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return <p className="text-muted">No tickets found.</p>;
  }

  return (
    <div className="row g-4">
      {tickets.map((ticket) => (
        <div
          className="col-12 col-md-6 col-lg-4"
          key={ticket.id ?? ticket.ticketNumber}
        >
          <TicketCard ticket={ticket} />
        </div>
      ))}
    </div>
  );
}