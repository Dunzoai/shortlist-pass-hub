import { FOODTRUCK_EXCHANGES, ShortyStage } from "@/components/new-home/ShortyHero";
import { GET_A_SHORTY_URL } from "./config";
import { C, SERIF } from "./tokens";

const eyebrow = { fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.green } as const;

export function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-2 [grid-template-areas:'stage''copy'] lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-x-12 lg:[grid-template-areas:'copy_stage']">
      <div className="max-w-[560px] [grid-area:copy]">
        <div style={{ ...eyebrow, fontSize: 13 }}>Your newest hire · Food trucks</div>
        <h1 className="text-[60px] leading-[.92] md:text-[96px]" style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.01em", margin: "14px 0 0", textWrap: "balance" }}>You need a Shorty.</h1>
        <p className="text-[17px] md:text-[20px]" style={{ margin: "20px 0 0", lineHeight: 1.6, color: C.body, maxWidth: 560, textWrap: "pretty" }}>
          Want your truck to be the one everybody&rsquo;s talking about? Shorty&rsquo;s the employee who never clocks out. He tells people where you are, when you&rsquo;re there, and what you sell. He takes the orders, texts your regulars, and posts for you.
        </p>
        <p className="text-[16px] md:text-[17px]" style={{ margin: "16px 0 0", fontWeight: 700, color: C.green }}>Try him. Pick up the phone below, tap the truck, or ask him the hard questions.</p>
        <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-3" style={{ marginTop: 26 }}>
          <a href={GET_A_SHORTY_URL} className="inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3.5 text-[16px] font-bold transition-transform hover:-translate-y-0.5" style={{ background: C.ink, color: C.cream }}>Get your own Shorty</a>
          <span className="text-center text-[14px] md:text-left md:text-[14.5px]" style={{ color: "#55524B", lineHeight: 1.45 }}>Free to start. No commission on orders.</span>
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col [grid-area:stage] lg:max-w-none">
        <ShortyStage list={FOODTRUCK_EXCHANGES} scenes={["Low Tide Tacos"]} resetKey="foodtrucks" />
      </div>
    </section>
  );
}
