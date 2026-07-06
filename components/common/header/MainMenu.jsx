"use client";

import Link from "next/link";
import { Container, Navbar, Nav } from "react-bootstrap";
import { HEADER_NAV_LINKS } from "@/helpers/header-links";
import { HEADER_MESSAGES } from "@/helpers/messages/header-messages";
import UserMenu from "./UserMenu";
import styles from "./header.module.scss";

export default function MainMenu({ session }) {
  return (
    <Navbar expand="lg" variant="dark" className={styles.navbar}>
      <Container>
        <Navbar.Brand as={Link} href="/" className={styles.brand}>
          {HEADER_MESSAGES.brand.prefix}
          <span className={styles.brandAccent}>{HEADER_MESSAGES.brand.suffix}</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-menu" />
        <Navbar.Collapse id="main-menu">
          <Nav className="me-auto">
            {HEADER_NAV_LINKS.map((link) => (
              <Nav.Link
                key={link.href}
                as={Link}
                href={link.href}
                className={styles.navLink}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          <UserMenu session={session} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}