import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TicketList from "@/components/tickets/TicketList";
import { getCustomerTickets } from "@/services/ticket-service";
import styles from "./tickets.module.scss";

export const metadata = {
  title: "My Tickets",
};

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  let tickets = [];
  let errorMessage = "";

  try {
    tickets = await getCustomerTickets(session.accessToken);
  } catch (error) {
    console.error("[tickets-page] Tickets could not be fetched:", error);
    errorMessage = error.message || "Tickets could not be loaded.";
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className="ct-eyebrow">Ticket Wallet</span>
        <h1>My Tickets</h1>
        <p>View your active, used and cancelled cinema tickets.</p>
      </header>

      {errorMessage ? (
        <div className={styles.error} role="alert">
          {errorMessage}
        </div>
      ) : (
        <TicketList tickets={tickets} />
      )}
    </main>
  );
}
