"use client";

import { motion } from "framer-motion";

interface WhyBlockProps {
  heading: string;
  lines: string[];
  variant?: "light" | "dark";
}

export function WhyBlock({ heading, lines, variant = "light" }: WhyBlockProps) {
  const isDark = variant === "dark";

  return (
    <motion.div
      className="mt-8 rounded-2xl p-4 md:p-5 lg:p-6"
      style={{
        background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.02)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.06)",
      }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Heading with left border */}
      <h4
        className={`text-sm md:text-base font-semibold mb-3 pl-3 ${
          isDark ? "text-[#F4F1EC]" : "text-[#222222]"
        }`}
        style={{
          borderLeft: isDark ? "2px solid #F4F1EC" : "2px solid #333333",
        }}
      >
        {heading}
      </h4>

      {/* Body lines - relaxed spacing, reduced opacity */}
      <div className={`space-y-2 text-sm md:text-base leading-relaxed ${
        isDark ? "text-[#F4F1EC]/70" : "text-[#5A6570]/85"
      }`}>
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </motion.div>
  );
}
