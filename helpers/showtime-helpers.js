export function getShowtimeStartDate(showtime) {
  if (!showtime) return null;

  if (showtime.startTime?.includes("T")) {
    const date = new Date(showtime.startTime);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (!showtime.date || !showtime.startTime) return null;

  const date = new Date(`${showtime.date}T${showtime.startTime}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isShowtimeActive(showtime) {
  return !showtime?.status || String(showtime.status).toUpperCase() === "ACTIVE";
}

export function hasShowtimeStarted(showtime, now = new Date()) {
  const startDate = getShowtimeStartDate(showtime);
  if (!startDate) return false;
  return startDate <= now;
}

export function isShowtimeBookable(showtime, now = new Date()) {
  return isShowtimeActive(showtime) && !hasShowtimeStarted(showtime, now);
}

export function getShowtimeUnavailableMessage(showtime) {
  if (!showtime) return "Seans bilgisi alinamadigi icin booking olusturulamiyor.";

  if (!isShowtimeActive(showtime)) {
    return "Bu seans aktif degil. Lutfen farkli bir seans sec.";
  }

  if (hasShowtimeStarted(showtime)) {
    return "Bu seans basladigi veya gecmiste kaldigi icin booking olusturulamaz.";
  }

  return "";
}

export function filterBookableShowtimes(showtimes = []) {
  return showtimes.filter((showtime) => isShowtimeBookable(showtime));
}

export function translateBookingError(message) {
  const normalizedMessage = String(message ?? "").toLowerCase();

  if (normalizedMessage.includes("already started")) {
    return "Bu seans basladigi veya gecmiste kaldigi icin booking olusturulamaz.";
  }

  if (normalizedMessage.includes("already booked")) {
    return "Secilen koltuklardan biri artik dolu. Lutfen koltuklari yenileyip tekrar dene.";
  }

  if (normalizedMessage.includes("status code 403") || normalizedMessage.includes("access denied")) {
    return "Bu islem icin customer hesabi ile giris yapmalisin. Admin hesabi booking olusturamaz.";
  }

  return message || "Booking olusturulamadi.";
}