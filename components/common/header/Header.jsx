import { getCurrentSession } from "@/helpers/auth-helpers";
import MainMenu from "./MainMenu";

export default async function Header() {
  const session = await getCurrentSession();

  return <MainMenu session={session} />;
}