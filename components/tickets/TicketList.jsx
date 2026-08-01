"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cancelBooking } from "@/services/booking-service";
import TicketCard from "./TicketCard";
import styles from "./ticket-list.module.scss";

const CANCEL_CONFIRM_MESSAGE =
  "Bu bileti iptal etmek istiyor musun? Ayni booking icindeki diger biletler de iptal edilebilir.";

export default function TicketList({ tickets = [] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [cancelingBookingId, setCancelingBookingId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCancel(ticket) {
    if (!ticket?.bookingId) {
      setErrorMessage("Bu bilet icin booking bilgisi bulunamadi.");
      return;
    }

    if (!session?.accessToken) {
      setErrorMessage("Bilet iptali icin yeniden giris yapmalisin.");
      return;
    }

    const shouldCancel = window.confirm(CANCEL_CONFIRM_MESSAGE);
    if (!shouldCancel) return;

    setCancelingBookingId(ticket.bookingId);
    setMessage("");
    setErrorMessage("");

    try {
      await cancelBooking(ticket.bookingId, session.accessToken);
      setMessage(`Booking #${ticket.bookingId} iptal edildi.`);
      startTransition(() => router.refresh());
    } catch (error) {
      setErrorMessage(error.message || "Bilet iptal edilemedi.");
    } finally {
      setCancelingBookingId(null);
    }
  }

  if (!Array.isArray(tickets) || tickets.length === 0) {
    return <p className={styles.emptyState}>No tickets found.</p>;
  }

  return (
    <section className={styles.section} aria-label="Ticket list">
      {message && <p className={styles.success}>{message}</p>}
      {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}

      <div className={styles.grid}>
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id ?? ticket.ticketNumber}
            ticket={ticket}
            isCanceling={cancelingBookingId === ticket.bookingId || isPending}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </section>
  );
}
