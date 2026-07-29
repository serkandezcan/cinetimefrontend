import Link from "next/link";
import { CheckCircle2, Ticket } from "lucide-react";
import styles from "./payment.module.scss";

function formatAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Tutar bilgisi yok";
  }

  return new Intl.NumberFormat("en-TR", {
    style: "currency",
    currency: "TRY",
  }).format(numericAmount);
}

function formatDate(date) {
  if (!date) {
    return "Tarih bilgisi yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function PaymentResult({ payment, bookingId }) {
  if (!payment) {
    return null;
  }

  return (
    <section className={styles.resultCard}>
      <CheckCircle2 className={styles.successIcon} size={44} />

      <div className={styles.resultHeading}>
        <span className="ct-eyebrow">Payment Result</span>
        <h2>Odeme basarili</h2>
        <p>Booking #{bookingId} icin odeme tamamlandi.</p>
      </div>

      <dl className={styles.resultDetails}>
        <div>
          <dt>Durum</dt>
          <dd>{payment.status || "COMPLETED"}</dd>
        </div>

        <div>
          <dt>Tutar</dt>
          <dd>{formatAmount(payment.amount)}</dd>
        </div>

        <div>
          <dt>Odeme yontemi</dt>
          <dd>
            {payment.paymentMethod?.replaceAll("_", " ") || "Bilgi bulunamadi"}
          </dd>
        </div>

        <div>
          <dt>Islem numarasi</dt>
          <dd>{payment.transactionId || "Bilgi bulunamadi"}</dd>
        </div>

        <div>
          <dt>Islem tarihi</dt>
          <dd>{formatDate(payment.createdAt)}</dd>
        </div>
      </dl>

      <Link href="/tickets" className="ct-button ct-button-primary">
        <Ticket size={18} />
        Biletlerimi goruntule
      </Link>
    </section>
  );
}
