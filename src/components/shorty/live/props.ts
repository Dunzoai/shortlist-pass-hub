/** One drawing of the burger (viewBox 0 0 100 80), shared by the one on the table and the one in Shorty's hand. */
export const BURGER_PARTS: { tag: "path" | "rect" | "ellipse"; a: Record<string, string | number> }[] = [
  { tag: "path", a: { d: "M12 58 H88 Q88 73 74 73 H26 Q12 73 12 58 Z", fill: "#dd9f55" } },                       // bottom bun
  { tag: "rect", a: { x: 7, y: 46, width: 86, height: 14, rx: 7, fill: "#6b3a22" } },                             // patty
  { tag: "path", a: { d: "M8 45 H92 L87 53 L77 46 L67 57 L57 46 L40 46 L31 58 L22 46 L12 53 Z", fill: "#f2b134" } }, // melted cheese
  { tag: "rect", a: { x: 9, y: 36, width: 82, height: 10, rx: 5, fill: "#d6452f" } },                             // tomato
  { tag: "path", a: { d: "M5 38 Q13 27 22 36 Q30 27 38 36 Q46 27 54 36 Q62 27 70 36 Q78 27 86 36 Q92 30 96 38 Q50 44 5 38 Z", fill: "#7cc04a" } }, // lettuce
  { tag: "path", a: { d: "M10 31 Q10 5 50 5 Q90 5 90 31 Z", fill: "#e8a75a" } },                                  // top bun
  { tag: "ellipse", a: { cx: 30, cy: 17, rx: 3.6, ry: 1.9, fill: "#fbf3dc", stroke: "none" } },
  { tag: "ellipse", a: { cx: 48, cy: 12, rx: 3.6, ry: 1.9, fill: "#fbf3dc", stroke: "none" } },
  { tag: "ellipse", a: { cx: 66, cy: 17, rx: 3.6, ry: 1.9, fill: "#fbf3dc", stroke: "none" } },
  { tag: "ellipse", a: { cx: 40, cy: 24, rx: 3.6, ry: 1.9, fill: "#fbf3dc", stroke: "none" } },
  { tag: "ellipse", a: { cx: 58, cy: 23, rx: 3.6, ry: 1.9, fill: "#fbf3dc", stroke: "none" } },
];
