"use client";

import { X } from "lucide-react";
import styles from "./payment-modal.module.scss";

export default function PaymentModal({ children, onClose, closable = true }) {
  return (
    <div className={styles.overlay} role='dialog' aria-modal='true'>
      <div className={styles.modal}>
        {closable && (
          <button
            type='button'
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Odeme penceresini kapat'
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
