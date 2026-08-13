import {
  getSeatId,
  getSeatLabel,
  getSeatRow,
  getSeatType,
  isSeatAvailable,
  isSeatBooked, // YENİ EKLENEN import
  isSeatLocked, 
} from "@/helpers/seat-helpers";
import styles from "./seat-selection.module.scss";

export default function SeatMap({
  seats = [],
  selectedSeatIds = [],
  onToggleSeat,
  isInteractionDisabled = false,
}) {
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = getSeatRow(seat);
    acc[row] = [...(acc[row] || []), seat].sort(
      (a, b) => a.seatNumber - b.seatNumber,
    );
    return acc;
  }, {});

  const sortedRows = Object.entries(groupedSeats).sort(([rowA], [rowB]) =>
    rowA.localeCompare(rowB, "tr"),
  );
  const maxSeatCount = Math.max(
    1,
    ...sortedRows.map(([, rowSeats]) => rowSeats.length),
  );

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
              const isBookedByOther = isSeatBooked(seat) && !isSelected; // YENİ EKLENEN — kendi seçtiğimiz koltuk "dolu" görünmesin

              const isLockedByOther = isSeatLocked(seat) && !isSelected; // YENİ EKLENEN — kendi seçtiğimizi "başkası kilitledi" gibi göstermeyelim
              const isDisabled =
                (!isAvailable && !isSelected) || isInteractionDisabled;
              const seatType = getSeatType(seat);
              const seatClassName = [
                styles.seat,
                isSelected ? styles.selectedSeat : "",
                isBookedByOther ? styles.bookedSeat : "", // DEĞİŞTİ — isBooked yerine isBookedByOther
                isLockedByOther ? styles.lockedSeat : "", // YENİ EKLENEN — ayrı bir CSS sınıfı
                isInteractionDisabled && isAvailable ? styles.disabledSeat : "",
                seatType === "PREMIUM" ? styles.premiumSeat : "",
                seatType === "DISABLED" ? styles.disabledSeat : "",
              ]
                .filter(Boolean)
                .join(" ");

              const ariaLabel = isBookedByOther
                ? `${getSeatLabel(seat)} koltugu dolu`
                : isLockedByOther
                  ? `${getSeatLabel(seat)} koltugu su an baska bir kullanici tarafindan seciliyor`
                  : `${getSeatLabel(seat)} koltugu ${isDisabled ? "secilemez" : "musait"}`;

              return (
                <button
                  key={seatId}
                  type='button'
                  className={seatClassName}
                  onClick={() => onToggleSeat(seat)}
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  aria-label={ariaLabel}
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
