import { auth } from "@/auth";
import { redirect } from "next/navigation";

import TicketList from "@/components/tickets/TicketList";
import { getCustomerTickets } from "@/services/ticket-service";

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
    <main className="container py-5">
      <div className="mb-4">
        <h1 className="h2 mb-2">My Tickets</h1>
        <p className="text-muted mb-0">
          View your active, used and cancelled cinema tickets.
        </p>
      </div>

      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : (
        <TicketList tickets={tickets} />
      )}
    </main>
  );
}

/*import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { getCustomerTickets } from "@/services/ticket-service";
import TicketList from "@/components/tickets/TicketList";

export default async function TicketsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const result = await getCustomerTickets();

  if (!result.success) {
    return (
      <div className="container mt-5">
        <h2>My Tickets</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Tickets</h2>

      {result.data?.length ? (
        <TicketList tickets={result.data} />
      ) : (
        <p>No tickets found</p>
      )}
    </div>
  );
}

/*import PageHeader from "@/components/common/page-header/PageHeader";

export const metadata = { title: "My Tickets" };

export default function Page() {
  return <PageHeader title="My Tickets" description="This page will be implemented step by step." />;
} */
