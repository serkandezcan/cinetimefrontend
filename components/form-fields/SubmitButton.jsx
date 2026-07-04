"use client";

import { Button, Spinner } from "react-bootstrap";

export default function SubmitButton({ title, pending }) {
  return (
    <Button type="submit" variant="warning" disabled={pending}>
      {pending && <Spinner size="sm" className="me-2" />}
      {title}
    </Button>
  );
}
