"use client";

import { loginAction } from "@/actions/auth-action";
import TextInput from "@/components/form-fields/TextInput";
import SubmitButton from "@/components/form-fields/SubmitButton";
import { useActionState } from "react";
import { Alert, Card } from "react-bootstrap";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <Card className="cinetime-panel">
      <Card.Body>
        <h2 className="mb-4">Login</h2>
        <form action={formAction}>
          <TextInput name="email" label="Email" iconBefore="envelope" className="mb-3" errorMessage={state?.errors?.email} />
          <TextInput name="password" label="Password" iconBefore="key" type="password" className="mb-3" errorMessage={state?.errors?.password} />
          {!state?.ok && state?.message && <Alert variant="danger">{state.message}</Alert>}
          <SubmitButton title="Login" pending={isPending} />
        </form>
      </Card.Body>
    </Card>
  );
}
