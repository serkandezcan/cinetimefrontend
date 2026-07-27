import PageHeader from "@/components/common/page-header/PageHeader";
import CinemaList from "@/components/cinemas/CinemaList";
import { getCinemas } from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";

export const metadata = { title: CINEMA_MESSAGES.public.pageTitle };

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
      <PageHeader title={CINEMA_MESSAGES.public.heading} description={CINEMA_MESSAGES.public.subtitle} />
      <CinemaList cinemas={cinemas} error={loadError} />
    </>
  );
}
