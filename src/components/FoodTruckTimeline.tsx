"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DayData {
  day: string;
  location: string;
  cta: string;
}

const scheduleData: DayData[] = [
  { day: "Mon", location: "Downtown Lunch", cta: "Order ahead" },
  { day: "Tue", location: "Brewery Night", cta: "Get directions" },
  { day: "Wed", location: "Private Event", cta: "See details" },
  { day: "Thu", location: "Market Pop-Up", cta: "See menu" },
  { day: "Fri", location: "Food Truck Friday", cta: "Get directions" },
  { day: "Sat", location: "Festival", cta: "Order ahead" },
  { day: "Sun", location: "Closed / Prep", cta: "See next week" },
];

export function FoodTruckTimeline() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentDay = scheduleData[selectedIndex];

  return (
    <div className="space-y-8">
      {/* Day chips with truck indicator */}
      <div className="relative">
        {/* Track line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />

        {/* Day chips */}
        <div className="relative flex justify-between items-center">
          {scheduleData.map((day, index) => (
            <button
              key={day.day}
              onClick={() => setSelectedIndex(index)}
              className={`relative z-10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-[#B08D57] text-[#0B1220]"
                  : "bg-[#0F1724] text-[#A9B4C4] hover:bg-[#151d2e] border border-white/5"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Food truck indicator */}
        <motion.div
          className="absolute -bottom-8 flex flex-col items-center"
          initial={false}
          animate={{
            left: `${(selectedIndex / (scheduleData.length - 1)) * 100}%`,
            x: "-50%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {/* Truck SVG */}
          <svg
            width="32"
            height="20"
            viewBox="0 0 32 20"
            fill="none"
            className="text-[#B08D57]"
          >
            {/* Truck body */}
            <rect x="0" y="4" width="20" height="12" rx="2" fill="currentColor" />
            {/* Truck cabin */}
            <path
              d="M20 8H26C28 8 30 10 30 12V16H20V8Z"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Window */}
            <rect x="22" y="9" width="6" height="4" rx="1" fill="#0B1220" opacity="0.5" />
            {/* Wheels */}
            <circle cx="6" cy="16" r="3" fill="#0B1220" />
            <circle cx="6" cy="16" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="24" cy="16" r="3" fill="#0B1220" />
            <circle cx="24" cy="16" r="1.5" fill="currentColor" opacity="0.4" />
            {/* Serving window */}
            <rect x="3" y="6" width="6" height="5" rx="1" fill="#0B1220" opacity="0.4" />
          </svg>
        </motion.div>
      </div>

      {/* Location and CTA display */}
      <div className="pt-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="text-xl md:text-2xl font-semibold text-[#F4F6FA]">
              {currentDay.location}
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B08D57]/10 border border-[#B08D57]/30 text-[#B08D57] text-sm font-medium hover:bg-[#B08D57]/20 transition-colors">
              {currentDay.cta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M1 7h12M8 2l5 5-5 5" />
              </svg>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
