"use client";

import { motion } from "framer-motion";

interface WhyBlockProps {
  heading: string;
  lines: string[];
}

export function WhyBlock({ heading, lines }: WhyBlockProps) {
  return (
    <motion.div
      className="mt-8 rounded-2xl p-4 md:p-5 lg:p-6"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Heading with brass left border */}
      <h4
        className="text-sm md:text-base font-semibold text-[#F4F6FA] mb-3 pl-3"
        style={{
          borderLeft: "2px solid #B08D57",
        }}
      >
        {heading}
      </h4>

      {/* Body lines - relaxed spacing, reduced opacity */}
      <div className="space-y-2 text-sm md:text-base text-[#A9B4C4]/85 leading-relaxed">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </motion.div>
  );
}
