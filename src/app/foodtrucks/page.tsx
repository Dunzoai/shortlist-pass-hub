import { FoodTrucksHeader } from "@/components/foodtrucks/FoodTrucksHeader";
import { Hero } from "@/components/foodtrucks/Hero";
import { PipesSection } from "@/components/new-home/PipesSection";
import { ChatPluginSection } from "@/components/new-home/ChatPluginSection";
import NothingReplaces from "@/components/foodtrucks/NothingReplaces";
import { SkillsSection } from "@/components/new-home/SkillsSection";
import { SiteFooter } from "@/components/new-home/SiteFooter";
import { TornEdge } from "@/components/new-home/TornEdge";
import ANotSection from "@/components/foodtrucks/ANotSection";
import FoodTruckReel from "@/components/foodtrucks/video/FoodTruckReel";
import { Sections } from "@/components/foodtrucks/Sections";
import { C, SANS } from "@/components/foodtrucks/tokens";

export default function FoodTrucksPage() {
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
      <NothingReplaces />
      <div className="relative">
        <TornEdge fill="#5FDDAE" angle={12} rough={1} seed={14} />
        <SkillsSection mode="trucks" />
      </div>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-[18px] pb-16 pt-16 md:gap-24 md:px-12 md:pb-24 md:pt-24">
        <Sections />
      </div>
      <SiteFooter />
    </main>
  );
}
