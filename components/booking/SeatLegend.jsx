import styles from "./seat-selection.module.scss";

const legendItems = [
  { label: "Musait", className: styles.legendAvailable },
  { label: "Secili", className: styles.legendSelected },
  { label: "Dolu", className: styles.legendBooked },
  { label: "Premium", className: styles.legendPremium },
];

export default function SeatLegend() {
  return (
    <div className={styles.legend} aria-label="Koltuk renk aciklamalari">
      {legendItems.map((item) => (
        <span key={item.label}>
          <i className={item.className} /> {item.label}
        </span>
      ))}
    </div>
  );
}
