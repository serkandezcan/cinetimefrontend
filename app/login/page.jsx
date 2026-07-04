import LoginForm from "@/components/login/LoginForm";
import { Container } from "react-bootstrap";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="cinetime-page">
      <Container style={{ maxWidth: 520 }}>
        <LoginForm />
      </Container>
    </main>
  );
}
