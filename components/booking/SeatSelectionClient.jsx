"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import {
  getSeatId,
  isSeatAvailable,
  isSeatBooked,
} from "@/helpers/seat-helpers";
import {
  getShowtimeUnavailableMessage,
  translateBookingError,
} from "@/helpers/showtime-helpers";
import {
  createBooking,
  completePayment,
  cancelBooking,
} from "@/services/booking-service";
import { getShowtimeSeats, getShowtimes } from "@/services/showtime-service";
import BookingSummary from "./BookingSummary";
import SeatLegend from "./SeatLegend";
import SeatMap from "./SeatMap";
import styles from "./seat-selection.module.scss";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentResult from "@/components/payment/PaymentResult";

const BOOKING_EXIT_CONFIRM_MESSAGE =
  "Rezervasyon adimindan cikmak istiyor musun? Secili koltuklar ve odeme akisi sifirlanacak.";

function getShowtimeDate(showtime) {
  if (!showtime) return "Tarih yok";
  if (showtime.date) return showtime.date;
  if (showtime.startTime) return showtime.startTime.slice(0, 10);
  return "Tarih yok";
}

function getShowtimeTime(showtime) {
  if (!showtime) return "--:--";
  if (showtime.startTime?.includes("T"))
    return showtime.startTime.slice(11, 16);
  if (showtime.startTime) return showtime.startTime.slice(0, 5);
  return "--:--";
}

function normalizeSessionRole(role) {
  return String(role ?? "")
    .replace(/^ROLE_/, "")
    .toUpperCase();
}

function getSeatLockStorageKey(showtimeId) {
  return `ct-seat-lock:${showtimeId}`;
}

export default function SeatSelectionClient({ showtimeId }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [seats, setSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const paymentSectionRef = useRef(null);

  // sessionStorage restore/write effect'leri arasındaki yarış durumunu önlemek için.
  const hasHydratedRef = useRef(false);

  const resetBookingFlow = useCallback(() => {
    setSelectedSeatIds([]);
    setBooking(null);
    setPayment(null);
    setPaymentError("");
    setIsPaying(false);
    setErrorMessage("");
    setSuccessMessage("");
    setLockToken(null);
    setLockExpiresAt(null);
    sessionStorage.removeItem(getSeatLockStorageKey(showtimeId));
  }, [showtimeId]);

  // Kalan süreyi her saniye hesaplayan sayaç
 useEffect(() => {
   if (!lockExpiresAt) {
     setRemainingSeconds(null);
     return undefined;
   }

   async function handleExpiry() {
     // Önce backend'de booking'i iptal etmeyi BEKLE (varsa)
     if (booking?.id && session?.accessToken) {
       try {
         await cancelBooking(booking.id, session.accessToken);
       } catch (error) {
         // Booking zaten iptal/expire olmuş olabilir, hatayı yutuyoruz
       }
     }

     // İptal tamamlandıktan SONRA local state'i sıfırla
     resetBookingFlow();

     // İptal backend'de kesinleştikten sonra koltuk haritasını tazele —
     // bu sırada artık backend "dolu değil" diyecek
     await loadSeatData({ silent: true });
   }

   function tick() {
     const diffMs = new Date(lockExpiresAt).getTime() - Date.now();
     const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
     setRemainingSeconds(diffSeconds);

     if (diffSeconds === 0) {
       setErrorMessage(
         "Koltuk secim sureniz doldu, lutfen tekrar secim yapin.",
       );
       handleExpiry(); // fire-and-forget — tick senkron kalmaya devam ediyor
     }
   }

   tick();
   const intervalId = setInterval(tick, 1000);

   return () => clearInterval(intervalId);
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [lockExpiresAt, booking?.id, session?.accessToken]);

  async function loadSeatData({
    silent = false,
    skipSelectionFilter = false,
  } = {}) {
    if (!silent) setIsLoading(true);
    setErrorMessage("");

    try {
      const [seatList, showtimeList] = await Promise.all([
        getShowtimeSeats(showtimeId),
        getShowtimes(),
      ]);

      const normalizedSeats = Array.isArray(seatList) ? seatList : [];
      setSeats(normalizedSeats);
      setShowtime(
        (showtimeList || []).find(
          (item) => String(item.id) === String(showtimeId),
        ) || null,
      );

      setSelectedSeatIds((current) => {
        if (skipSelectionFilter) return current; // YENİ EKLENEN — parametreyle kontrol

        return current.filter((id) =>
          normalizedSeats.some(
            (seat) =>
              String(getSeatId(seat)) === String(id) && !isSeatBooked(seat),
          ),
        );
      });
    } catch (error) {
      setErrorMessage(error.message || "Koltuk bilgileri yuklenemedi.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }

  // Sayfa yenilendiğinde daha önceki koltuk kilidini geri yükler.
  // sessionStorage'daki bilgi bayat olabileceği için (TTL sunucuda çoktan dolmuş olabilir),
  // körü körüne güvenmek yerine her koltuk için tekrar lockSeat çağırarak sunucuya doğrulatıyoruz.
  useEffect(() => {
    const raw = sessionStorage.getItem(getSeatLockStorageKey(showtimeId));

    if (!raw) {
      hasHydratedRef.current = true;
      return undefined;
    }

    // Session henüz hazır değilse (accessToken yoksa) bekle, effect session değişince tekrar çalışacak
    if (!session?.accessToken) {
      return undefined;
    }

    let cancelled = false;

    async function revalidateAndRestore() {
      try {
        const saved = JSON.parse(raw);
        const expiresAtMs = new Date(saved.lockExpiresAt).getTime();

        if (
          !saved.lockToken ||
          !Array.isArray(saved.selectedSeatIds) ||
          saved.selectedSeatIds.length === 0 ||
          expiresAtMs <= Date.now()
        ) {
          sessionStorage.removeItem(getSeatLockStorageKey(showtimeId));
          return;
        }

        // Sunucuya sorarak doğrula — her koltuk için tekrar lockSeat çağırıyoruz (aynı token'la).
        // Biri bile başarısız olursa (409) bu kilit artık geçerli değil demektir.
        let currentToken = saved.lockToken;
        let latestExpiresAt = saved.lockExpiresAt;

        for (const seatId of saved.selectedSeatIds) {
          const result = await lockSeat(
            { showtimeId: Number(showtimeId), seatId, lockToken: currentToken },
            session.accessToken,
          );
          currentToken = result.lockToken;
          latestExpiresAt = result.expiresAt;
        }

        if (cancelled) return;

        setSelectedSeatIds(saved.selectedSeatIds);
        setLockToken(currentToken);
        setLockExpiresAt(latestExpiresAt);
      } catch {
        // Doğrulama başarısız oldu (409 dahil) — bu seçim artık geçerli değil, temizle
        sessionStorage.removeItem(getSeatLockStorageKey(showtimeId));
        if (!cancelled) {
          setErrorMessage(
            "Onceki koltuk seciminizin suresi dolmus, lutfen tekrar secim yapin.",
          );
        }
      } finally {
        if (!cancelled) hasHydratedRef.current = true;
      }
    }

    revalidateAndRestore();

    return () => {
      cancelled = true;
    };
  }, [showtimeId, session?.accessToken]);

  // Koltuk seçimi/kilit bilgisi değiştikçe sessionStorage'ı güncel tut.
  useEffect(() => {
    if (!hasHydratedRef.current) return;

    const key = getSeatLockStorageKey(showtimeId);

    if (selectedSeatIds.length === 0 || !lockToken) {
      sessionStorage.removeItem(key);
      return;
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({ selectedSeatIds, lockToken, lockExpiresAt }),
    );
  }, [showtimeId, selectedSeatIds, lockToken, lockExpiresAt]);

  // YENİ EKLENEN — koltuk haritasını periyodik olarak sessizce tazele
  useEffect(() => {
    if (booking) return undefined; // booking aktifken (pop-up açıkken) gereksiz

    const intervalId = setInterval(() => {
      loadSeatData({ silent: true });
    }, 10000); // 30 saniyede bir

    return () => clearInterval(intervalId);
  }, [booking, showtimeId]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSeatData() {
      try {
        const [seatList, showtimeList] = await Promise.all([
          getShowtimeSeats(showtimeId),
          getShowtimes(),
        ]);

        if (!isMounted) return;
        setSeats(Array.isArray(seatList) ? seatList : []);
        setShowtime(
          (showtimeList || []).find(
            (item) => String(item.id) === String(showtimeId),
          ) || null,
        );
      } catch (error) {
        if (isMounted)
          setErrorMessage(error.message || "Koltuk bilgileri yuklenemedi.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialSeatData();

    return () => {
      isMounted = false;
    };
  }, [showtimeId]);

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(getSeatId(seat))),
    [seats, selectedSeatIds],
  );

  const seatPrice = Number(showtime?.price || 0);
  const totalPrice = selectedSeats.length * seatPrice;
  const bookingUnavailableMessage = getShowtimeUnavailableMessage(showtime);
  const normalizedRole = normalizeSessionRole(session?.user?.role);
  const isCustomer = normalizedRole === "CUSTOMER";
  const bookingAccessMessage = status === "authenticated" && !isCustomer
    ? "Rezervasyon olusturmak icin musteri hesabi ile giris yapmalisin. Admin hesabi bu akista sadece koltuklari goruntuleyebilir."
    : "";
  const bookingBlockedMessage = bookingUnavailableMessage || bookingAccessMessage;
  const isBookable = !bookingBlockedMessage;

  const hasBookingProgress =
    selectedSeatIds.length > 0 ||
    (Boolean(booking) && !payment) ||
    isSubmitting ||
    isPaying;


  useEffect(() => {
    if (!booking || payment) return;
    paymentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [booking, payment]);

  const resetBookingFlow = useCallback(() => {
    setSelectedSeatIds([]);
    setBooking(null);
    setPayment(null);
    setPaymentError("");
    setIsPaying(false);
    setErrorMessage("");
    setSuccessMessage("");

    await Promise.allSettled(
      selectedSeatIds.map((seatId) =>
        unlockSeat(
          { showtimeId: Number(showtimeId), seatId, lockToken },
          session.accessToken,
        ),
      ),
    );
  }

  const confirmBookingExit = useCallback(() => {
    if (!hasBookingProgress) return true;

    const shouldExit = window.confirm(BOOKING_EXIT_CONFIRM_MESSAGE);
    if (shouldExit) {
      unlockAllSelectedSeats(); // fire-and-forget
      resetBookingFlow();
    }
    return shouldExit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasBookingProgress,
    resetBookingFlow,
    lockToken,
    selectedSeatIds,
    showtimeId,
    session?.accessToken,
  ]);

  useEffect(() => {
    if (!hasBookingProgress) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasBookingProgress]);

  // Sekme kapatılırken / sayfa yenilenirken best-effort unlock isteği.
  useEffect(() => {
    function handleUnload() {
      if (!lockToken || selectedSeatIds.length === 0 || !session?.accessToken)
        return;

      selectedSeatIds.forEach((seatId) => {
        fetch(`${config.apiURL}/customer/seats/unlock`, {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            showtimeId: Number(showtimeId),
            seatId,
            lockToken,
          }),
        });
      });
    }

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [lockToken, selectedSeatIds, showtimeId, session?.accessToken]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!hasBookingProgress || event.defaultPrevented || event.button !== 0)
        return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextHref === currentHref) return;

      event.preventDefault();
      if (confirmBookingExit()) router.push(nextHref);
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () =>
      document.removeEventListener("click", handleDocumentClick, true);
  }, [confirmBookingExit, hasBookingProgress, router]);

  async function handleToggleSeat(seat) {
    const seatId = getSeatId(seat);
    const isAlreadySelected = selectedSeatIds.some(
      (id) => String(id) === String(seatId),
    );

    if (
      (!isSeatAvailable(seat) && !isAlreadySelected) ||
      booking ||
      !isBookable
    )
      return;
    if (lockingSeatId) return;

    setLockingSeatId(seatId);
    setErrorMessage("");

    try {
      if (isAlreadySelected) {
        // KOLTUK KALDIRILIYOR (deselect)
        try {
          await unlockSeat(
            { showtimeId: Number(showtimeId), seatId, lockToken },
            session.accessToken,
          );
        } catch (unlockError) {
          // 409: backend "bu artık senin kilidin değil" diyor (TTL zaten dolmuş olabilir).
          // Yine de koltuğu UI'da "seçili" bırakmanın anlamı yok, normal deselect akışına devam ediyoruz.
          if (unlockError.status !== 409) {
            throw unlockError;
          }
        }

        setSelectedSeatIds((current) => {
          const next = current.filter((id) => String(id) !== String(seatId));
          if (next.length === 0) {
            setLockToken(null);
            setLockExpiresAt(null);
          }
          return next;
        });

        await loadSeatData({ silent: true });
      } else {
        // KOLTUK EKLENİYOR (select)
        const result = await lockSeat(
          {
            showtimeId: Number(showtimeId),
            seatId,
            lockToken: lockToken || undefined,
          },
          session.accessToken,
        );

        setLockToken(result.lockToken);
        setLockExpiresAt(result.expiresAt);
        setSelectedSeatIds((current) => [...current, seatId]);
      }
    } catch (error) {
      setErrorMessage(error.message || "Koltuk işlemi başarısız oldu.");
      await loadSeatData({ silent: true });
    } finally {
      setLockingSeatId(null);
    }
  }

  async function handleCreateBooking() {
    if (!session?.accessToken) {
      setErrorMessage("Rezervasyon olusturmak icin musteri olarak giris yapmalisin.");
      return;
    }

    if (!isBookable) {
      setErrorMessage(bookingBlockedMessage);
      return;
    }

    if (selectedSeatIds.length === 0) {
      setErrorMessage("En az bir koltuk secmelisin.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const createdBooking = await createBooking(
        {
          showtimeId: Number(showtimeId),
          seatIds: selectedSeatIds.map(Number),
          lockToken,
        },
        session.accessToken,
      );
      setPayment(null);
      setPaymentError("");
      setBooking(createdBooking);
      setSuccessMessage(
        `Yeriniz ayrildi. Rezervasyon #${createdBooking?.id || ""} olusturuldu. Simdi odeme yapabilirsiniz.`
      );
      await loadSeatData({ silent: true });
    } catch (error) {
      setErrorMessage(translateBookingError(error.message));
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handlePayment(payload) {
    if (!booking?.id) {
      setPaymentError("Odeme icin gecerli bir rezervasyon bulunamadi.");
      return;
    }

    if (!session?.accessToken) {
      setPaymentError("Odeme yapmak icin yeniden giris yapmalisin.");
      return;
    }

    setIsPaying(true);
    setPaymentError("");

    try {
      const paymentResult = await completePayment(
        booking.id,
        payload,
        session.accessToken,
      );

      setPayment(paymentResult);
      setSuccessMessage("Odeme basariyla tamamlandi.");
    } catch (error) {
      setPaymentError(error.message || "Odeme tamamlanamadi.");
    } finally {
      setIsPaying(false);
    }
  }
  return (
    <section className={styles.page}>
      <Link href='/showtimes' className={styles.backLink}>
        <ArrowLeft size={18} /> Seanslara don
      </Link>

      <div className={styles.header}>
        <span className="ct-eyebrow">Koltuk secimi</span>
        <h1>Koltuk secimi</h1>
        <p>
          {showtime?.movieTitle || `Seans #${showtimeId}`} /{" "}
          {showtime?.cinemaName || "Sinema"} / {getShowtimeDate(showtime)}{" "}
          {getShowtimeTime(showtime)}
        </p>
      </div>

      {isLoading && (
        <div className={styles.stateBox}>Koltuklar yukleniyor...</div>
      )}

      {!isLoading && errorMessage && !seats.length && (
        <div className={styles.stateBox} role='alert'>
          <strong>Koltuklar alinamadi.</strong>
          <span>{errorMessage}</span>
          <button type='button' onClick={() => loadSeatData()}>
            <RefreshCw size={16} /> Tekrar dene
          </button>
        </div>
      )}

      {!isLoading && seats.length > 0 && (
        <div className={styles.layout}>
          <div className={styles.mapPanel}>
            <div className={styles.screen}>Perde</div>
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={handleToggleSeat}
              isInteractionDisabled={!isBookable || !!booking}
            />
            <SeatLegend />
          </div>

          <BookingSummary
            showtime={showtime}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            seatPrice={seatPrice}
            remainingSeconds={remainingSeconds}
            isSubmitting={isSubmitting}
            isAuthenticated={status === "authenticated"}
            booking={booking}
            isBookable={isBookable}
            bookingUnavailableMessage={bookingBlockedMessage}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onCreateBooking={handleCreateBooking}
            onRefresh={() => loadSeatData({ silent: true })}
          />
        </div>
      )}

      {booking && !payment && (
        <section
          ref={paymentSectionRef}
          className={styles.paymentStep}
          aria-live="polite"
        >
          <div className={styles.successPanel}>
            <CheckCircle2 size={22} />
            Yeriniz ayrildi. Rezervasyon #{booking.id} olusturuldu. Simdi odeme
            yapabilirsiniz.
          </div>

          {/* YENİ EKLENEN — sayaç artık ödeme ekranında da görünüyor */}
          {remainingSeconds !== null && (
            <p
              className={
                remainingSeconds <= 30
                  ? styles.countdownUrgent
                  : styles.countdown
              }
            >
              Odeme icin kalan sureniz:{" "}
              <strong>{formatTime(remainingSeconds)}</strong>
            </p>
          )}

          <PaymentForm
            isSubmitting={isPaying}
            errorMessage={paymentError}
            onSubmit={handlePayment}
          />
        </section>
      )}

      {payment && (
        <PaymentModal closable={false}>
          <PaymentResult payment={payment} bookingId={booking.id} />
        </PaymentModal>
      )}
    </section>
  );
}
