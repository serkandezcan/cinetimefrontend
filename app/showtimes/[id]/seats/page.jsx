import PageHeader from "@/components/common/page-header/PageHeader";

export const metadata = { title: "Seat Selection" };

export default function SeatSelectionPage() {
  return <PageHeader title="Seat Selection" description="Seat map will be connected to GET /showtimes/{id}/seats." />;
}
