"use client";

import { FloatingLabel, Form, InputGroup } from "react-bootstrap";

export default function TextInput({ className = "", errorMessage, iconBefore, name, label, ...rest }) {
  return (
    <InputGroup className={`${className} ${errorMessage ? "mb-5" : ""}`}>
      {iconBefore && <InputGroup.Text><i className={`pi pi-${iconBefore}`} /></InputGroup.Text>}
      <FloatingLabel controlId={name} label={label}>
        <Form.Control name={name} placeholder={label} isInvalid={!!errorMessage} {...rest} />
        <Form.Control.Feedback type="invalid" style={{ position: "absolute" }}>{errorMessage}</Form.Control.Feedback>
      </FloatingLabel>
    </InputGroup>
  );
}
