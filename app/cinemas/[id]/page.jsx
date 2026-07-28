import Link from "next/link";
import { notFound } from "next/navigation";
import CinemaShowtimeSchedule from "@/components/cinemas/CinemaShowtimeSchedule";
import PageHeader from "@/components/common/page-header/PageHeader";
import { getCinemaById, getCinemaHalls } from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";
import styles from "./cinema-detail.module.scss";

const HALL_TYPE_LABELS = {
  STANDARD: "Standart",
  IMAX: "IMAX",
  VIP: "VIP",
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const cinema = await getCinemaById(id);
    return { title: cinema.name };
  } catch {
    return { title: CINEMA_MESSAGES.public.heading };
  }
}

function buildMapHref({ name, city, district, address, latitude, longitude }) {
  const query = latitude != null && longitude != null
    ? `${latitude},${longitude}`
    : [name, address, district, city].filter(Boolean).join(" ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function getHallTypeLabel(hallType) {
  return HALL_TYPE_LABELS[hallType] ?? hallType ?? "Salon";
}

export default async function Page({ params }) {
  const { id } = await params;

  let cinema = null;
  let halls = [];
  let loadError = null;
  let hallsLoadError = null;

  try {
    cinema = await getCinemaById(id);
  } catch (error) {
    if (error.status === 404) {
      notFound();
    }
    loadError = error.message || CINEMA_MESSAGES.detail.loadError;
  }

  if (cinema) {
    try {
      halls = await getCinemaHalls(id);
    } catch (error) {
      hallsLoadError = error.message || "Salonlar yuklenemedi.";
    }
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
  const mapHref = buildMapHref({ name, city, district, address, latitude, longitude });

  return (
    <>
      <PageHeader title={name} description={CINEMA_MESSAGES.detail.subtitle} />
      <section className={`cinetime-panel ${styles.detail}`}>
        <div className={styles.detailGrid}>
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
        </div>

        <div className={styles.actionRow}>
          <a href={mapHref} className={styles.mapLink} target="_blank" rel="noreferrer">
            Haritada goster
          </a>
          <Link href="/cinemas" className={styles.backLink}>
            {CINEMA_MESSAGES.detail.backLink}
          </Link>
        </div>
      </section>

      <section className={styles.hallsSection} aria-labelledby="cinema-halls-title">
        <div className={styles.sectionHeader}>
          <span className="ct-eyebrow">Hall Inventory</span>
          <h2 id="cinema-halls-title">Salonlar</h2>
          <p>Bu sinemada tanimli salonlar ve koltuk kapasiteleri.</p>
        </div>

        {hallsLoadError ? (
          <div className={styles.hallState} role="alert">
            {hallsLoadError}
          </div>
        ) : halls.length ? (
          <div className={styles.hallGrid}>
            {halls.map((hall) => (
              <article key={hall.id} className={styles.hallCard}>
                <div>
                  <strong>{hall.name}</strong>
                  <span>{getHallTypeLabel(hall.hallType)}</span>
                </div>
                <dl>
                  <div>
                    <dt>Kapasite</dt>
                    <dd>{hall.capacity}</dd>
                  </div>
                  <div>
                    <dt>Koltuk</dt>
                    <dd>{hall.createdSeatCount ?? hall.capacity}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.hallState}>Bu sinemaya henuz salon eklenmemis.</div>
        )}
      </section>

      <CinemaShowtimeSchedule cinemaName={name} />
    </>
  );
}