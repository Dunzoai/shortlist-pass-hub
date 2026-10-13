"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The lot's sound: OFF until the visitor taps the speaker (nothing plays before a tap, and it is off again on every page load).
 * When on: a quiet looping track, soft sound effects, and Shorty's voice reading his bubbles. Scripted lines are static mp3s recorded
 * once at build time (public/foodtrucks/voice/<id>.mp3); typed answers are not voiced (the app's TTS route needs a signed-in
 * owner). Sound effects are skipped when the visitor prefers reduced motion.
 */
export type Sfx = "grab" | "land" | "truck_shake" | "order_card" | "megaphone" | "phone_open" | "phone_close";
const BG_VOL = 0.1, BG_VOL_UNDER_VOICE = 0.04, SFX_VOL = 0.45;

export function useLotAudio(reducedMotion: boolean) {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  const bg = useRef<HTMLAudioElement | null>(null);
  const voice = useRef<HTMLAudioElement | null>(null);

  const stopVoice = useCallback(() => {
    const v = voice.current;
    if (v) { v.pause(); v.src = ""; voice.current = null; }
    if (bg.current) bg.current.volume = BG_VOL;
  }, []);

  const toggle = useCallback(() => {
    const next = !onRef.current;
    onRef.current = next; setOn(next);
    if (next) {
      if (!bg.current) { const a = new Audio("/foodtrucks/audio/bg.mp3"); a.loop = true; a.volume = BG_VOL; bg.current = a; }
      bg.current.play().catch(() => {});
    } else {
      stopVoice();
      bg.current?.pause();
    }
  }, [stopVoice]);

  const speak = useCallback((id: string | null) => {
    if (!onRef.current || !id) return;
    stopVoice();
    const a = new Audio(`/foodtrucks/voice/${id}.mp3`);
    voice.current = a;
    if (bg.current) bg.current.volume = BG_VOL_UNDER_VOICE;
    const done = () => { if (voice.current === a) { voice.current = null; if (bg.current) bg.current.volume = BG_VOL; } };
    a.addEventListener("ended", done); a.addEventListener("error", done);
    a.play().catch(done);
  }, [stopVoice]);

  const sfx = useCallback((name: Sfx) => {
    if (!onRef.current || reducedMotion) return;
    const a = new Audio(`/foodtrucks/audio/${name}.mp3`);
    a.volume = SFX_VOL;
    a.play().catch(() => {});
  }, [reducedMotion]);

  useEffect(() => () => { bg.current?.pause(); voice.current?.pause(); }, []);
  return { on, toggle, speak, sfx, stopVoice };
}
