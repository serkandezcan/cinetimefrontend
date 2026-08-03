import { Container } from "react-bootstrap";
import PageHeader from "@/components/common/page-header/PageHeader";
import CinemaAdminPanel from "@/components/dashboard/cinema/CinemaAdminPanel";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";

export const dynamic = "force-dynamic";

export const metadata = { title: CINEMA_MESSAGES.admin.cinema.pageTitle };

export default function Page() {
  return (
    <>
      <PageHeader
        title={CINEMA_MESSAGES.admin.cinema.heading}
        description="Sinemalari ekle, duzenle ve uygun olanlari sil."
      />
      <Container className="pb-5">
        <CinemaAdminPanel />
      </Container>
    </>
  );
}