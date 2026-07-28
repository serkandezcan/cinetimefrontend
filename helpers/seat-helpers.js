export function getSeatId(seat) {
  return seat?.seatId ?? seat?.id;
}

export function getSeatRow(seat) {
  return seat?.rowLetter ?? seat?.rowLabel ?? "?";
}

export function getSeatType(seat) {
  return seat?.seatType ?? seat?.type;
}

export function getSeatLabel(seat) {
  return `${getSeatRow(seat)}${seat?.seatNumber ?? ""}`;
}

export function isSeatBooked(seat) {
  if (typeof seat?.isBooked === "boolean") return seat.isBooked;
  if (typeof seat?.booked === "boolean") return seat.booked;
  if (typeof seat?.reserved === "boolean") return seat.reserved;
  if (typeof seat?.available === "boolean") return !seat.available;

  const status = String(seat?.status ?? "").toUpperCase();
  if (["BOOKED", "RESERVED", "SOLD", "SOLD_OUT", "UNAVAILABLE"].includes(status)) {
    return true;
  }

  return false;
}

export function isSeatAvailable(seat) {
  if (getSeatType(seat) === "DISABLED") return false;
  return !isSeatBooked(seat);
}
