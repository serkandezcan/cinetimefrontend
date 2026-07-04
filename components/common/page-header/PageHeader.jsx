import { Container } from "react-bootstrap";

export default function PageHeader({ title, description }) {
  return (
    <section className="cinetime-page pb-3">
      <Container>
        <h1 className="fw-bold">{title}</h1>
        {description && <p className="text-white-50">{description}</p>}
      </Container>
    </section>
  );
}
