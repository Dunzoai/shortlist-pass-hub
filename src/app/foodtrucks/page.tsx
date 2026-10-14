import { FoodTrucksHeader } from "@/components/foodtrucks/FoodTrucksHeader";
import { Hero } from "@/components/foodtrucks/Hero";
import { PipesSection } from "@/components/new-home/PipesSection";
import { ChatPluginSection } from "@/components/new-home/ChatPluginSection";
import ANotSection from "@/components/foodtrucks/ANotSection";
import FoodTruckReel from "@/components/foodtrucks/video/FoodTruckReel";
import { Sections } from "@/components/foodtrucks/Sections";
import { TrucksTonight } from "@/components/foodtrucks/TrucksTonight";
import { getTrucksTonight } from "@/components/foodtrucks/api";
import { C, SANS } from "@/components/foodtrucks/tokens";

/** Re-fetch tonight's trucks at most once a minute. */
export const revalidate = 60;

export default async function FoodTrucksPage() {
  const tonight = await getTrucksTonight();
  return (
    <main style={{ minHeight: "100vh", background: C.ivory, color: C.ink, fontFamily: SANS }}>
      <FoodTrucksHeader />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-[18px] pb-16 pt-3 md:gap-24 md:px-12 md:pb-20 md:pt-6">
        <Hero />
      </div>
      <FoodTruckReel />
      <PipesSection mode="trucks" />
      <ChatPluginSection trucks />
      <ANotSection />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-[18px] pb-16 pt-3 md:gap-24 md:px-12 md:pb-20 md:pt-6">
        <Sections />
        <TrucksTonight tonight={tonight} />
      </div>
    </main>
  );
}
