import { Mail, Phone, Send } from "lucide-react";
import styles from "../corporate-page.module.scss";

export const metadata = { title: "Destek" };

const SUPPORT_CONTACT = {
  email: "destek@cinetime.com",
  phone: "+90 (212) 555 48 01",
  phoneHref: "tel:+902125554801",
};

export default function Page() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className="ct-eyebrow">Destek</span>
        <h1>Yardima ihtiyacin oldugunda buradayiz.</h1>
        <p>
          Bilet, seans, koltuk secimi veya hesap islemlerinde takildigin noktayi
          bize ilet. En kisa surede geri donelim.
        </p>
      </section>

      <section className={styles.supportPanel}>
        <div className={styles.contactInfo}>
          <span className="ct-eyebrow">Iletisim</span>
          <h2>Bize ulas</h2>
          <p>
            Destek talebini form ile iletebilir ya da dogrudan mail ve telefon
            kanallarindan bize ulasabilirsin.
          </p>

          <div className={styles.contactList}>
            <a href={`mailto:${SUPPORT_CONTACT.email}`}>
              <Mail size={18} />
              {SUPPORT_CONTACT.email}
            </a>
            <a href={SUPPORT_CONTACT.phoneHref}>
              <Phone size={18} />
              {SUPPORT_CONTACT.phone}
            </a>
          </div>
        </div>

        <form
          className={styles.contactForm}
          action={`mailto:${SUPPORT_CONTACT.email}`}
          method="post"
          encType="text/plain"
        >
          <label>
            <span>Ad Soyad</span>
            <input name="name" type="text" placeholder="Adinizi yazin" />
          </label>
          <label>
            <span>E-posta</span>
            <input name="email" type="email" placeholder="ornek@mail.com" />
          </label>
          <label>
            <span>Mesaj</span>
            <textarea name="message" rows="5" placeholder="Sorununu kisaca yaz" />
          </label>
          <button type="submit">
            <Send size={17} />
            Mesaji gonder
          </button>
        </form>
      </section>
    </main>
  );
}