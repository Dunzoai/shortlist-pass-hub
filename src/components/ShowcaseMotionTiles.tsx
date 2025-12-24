"use client";

import { motion } from "framer-motion";

interface TileData {
  title: string;
  label: string;
}

const tiles: TileData[] = [
  { title: "Featured", label: "Seasonal Special" },
  { title: "Popular", label: "Best Seller" },
  { title: "New", label: "Just Added" },
];

export function ShowcaseMotionTiles() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
      {tiles.map((tile, index) => {
        // Alternate directions: left, center, right
        const direction = index === 0 ? -1 : index === 2 ? 1 : 0;

        return (
          <motion.div
            key={tile.title}
            className="group relative w-full md:w-[180px] h-[140px] rounded-xl overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #0F1724 0%, #0a0f1a 100%)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
            initial={{ opacity: 0, x: direction * 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -4,
              boxShadow: "0 12px 40px rgba(176, 141, 87, 0.12)",
              borderColor: "rgba(176, 141, 87, 0.2)",
            }}
          >
            {/* Inner glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#B08D57]/0 to-[#B08D57]/0 group-hover:from-[#B08D57]/5 group-hover:to-transparent transition-all duration-300" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-4">
              {/* Label chip */}
              <span className="inline-block self-start px-2 py-1 text-[10px] uppercase tracking-wider font-medium text-[#B08D57] bg-[#B08D57]/10 rounded">
                {tile.label}
              </span>

              {/* Placeholder visual */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 rounded-lg bg-white/5 group-hover:bg-[#B08D57]/10 transition-colors" />
              </div>

              {/* Title */}
              <p className="text-sm font-medium text-[#F4F6FA]/80 group-hover:text-[#F4F6FA] transition-colors">
                {tile.title}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
