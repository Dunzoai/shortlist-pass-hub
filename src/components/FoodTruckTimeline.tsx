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
  const [truckPosition, setTruckPosition] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll position and update active card + truck position
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

      // Calculate truck position based on active card
      const activeCard = cardRefs.current[closestIndex];
      if (activeCard) {
        const cardRect = activeCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const cardCenterRelative = cardRect.left - containerRect.left + cardRect.width / 2;
        setTruckPosition(cardCenterRelative);
      }
    };

    container.addEventListener("scroll", handleScroll);
    // Initial calculation
    setTimeout(handleScroll, 100);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to card when clicked
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
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] text-[#B08D57] uppercase tracking-[0.2em] mb-3 font-medium">
          Nito&apos;s Empanadas
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-[#F4F6FA]">
          Follow the truck this week.
        </h3>
      </div>

      {/* Truck that follows scroll */}
      <div className="relative h-16 mb-4">
        <motion.div
          className="absolute top-0"
          animate={{
            x: truckPosition - 40,
            scaleX: truckPosition > 0 ? 1 : -1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Image
            src="/nitos-truck.png"
            alt="Nito's Food Truck"
            width={80}
            height={48}
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Scrollable cards container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Left padding for centering first card */}
        <div className="shrink-0 w-[calc(50%-140px)]" />

        {scheduleData.map((day, index) => (
          <div
            key={day.day}
            ref={(el) => { cardRefs.current[index] = el; }}
            onClick={() => scrollToCard(index)}
            className={`shrink-0 w-[280px] snap-center cursor-pointer transition-all duration-300 ${
              index === activeIndex ? "scale-100" : "scale-95 opacity-70"
            }`}
          >
            <div
              className={`rounded-2xl p-6 h-[180px] flex flex-col justify-between transition-all duration-300 ${
                index === activeIndex
                  ? "bg-[#F4F6FA] border-l-4 border-[#B08D57]"
                  : "bg-[#0F1724] border border-white/10"
              }`}
            >
              <div>
                <p
                  className={`text-[11px] uppercase tracking-wider mb-2 font-medium ${
                    index === activeIndex ? "text-[#0B1220]/60" : "text-[#A9B4C4]/60"
                  }`}
                >
                  {day.fullDay}
                </p>
                <h4
                  className={`text-xl font-bold italic ${
                    index === activeIndex ? "text-[#0B1220]" : "text-[#F4F6FA]"
                  }`}
                >
                  {day.location}
                </h4>
              </div>
              <p
                className={`text-sm ${
                  index === activeIndex ? "text-[#0B1220]/70" : "text-[#A9B4C4]/70"
                }`}
              >
                {day.details}
              </p>
            </div>
          </div>
        ))}

        {/* Right padding for centering last card */}
        <div className="shrink-0 w-[calc(50%-140px)]" />
      </div>

      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-2 mt-4">
        {scheduleData.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-[#B08D57] w-4" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
