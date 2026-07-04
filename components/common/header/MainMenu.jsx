"use client";

import Link from "next/link";
import { Container, Navbar, Nav } from "react-bootstrap";
import UserMenu from "./UserMenu";

export default function MainMenu() {
  return (
    <Navbar expand="lg" variant="dark" className="py-3">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold text-warning">CineTime</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-menu" />
        <Navbar.Collapse id="main-menu">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/movies">Movies</Nav.Link>
            <Nav.Link as={Link} href="/cinemas">Cinemas</Nav.Link>
            <Nav.Link as={Link} href="/showtimes">Showtimes</Nav.Link>
          </Nav>
          <UserMenu />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

