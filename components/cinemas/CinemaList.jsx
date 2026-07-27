import { Container } from "react-bootstrap";
import CinemaCard from "./CinemaCard";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";
import styles from "./cinema-list.module.scss";

export default function CinemaList({ cinemas = [], error }) {
  if (error) {
    return (
      <Container className="pb-5">
        <div className="cinetime-panel" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  if (!cinemas.length) {
    return (
      <Container className="pb-5">
        <div className="cinetime-panel">{CINEMA_MESSAGES.public.emptyList}</div>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      <div className={styles.grid}>
        {cinemas.map((cinema) => (
          <CinemaCard key={cinema.id} cinema={cinema} />
        ))}
      </div>
    </Container>
  );
}
