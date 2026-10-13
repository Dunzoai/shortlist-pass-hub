import { FoodTrucksHeader } from "@/components/foodtrucks/FoodTrucksHeader";
import { Hero } from "@/components/foodtrucks/Hero";
import ShortysLot from "@/components/foodtrucks/ShortysLot";
import { Sections } from "@/components/foodtrucks/Sections";
import { TrucksTonight } from "@/components/foodtrucks/TrucksTonight";
import { getTrucksTonight } from "@/components/foodtrucks/api";
import { C, SANS, SERIF } from "@/components/foodtrucks/tokens";
import "@/components/foodtrucks/lot.css";

/** Re-fetch tonight's trucks at most once a minute. */
export const revalidate = 60;

export default async function FoodTrucksPage() {
  const tonight = await getTrucksTonight();
  return (
    <main style={{ minHeight: "100vh", background: C.ivory, color: C.ink, fontFamily: SANS }}>
      <FoodTrucksHeader />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-[18px] pb-16 pt-3 md:gap-24 md:px-12 md:pb-20 md:pt-6">
        <Hero />
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: C.green }}>Shorty&rsquo;s lot</div>
              <h2 className="text-[36px] md:text-[44px]" style={{ fontFamily: SERIF, fontWeight: 400, lineHeight: 1, margin: "8px 0 0" }}>Go ahead, play with him.</h2>
            </div>
            <p className="text-[15px]" style={{ margin: 0, color: C.muted, maxWidth: 420, lineHeight: 1.5 }}>Grab him, flick him, drop him on the truck. Pick up the phone to see what your customers see. Everything he says is what he really does.</p>
          </div>
          <ShortysLot tonightCount={tonight && tonight.count > 0 ? tonight.count : null} />
        </section>
        <Sections />
        <TrucksTonight tonight={tonight} />
      </div>
    </main>
  );
}
