import { Composition, Folder, staticFile } from "remotion";
import { SmartPagePromo } from "./SmartPagePromo";
import { SmartPageCommercial } from "./SmartPageCommercial";
import { SmartPageAd } from "./SmartPageAd";
import { SmartPageIntelligence } from "./SmartPageIntelligence";
import { HeroPhoneChat } from "./HeroPhoneChat";

export const RemotionRoot = () => {
  return (
    <Folder name="Marketing">
      {/* Hero phone chat animation (looping) */}
      <Composition
        id="HeroPhoneChat"
        component={HeroPhoneChat}
        durationInFrames={945}
        fps={30}
        width={390}
        height={844}
      />
      {/* Original horizontal promo (16:9) */}
      <Composition
        id="SmartPagePromo"
        component={SmartPagePromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoUrl: null as string | null,
        }}
      />

      {/* Horizontal commercial (16:9) */}
      <Composition
        id="SmartPageCommercial"
        component={SmartPageCommercial}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Vertical ad for Reels/TikTok/Shorts (9:16) */}
      <Composition
        id="SmartPageAd-9x16"
        component={SmartPageAd}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          bgFootageUrl: undefined,
          logoUrl: staticFile("shortlist-logo-ivory-transparent.png"),
          siteUrl: "shortlistpass.com",
        }}
      />

      {/* Square ad for feeds (1:1) */}
      <Composition
        id="SmartPageAd-1x1"
        component={SmartPageAd}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          bgFootageUrl: undefined,
          logoUrl: staticFile("shortlist-logo-ivory-transparent.png"),
          siteUrl: "shortlistpass.com",
        }}
      />

      {/* Portrait ad for feeds (4:5) */}
      <Composition
        id="SmartPageAd-4x5"
        component={SmartPageAd}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          bgFootageUrl: undefined,
          logoUrl: staticFile("shortlist-logo-ivory-transparent.png"),
          siteUrl: "shortlistpass.com",
        }}
      />

      {/* Phone Intelligence - Vertical (9:16) */}
      <Composition
        id="SmartPageIntelligence-9x16"
        component={SmartPageIntelligence}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          logoUrl: staticFile("shortlist-logo-ivory-transparent.png"),
        }}
      />

      {/* Phone Intelligence - Square (1:1) */}
      <Composition
        id="SmartPageIntelligence-1x1"
        component={SmartPageIntelligence}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          logoUrl: staticFile("shortlist-logo-ivory-transparent.png"),
        }}
      />

      {/* Phone Intelligence - Horizontal (16:9) */}
      <Composition
        id="SmartPageIntelligence-16x9"
        component={SmartPageIntelligence}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          logoUrl: staticFile("shortlist-logo-ivory-transparent.png"),
        }}
      />
    </Folder>
  );
};
