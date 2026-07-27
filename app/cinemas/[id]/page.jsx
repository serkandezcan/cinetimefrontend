import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/page-header/PageHeader";
import { getCinemaById } from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";
import styles from "./cinema-detail.module.scss";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const cinema = await getCinemaById(id);
    return { title: cinema.name };
  } catch {
    return { title: CINEMA_MESSAGES.public.heading };
  }
}

export default async function Page({ params }) {
  const { id } = await params;

  let cinema = null;
  let loadError = null;

  try {
    cinema = await getCinemaById(id);
  } catch (error) {
    if (error.status === 404) {
      notFound();
    }
    loadError = error.message || CINEMA_MESSAGES.detail.loadError;
  }

  if (loadError) {
    return (
      <>
        <PageHeader title={CINEMA_MESSAGES.public.heading} description={CINEMA_MESSAGES.public.subtitle} />
        <div className={`cinetime-panel ${styles.detail}`} role="alert">
          {loadError}
        </div>
      </>
    );
  }

  const { name, city, district, address, phone, latitude, longitude } = cinema;
  const hasCoordinates = latitude != null && longitude != null;

  return (
    <>
      <PageHeader title={name} description={CINEMA_MESSAGES.detail.subtitle} />
      <div className={`cinetime-panel ${styles.detail}`}>
        <p className={styles.row}>
          <span>{CINEMA_MESSAGES.detail.fields.location}</span>
          {district ? `${city} / ${district}` : city}
        </p>
        <p className={styles.row}>
          <span>{CINEMA_MESSAGES.detail.fields.address}</span>
          {address}
        </p>
        {phone && (
          <p className={styles.row}>
            <span>{CINEMA_MESSAGES.detail.fields.phone}</span>
            {phone}
          </p>
        )}
        {hasCoordinates && (
          <p className={styles.row}>
            <span>{CINEMA_MESSAGES.detail.fields.coordinates}</span>
            {`${latitude}, ${longitude}`}
          </p>
        )}
        <Link href="/cinemas" className={styles.backLink}>
          {CINEMA_MESSAGES.detail.backLink}
        </Link>
      </div>
    </>
  );
}
