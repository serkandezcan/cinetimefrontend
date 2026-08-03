import { Container } from "react-bootstrap";
import PageHeader from "@/components/common/page-header/PageHeader";
import CinemaAdminPanel from "@/components/dashboard/cinema/CinemaAdminPanel";
import CinemaList from "@/components/cinemas/CinemaList";
import { getCinemas } from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";

export const dynamic = "force-dynamic";

export const metadata = { title: CINEMA_MESSAGES.admin.cinema.pageTitle };

export default async function Page() {
  let cinemas = [];
  let loadError = null;

  try {
    cinemas = await getCinemas();
  } catch (error) {
    loadError = error.message || CINEMA_MESSAGES.public.loadError;
  }

  return (
    <>
      <PageHeader
        title={CINEMA_MESSAGES.admin.cinema.heading}
        description={CINEMA_MESSAGES.admin.cinema.subtitle}
      />
      <Container className="pb-3">
        <CinemaAdminPanel />
      </Container>
      <CinemaList cinemas={cinemas} error={loadError} />
    </>
  );
}
