import { Container } from "react-bootstrap";

export default function MovieStrip() {
  return (
    <section className="pb-5">
      <Container>
        <h2 className="mb-3">Now planning</h2>
        <div className="cinetime-panel">
          Movie list will connect to `GET /api/movies` in the next step.
        </div>
      </Container>
    </section>
  );
}
