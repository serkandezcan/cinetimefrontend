import { SessionProvider } from "next-auth/react";
import { config } from "@/helpers/config";
import TempLogoutButton from "@/components/temp/TempLogoutButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "@/styles/index.scss";

export const metadata = {
  title: {
    template: `%s | ${config.project.name}`,
    default: `${config.project.name} - ${config.project.slogan}`,
  },
  description: config.project.description,
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TempLogoutButton />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}