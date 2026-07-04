"use client";

import Link from "next/link";
import { Button, Container } from "react-bootstrap";

export default function Hero() {
  return (
    <section className="cinetime-page">
      <Container>
        <div className="cinetime-panel">
          <p className="text-uppercase text-warning mb-2">CineTime</p>
          <h1 className="display-4 fw-bold">Choose the movie. Pick the seat. Keep the ticket.</h1>
          <p className="lead text-white-50">A cinema ticket booking experience built on our Spring Boot backend MVP.</p>
          <div className="d-flex gap-3 flex-wrap mt-4">
            <Button as={Link} href="/movies" variant="warning">Browse Movies</Button>
            <Button as={Link} href="/showtimes" variant="outline-light">Find Showtimes</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

