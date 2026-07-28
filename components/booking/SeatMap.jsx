import styles from "./seat-selection.module.scss";

function getSeatId(seat) {
  return seat.seatId ?? seat.id;
}

function getSeatLabel(seat) {
  return `${seat.rowLabel ?? seat.rowLetter ?? "?"}${seat.seatNumber}`;
}

export default function SeatMap({ seats = [], selectedSeatIds = [], onToggleSeat }) {
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.rowLabel ?? seat.rowLetter ?? "?";
    acc[row] = [...(acc[row] || []), seat].sort((a, b) => a.seatNumber - b.seatNumber);
    return acc;
  }, {});

  return (
    <div className={styles.seatMap}>
      {Object.entries(groupedSeats).map(([row, rowSeats]) => (
        <div key={row} className={styles.seatRow}>
          <span className={styles.rowLabel}>{row}</span>
          <div className={styles.seatCells}>
            {rowSeats.map((seat) => {
              const seatId = getSeatId(seat);
              const isSelected = selectedSeatIds.includes(seatId);
              const isAvailable = Boolean(seat.available);
              const seatClassName = [
                styles.seat,
                isSelected ? styles.selectedSeat : "",
                !isAvailable ? styles.bookedSeat : "",
                seat.type === "PREMIUM" || seat.seatType === "PREMIUM" ? styles.premiumSeat : "",
                seat.type === "DISABLED" || seat.seatType === "DISABLED" ? styles.disabledSeat : "",
              ].filter(Boolean).join(" ");

              return (
                <button
                  key={seatId}
                  type="button"
                  className={seatClassName}
                  onClick={() => onToggleSeat(seat)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  aria-label={`${getSeatLabel(seat)} koltugu ${isAvailable ? "musait" : "dolu"}`}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
