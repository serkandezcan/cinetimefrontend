import styles from "../corporate-page.module.scss";

export const metadata = { title: "Gizlilik" };

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className="ct-eyebrow">Gizlilik</span>
        <h1>Veri gizliligi sade ve seffaf olmali.</h1>
        <p>
          Bu demo uygulamada kullanici hesabi, booking ve bilet bilgileri yalnizca
          CineTime deneyimini calistirmak icin kullanilir.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Hesap bilgileri</h2>
          <p>Ad, e-posta ve oturum bilgileri kimlik dogrulama akisi icin saklanir.</p>
        </article>
        <article className={styles.card}>
          <h2>Bilet bilgileri</h2>
          <p>Booking, koltuk ve ticket bilgileri kullanicinin biletlerini gostermek icin kullanilir.</p>
        </article>
        <article className={styles.card}>
          <h2>Guvenlik</h2>
          <p>Yetkili sayfalar token tabanli oturum kontrolu ile korunur.</p>
        </article>
      </section>
    </main>
  );
}