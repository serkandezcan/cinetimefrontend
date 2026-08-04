import Hero from "@/components/home/Hero";
import MovieStrip from "@/components/home/MovieStrip";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <Hero />
      <MovieStrip />
    </div>
  );
}
