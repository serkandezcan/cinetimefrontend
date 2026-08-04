import styles from "../corporate-page.module.scss";

export const metadata = { title: "Hakkimizda" };

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className="ct-eyebrow">CineTime</span>
        <h1>Sinema deneyimini kolaylastiriyoruz.</h1>
        <p>
          CineTime; film kesfi, seans filtreleme, koltuk secimi ve bilet
          islemlerini tek akista birlestiren modern bir sinema uygulamasidir.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Amacimiz</h2>
          <p>Kullaniciya hizli, anlasilir ve guven veren bir bilet alma deneyimi sunmak.</p>
        </article>
        <article className={styles.card}>
          <h2>Urun</h2>
          <p>Film, sinema, seans, koltuk, booking, odeme ve bilet akisini tek arayuzde toplar.</p>
        </article>
        <article className={styles.card}>
          <h2>Takim</h2>
          <p>Backend ve frontend ekiplerinin domain bazli calisma modeliyle gelistirildi.</p>
        </article>
      </section>
    </main>
  );
}