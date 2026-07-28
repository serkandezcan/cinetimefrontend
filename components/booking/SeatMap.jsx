import {
  getSeatId,
  getSeatLabel,
  getSeatRow,
  getSeatType,
  isSeatAvailable,
} from "@/helpers/seat-helpers";
import styles from "./seat-selection.module.scss";

export default function SeatMap({ seats = [], selectedSeatIds = [], onToggleSeat, isInteractionDisabled = false }) {
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = getSeatRow(seat);
    acc[row] = [...(acc[row] || []), seat].sort((a, b) => a.seatNumber - b.seatNumber);
    return acc;
  }, {});

  const sortedRows = Object.entries(groupedSeats).sort(([rowA], [rowB]) =>
    rowA.localeCompare(rowB, "tr")
  );
  const maxSeatCount = Math.max(1, ...sortedRows.map(([, rowSeats]) => rowSeats.length));

  return (
    <div className={styles.seatMap} style={{ "--seat-count": maxSeatCount }}>
      {sortedRows.map(([row, rowSeats]) => (
        <div key={row} className={styles.seatRow}>
          <span className={styles.rowLabel}>{row}</span>
          <div className={styles.seatCells}>
            {rowSeats.map((seat) => {
              const seatId = getSeatId(seat);
              const isSelected = selectedSeatIds.includes(seatId);
              const isAvailable = isSeatAvailable(seat);
              const isDisabled = !isAvailable || isInteractionDisabled;
              const seatType = getSeatType(seat);
              const seatClassName = [
                styles.seat,
                isSelected ? styles.selectedSeat : "",
                !isAvailable ? styles.bookedSeat : "",
                isInteractionDisabled && isAvailable ? styles.disabledSeat : "",
                seatType === "PREMIUM" ? styles.premiumSeat : "",
                seatType === "DISABLED" ? styles.disabledSeat : "",
              ].filter(Boolean).join(" ");

              return (
                <button
                  key={seatId}
                  type="button"
                  className={seatClassName}
                  onClick={() => onToggleSeat(seat)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  aria-label={`${getSeatLabel(seat)} koltugu ${isDisabled ? "secilemez" : "musait"}`}
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
