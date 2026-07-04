import Footer from "@/components/common/footer/Footer";
import MainMenu from "@/components/common/header/MainMenu";
import { config } from "@/helpers/config";
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
        <MainMenu />
        {children}
        <Footer />
      </body>
    </html>
  );
}
