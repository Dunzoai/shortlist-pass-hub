"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Audience = "business" | "hoa";

const Ctx = createContext<{ audience: Audience; setAudience: (a: Audience) => void }>({
  audience: "business",
  setAudience: () => {},
});

/** Which version of the page we're showing. `/new#hoa` opens the HOA version directly. */
export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setState] = useState<Audience>("business");

  useEffect(() => {
    if (window.location.hash === "#hoa") setState("hoa");
  }, []);

  const setAudience = useCallback((a: Audience) => {
    setState(a);
    window.history.replaceState(null, "", a === "hoa" ? "#hoa" : window.location.pathname + window.location.search);
  }, []);

  return <Ctx.Provider value={{ audience, setAudience }}>{children}</Ctx.Provider>;
}

export const useAudience = () => useContext(Ctx);
