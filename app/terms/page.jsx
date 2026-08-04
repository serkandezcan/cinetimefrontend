import styles from "../corporate-page.module.scss";

export const metadata = { title: "Kullanim Kosullari" };

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className="ct-eyebrow">Kullanim</span>
        <h1>Bilet akisini dogru bilgilerle tamamla.</h1>
        <p>
          CineTime demo surumu; film, sinema, seans ve koltuk secimi uzerinden
          rezervasyon ve mock odeme akisini gostermek icin hazirlanmistir.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Rezervasyon</h2>
          <p>Secilen koltuklar booking olusturulduktan sonra ayni seans icin tekrar satilamaz.</p>
        </article>
        <article className={styles.card}>
          <h2>Odeme</h2>
          <p>Ilk surumde gercek odeme entegrasyonu yoktur; mock payment akisi kullanilir.</p>
        </article>
        <article className={styles.card}>
          <h2>Iptal</h2>
          <p>Bilet iptal ve iade kurallari sonraki gelistirme fazinda detaylandirilacaktir.</p>
        </article>
      </section>
    </main>
  );
}