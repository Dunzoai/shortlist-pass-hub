import { notFound } from "next/navigation";
import RentalsPreview from "@/components/rentals/RentalsPreview";

/** Dev-only design preview of shortlistpass.com/rentals. 404s in production. The public /rentals route does not exist. */
export const metadata = { title: "Rentals page (dev preview)", robots: { index: false, follow: false } };

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RentalsPreview />;
}
