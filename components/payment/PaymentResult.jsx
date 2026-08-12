import Link from "next/link";
import { CheckCircle2, Ticket } from "lucide-react";
import styles from "./payment.module.scss";

const PAYMENT_STATUS_LABELS = {
  COMPLETED: "Tamamlandi",
  PENDING: "Bekliyor",
  FAILED: "Basarisiz",
};

const PAYMENT_METHOD_LABELS = {
  CREDIT_CARD: "Kredi karti",
  DEBIT_CARD: "Banka karti",
};

function formatAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Tutar bilgisi yok";
  }

  return new Intl.NumberFormat("tr-TR", {
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

function translatePaymentStatus(status) {
  return PAYMENT_STATUS_LABELS[String(status || "COMPLETED").toUpperCase()] || "Tamamlandi";
}

function translatePaymentMethod(method) {
  return PAYMENT_METHOD_LABELS[String(method || "").toUpperCase()] || "Bilgi bulunamadi";
}

export default function PaymentResult({ payment, bookingId }) {
  if (!payment) {
    return null;
  }

  return (
    <section className={styles.resultCard}>
      <CheckCircle2 className={styles.successIcon} size={44} />

      <div className={styles.resultHeading}>
        <span className="ct-eyebrow">Odeme sonucu</span>
        <h2>Odeme basarili</h2>
        <p>Rezervasyon #{bookingId} icin odeme tamamlandi.</p>
      </div>

      <p className={styles.notice}>
        Bilet bilgileriniz hesabinizda hazir. Bildirim servisi aktif oldugunda
        kayitli e-posta ve telefonunuza otomatik gonderilecek.
      </p>

      <dl className={styles.resultDetails}>
        <div>
          <dt>Durum</dt>
          <dd>{translatePaymentStatus(payment.status)}</dd>
        </div>

        <div>
          <dt>Tutar</dt>
          <dd>{formatAmount(payment.amount)}</dd>
        </div>

        <div>
          <dt>Odeme yontemi</dt>
          <dd>{translatePaymentMethod(payment.paymentMethod)}</dd>
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
