"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface DayData {
  day: string;
  fullDay: string;
  location: string;
  details: string;
}

const scheduleData: DayData[] = [
  { day: "Mon", fullDay: "MONDAY", location: "Downtown Lunch", details: "11am - 2pm at Main St Plaza" },
  { day: "Tue", fullDay: "TUESDAY", location: "Brewery Night", details: "5pm - 9pm at Coastal Brewing" },
  { day: "Wed", fullDay: "WEDNESDAY", location: "Private Event", details: "Booked for corporate catering" },
  { day: "Thu", fullDay: "THURSDAY", location: "Market Pop-Up", details: "4pm - 8pm at Farmer's Market" },
  { day: "Fri", fullDay: "FRIDAY", location: "Food Truck Friday", details: "11am - 10pm at Waterfront Park" },
  { day: "Sat", fullDay: "SATURDAY", location: "Festival", details: "All day at Summer Fest" },
  { day: "Sun", fullDay: "SUNDAY", location: "Closed", details: "Back Monday!" },
];

export function FoodTruckTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasGlowed, setHasGlowed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset glow on index change
  useEffect(() => {
    setHasGlowed(false);
    const timer = setTimeout(() => setHasGlowed(true), 600);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const goToDay = (index: number) => {
    setActiveIndex(index);
  };

  const currentDay = scheduleData[activeIndex];

  return (
    <div className="relative">
      {/* Glass panel container */}
      <div
        className="relative rounded-[28px] p-8 md:p-10 min-h-[420px]"
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 36, 0.9) 0%, rgba(11, 18, 32, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        }}
      >
        {/* Header inside panel */}
        <div className="text-center mb-8">
          <p className="text-[10px] text-[#B08D57] uppercase tracking-[0.25em] mb-2 font-medium">
            Nito&apos;s Empanadas (Real Example)
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#F4F6FA] mb-2">
            Follow the truck this week.
          </h3>
          <p className="text-sm text-[#A9B4C4]/70">
            Tap a day. Watch the truck move. Get the details instantly.
          </p>
        </div>

        {/* Day chips */}
        <div className="flex justify-center gap-2 mb-6">
          {scheduleData.map((day, index) => (
            <button
              key={day.day}
              onClick={() => goToDay(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                index === activeIndex
                  ? "bg-[#B08D57] text-[#0B1220]"
                  : "bg-white/5 text-[#A9B4C4]/70 hover:bg-white/10 hover:text-[#A9B4C4]"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Truck that moves above cards */}
        <div className="relative h-20 mb-4 flex justify-center">
          <motion.div
            animate={{
              x: (activeIndex - 3) * 80,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.8,
            }}
          >
            <Image
              src="/nitos-truck.png"
              alt="Nito's Food Truck"
              width={160}
              height={96}
              className="object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Hero card carousel */}
        <div ref={containerRef} className="relative flex items-center justify-center gap-4 overflow-hidden">
          {/* Previous card (peeking) */}
          <motion.div
            className="hidden md:block absolute left-0 w-[280px] opacity-30 blur-[2px] scale-90"
            animate={{ x: -80 }}
          >
            <DayCard
              day={scheduleData[(activeIndex - 1 + scheduleData.length) % scheduleData.length]}
              isActive={false}
              hasGlowed={true}
            />
          </motion.div>

          {/* Active card (hero) */}
          <motion.div
            key={activeIndex}
            className="relative z-10 w-full max-w-[520px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DayCard day={currentDay} isActive={true} hasGlowed={hasGlowed} />
          </motion.div>

          {/* Next card (peeking) */}
          <motion.div
            className="hidden md:block absolute right-0 w-[280px] opacity-30 blur-[2px] scale-90"
            animate={{ x: 80 }}
          >
            <DayCard
              day={scheduleData[(activeIndex + 1) % scheduleData.length]}
              isActive={false}
              hasGlowed={true}
            />
          </motion.div>
        </div>

        {/* Dot pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {scheduleData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToDay(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-[#B08D57] w-6" : "bg-white/15 hover:bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual day card component
function DayCard({
  day,
  isActive,
  hasGlowed,
}: {
  day: DayData;
  isActive: boolean;
  hasGlowed: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 md:p-8 transition-all duration-500 ${
        isActive ? "min-h-[180px]" : "min-h-[160px]"
      }`}
      style={
        isActive
          ? {
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(176, 141, 87, 0.3)",
              boxShadow: hasGlowed
                ? "0 0 0 rgba(176, 141, 87, 0)"
                : "0 0 30px rgba(176, 141, 87, 0.2), 0 0 60px rgba(176, 141, 87, 0.1)",
            }
          : {
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }
      }
    >
      {/* Brass glow pulse (one-time) */}
      {isActive && !hasGlowed && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            boxShadow: "inset 0 0 20px rgba(176, 141, 87, 0.15)",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={day.day}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p
            className={`text-[10px] uppercase tracking-[0.2em] mb-3 font-medium ${
              isActive ? "text-[#B08D57]" : "text-[#A9B4C4]/40"
            }`}
          >
            {day.fullDay}
          </p>
          <h4
            className={`text-2xl md:text-3xl font-bold italic mb-3 ${
              isActive ? "text-[#F4F6FA]" : "text-[#F4F6FA]/50"
            }`}
          >
            {day.location}
          </h4>
          <p
            className={`text-sm md:text-base ${
              isActive ? "text-[#A9B4C4]" : "text-[#A9B4C4]/40"
            }`}
          >
            {day.details}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
