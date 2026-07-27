import { Container } from "react-bootstrap";
import PageHeader from "@/components/common/page-header/PageHeader";
import HallAdminPanel from "@/components/dashboard/hall/HallAdminPanel";
import { getCinemas } from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";

export const metadata = { title: CINEMA_MESSAGES.admin.hall.pageTitle };

export default async function Page() {
  let cinemas = [];
  let loadError = null;

  try {
    cinemas = await getCinemas();
  } catch (error) {
    loadError = error.message || CINEMA_MESSAGES.admin.hall.cinemaListError;
  }

  return (
    <>
      <PageHeader
        title={CINEMA_MESSAGES.admin.hall.heading}
        description={CINEMA_MESSAGES.admin.hall.subtitle}
      />
      <Container className="pb-5">
        <HallAdminPanel cinemas={cinemas} loadError={loadError} />
      </Container>
    </>
  );
}
