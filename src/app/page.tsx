"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { useState, useEffect } from "react";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function HeroBackground() {
  return (
    <>
      {/* Ambient brass glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.06, 0.08, 0.06], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B08D57] rounded-full blur-3xl -z-20"
      />

      {/* Glass panel with vignette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] -z-10"
      >
        <div className="absolute inset-0 bg-[#0F1A2B]/40 backdrop-blur-sm rounded-3xl border border-white/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B1220]/60 rounded-3xl" />
      </motion.div>

      {/* Subtle gradient drift */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.02, 0.04, 0.02],
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-br from-[#B08D57]/10 via-transparent to-[#B08D57]/5 -z-15"
        style={{ backgroundSize: "200% 200%" }}
      />
    </>
  );
}

function ScrollingBelt() {
  const beltText = "GET SEEN • LOOK LEGIT • WEBSITES THAT CONVERT • POSTS THAT SOUND LIKE YOU • TOOLS BUILT FOR REAL PROBLEMS • INSTANT CUSTOMER ANSWERS • ONE CLEAR PLACE FOR CUSTOMERS • FEWER MISSED CUSTOMERS • MORE ORDERS • BUSY WHEN IT MATTERS";

  // Detect mobile for faster scroll speed
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative overflow-hidden h-14 bg-gradient-to-r from-[#b39347] via-[#d4b87f] to-[#b39347] flex items-center">
      <div
        className="flex items-center whitespace-nowrap animate-scroll"
        style={{
          animationDuration: isMobile ? '6.25s' : '10s'
        }}
      >
        <span className="px-4 text-xl font-black tracking-[0.1em] text-[#1a2332] uppercase leading-none">{beltText} •</span>
        <span className="px-4 text-xl font-black tracking-[0.1em] text-[#1a2332] uppercase leading-none">{beltText} •</span>
      </div>
    </div>
  );
}

interface ServiceTileProps {
  title: string;
  tagline: string;
  description: string;
  href: string;
  index: number;
}

function ServiceTile({ title, tagline, description, href, index }: ServiceTileProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={href} className="group block h-full">
        <div className="h-full p-8 bg-[#0F1A2B] border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57]/30 hover:shadow-lg hover:shadow-[#B08D57]/5 hover:bg-[#B08D57]">
          <h3 className="text-2xl font-semibold text-[#F4F6FA] mb-3 transition-colors duration-300 group-hover:text-[#0B1220]">{title}</h3>
          <p className="text-base font-medium text-[#B08D57] mb-4 transition-colors duration-300 group-hover:text-[#0B1220]">{tagline}</p>
          <p className="text-base text-[#A9B4C4] leading-relaxed transition-colors duration-300 group-hover:text-[#0B1220]">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function ProofStrip() {
  const chips = ["Food Trucks", "Taprooms", "Restaurants", "Salons", "Service Businesses"];

  return (
    <section className="py-24">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-semibold text-[#F4F6FA] mb-8"
          >
            Built for real operators.
          </motion.h2>

          {/* Chips */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 text-xs text-[#A9B4C4]/70 bg-[#0F1A2B] border border-white/5 rounded-full"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          {/* Optional reinforcement line */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-base text-[#A9B4C4]/80"
          >
            Designed around how customers actually behave.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A9B4C4]">
          <span>&copy; {year} Shortlist Pass</span>
          <span>hello@shortlistpass.com</span>
        </div>
      </Container>
    </footer>
  );
}

export default function Home() {
  const services = [
    {
      title: "Social",
      tagline: "Stay visible without sounding generic.",
      description: "Posts, reels, and content that sound like you — not a template or AI sludge — so customers remember you when it's time to choose.",
      href: "/social",
    },
    {
      title: "SmartPages",
      tagline: "Your website-light that's intelligent.",
      description: "A branded site that knows your business inside and out and can answer questions in chat so customers don't get bored looking for answers. Immediate responses 24/7 = better conversions, plus we keep all your important links tidy in one cool-ass smart page.",
      href: "/smartpages",
    },
    {
      title: "Websites & Apps",
      tagline: "When the problem needs more than a template.",
      description: "Custom websites and lightweight apps built around how your business actually works — not cookie-cutter themes that all look the same.",
      href: "/digital",
    },
  ];

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <HeroBackground />
        <Container>
          <div className="relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold text-[#F4F6FA] leading-[1.05] mb-6"
              >
                <span className="block lg:inline">Look legit.</span>{" "}
                <span className="block">
                  <span className="lg:inline">Get </span>
                  <span className="relative inline-block px-2">
                    chosen.
                    {/* SVG circle animation */}
                    <motion.svg
                      className="absolute pointer-events-none"
                      viewBox="0 0 200 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: "calc(100% + 48px)",
                        height: "calc(100% + 28px)",
                        left: "-24px",
                        top: "-14px",
                        overflow: "visible",
                        transform: "rotate(2deg)",
                        filter: "drop-shadow(0 0 8px rgba(176, 141, 87, 0.4))"
                      }}
                    >
                      <motion.ellipse
                        cx="100"
                        cy="40"
                        rx="115"
                        ry="42"
                        stroke="#B08D57"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }}
                      />
                    </motion.svg>
                  </span>
                </span>
                <span className="block">Stay busy.</span>
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-[#A9B4C4] max-w-[720px] mx-auto"
              >
                We help local businesses show up clearly online — with websites, social, SmartPages, and custom tools that make it easier for customers to understand, decide, and take action.
              </motion.p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Scrolling Belt */}
      <ScrollingBelt />

      {/* Service Tiles */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceTile key={service.title} {...service} index={index} />
            ))}
          </div>
        </Container>
      </section>

      {/* Proof Strip */}
      <ProofStrip />

      {/* Footer */}
      <Footer />
    </main>
  );
}
