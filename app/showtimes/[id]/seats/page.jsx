import SeatSelectionClient from "@/components/booking/SeatSelectionClient";

export const metadata = { title: "Seat Selection" };

export default async function SeatSelectionPage({ params }) {
  const { id } = await params;

  return <SeatSelectionClient showtimeId={id} />;
}
