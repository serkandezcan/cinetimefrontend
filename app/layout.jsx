import { SessionProvider } from "next-auth/react";
import { config } from "@/helpers/config";
import MainMenu from "@/components/common/header/MainMenu";
import Footer from "@/components/common/footer/Footer";
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
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SessionProvider>
          <a className="ct-skip-link" href="#main-content">
            Skip to content
          </a>
          <MainMenu />
          <main id="main-content" className="ct-main-shell">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

