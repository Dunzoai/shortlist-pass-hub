import { notFound } from "next/navigation";
import { Reel } from "@/components/foodtrucks/reel/Reel";

/** Dev-only: the 1080x1920 Instagram Reel scene (rendered to mp4 by scripts/record-foodtrucks-reel.mjs). 404s in production. */
export const metadata = { title: "Food trucks reel (dev)", robots: { index: false, follow: false } };

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Reel />;
}
