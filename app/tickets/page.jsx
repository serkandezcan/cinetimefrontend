import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TicketList from "@/components/tickets/TicketList";
import { getCustomerTickets } from "@/services/ticket-service";
import styles from "./tickets.module.scss";

export const metadata = {
  title: "Biletlerim",
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
    console.error("[tickets-page] Biletler alinamadi:", error);
    errorMessage = error.message || "Biletler yuklenemedi.";
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className="ct-eyebrow">Bilet cuzdanim</span>
        <h1>Biletlerim</h1>
        <p>Aktif, kullanilmis ve iptal edilmis sinema biletlerini goruntule.</p>
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
