"use client";

import Link from "next/link";
import { Button } from "react-bootstrap";

export default function UserMenu() {
  return (
    <div className="d-flex gap-2">
      <Button as={Link} href="/login" variant="outline-light" size="sm">Login</Button>
      <Button as={Link} href="/register" variant="warning" size="sm">Register</Button>
    </div>
  );
}

