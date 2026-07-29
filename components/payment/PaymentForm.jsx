"use client";

import { useState } from "react";
import { CreditCard, LoaderCircle } from "lucide-react";
import styles from "./payment.module.scss";

export default function PaymentForm({
  isSubmitting = false,
  errorMessage = "",
  onSubmit,
}) {
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleCardNumberChange(event) {
    const normalizedCardNumber = event.target.value
      .replace(/\D/g, "")
      .slice(0, 16);

    setCardNumber(normalizedCardNumber);
    setValidationError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (cardNumber.length !== 16) {
      setValidationError("Kart numarasi 16 rakamdan olusmalidir.");
      return;
    }

    if (cardHolderName.trim().length < 2) {
      setValidationError("Kart sahibinin adini giriniz.");
      return;
    }

    onSubmit({
      paymentMethod,
      cardNumber,
      cardHolderName: cardHolderName.trim().toUpperCase(),
    });
  }

  const displayedError = validationError || errorMessage;

  return (
    <section className={styles.paymentCard}>
      <div className={styles.heading}>
        <CreditCard size={24} />

        <div>
          <span className="ct-eyebrow">Payment</span>
          <h2>Odeme bilgileri</h2>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span>Odeme yontemi</span>

          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            disabled={isSubmitting}
          >
            <option value="CREDIT_CARD">Kredi karti</option>
            <option value="DEBIT_CARD">Banka karti</option>
          </select>
        </label>

        <label>
          <span>Kart numarasi</span>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234567812345678"
            value={cardNumber}
            onChange={handleCardNumberChange}
            disabled={isSubmitting}
          />

          <small>{cardNumber.length}/16 rakam</small>
        </label>

        <label>
          <span>Kart sahibinin adi</span>

          <input
            type="text"
            autoComplete="cc-name"
            placeholder="DENIZ TASAN"
            value={cardHolderName}
            onChange={(event) => {
              setCardHolderName(event.target.value);
              setValidationError("");
            }}
            disabled={isSubmitting}
          />
        </label>

        {displayedError && (
          <p className={styles.error} role="alert">
            {displayedError}
          </p>
        )}

        <button
          type="submit"
          className="ct-button ct-button-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className={styles.spinner} size={18} />
              Odeme yapiliyor...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Odemeyi tamamla
            </>
          )}
        </button>
      </form>
    </section>
  );
}
