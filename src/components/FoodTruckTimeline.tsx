"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [truckX, setTruckX] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll and update truck position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(containerCenter - cardCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);

      // Calculate truck position to hover above active card
      const activeCard = cardRefs.current[closestIndex];
      if (activeCard && container) {
        const cardRect = activeCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const cardCenterRelative = cardRect.left - containerRect.left + cardRect.width / 2;
        setTruckX(cardCenterRelative);
      }
    };

    container.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    const container = scrollContainerRef.current;
    if (card && container) {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (cardRect.left - containerRect.left) - (containerRect.width / 2) + (cardRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Glass panel container */}
      <div
        className="relative rounded-[28px] p-6 md:p-8 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(15, 23, 36, 0.9) 0%, rgba(11, 18, 32, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
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

        {/* Truck sitting above cards */}
        <div className="relative h-24 flex justify-center">
          <motion.div
            className="absolute"
            style={{ left: 0 }}
            animate={{ x: truckX - 80 }}
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

        {/* Horizontal scrollable cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mt-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Left spacer for centering first card */}
          <div className="shrink-0 w-[calc(50%-140px)]" />

          {scheduleData.map((day, index) => (
            <div
              key={day.day}
              ref={(el) => { cardRefs.current[index] = el; }}
              onClick={() => scrollToCard(index)}
              className="shrink-0 w-[280px] snap-center cursor-pointer"
            >
              <motion.div
                className="rounded-2xl p-6 h-[160px] flex flex-col justify-between transition-colors duration-300"
                animate={{
                  scale: index === activeIndex ? 1 : 0.92,
                  opacity: index === activeIndex ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background: index === activeIndex
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: index === activeIndex
                    ? "1px solid rgba(176, 141, 87, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-medium ${
                    index === activeIndex ? "text-[#B08D57]" : "text-[#A9B4C4]/40"
                  }`}>
                    {day.fullDay}
                  </p>
                  <h4 className={`text-xl font-bold italic ${
                    index === activeIndex ? "text-[#F4F6FA]" : "text-[#F4F6FA]/50"
                  }`}>
                    {day.location}
                  </h4>
                </div>
                <p className={`text-sm ${
                  index === activeIndex ? "text-[#A9B4C4]" : "text-[#A9B4C4]/40"
                }`}>
                  {day.details}
                </p>
              </motion.div>
            </div>
          ))}

          {/* Right spacer for centering last card */}
          <div className="shrink-0 w-[calc(50%-140px)]" />
        </div>

        {/* Day chips at bottom (replacing dots) */}
        <div className="flex justify-center gap-2 mt-4">
          {scheduleData.map((day, index) => (
            <button
              key={day.day}
              onClick={() => scrollToCard(index)}
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
      </div>
    </div>
  );
}
