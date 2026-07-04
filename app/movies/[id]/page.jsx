import PageHeader from "@/components/common/page-header/PageHeader";

export const metadata = { title: "Movie Detail" };

export default function MovieDetailPage() {
  return <PageHeader title="Movie Detail" description="Movie detail will be connected to GET /api/movies/{id}." />;
}
