"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DemoFrameProps {
  children: ReactNode;
  className?: string;
}

export function DemoFrame({ children, className = "" }: DemoFrameProps) {
  return (
    <motion.div
      className={`relative rounded-2xl border border-white/10 bg-[#0a0f1a] overflow-hidden ${className}`}
      style={{
        boxShadow:
          "0 0 60px rgba(176, 141, 87, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Top bar (browser chrome effect) */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#080c14]">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">{children}</div>
    </motion.div>
  );
}
