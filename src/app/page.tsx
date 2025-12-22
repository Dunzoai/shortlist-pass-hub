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
          animationDuration: isMobile ? '16s' : '17.25s'
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

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function HelpCard({ icon, title, description, index }: HelpCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group p-6 bg-[#0F1A2B] border border-[#1a2332]/30 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#0B1220] hover:shadow-lg hover:shadow-[#0B1220]/20"
    >
      <div className="mb-4 text-[#d4b87f]">{icon}</div>
      <h3 className="text-xl font-semibold text-[#F4F6FA] mb-3">{title}</h3>
      <p className="text-base text-[#A9B4C4] leading-relaxed">{description}</p>
    </motion.div>
  );
}

function HowWeHelp() {
  const items = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      title: "Show up in the feed",
      description: "We create content people stop scrolling for — built to trigger engagement and beat the algorithms so your business actually gets seen."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: "One page that explains everything",
      description: "We build SmartPages that know your business inside and out — answers, links, updates, hours, menus, booking — all in one place so customers get what they need instantly instead of clicking around or bouncing."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: "Apps built for real problems",
      description: "When your business needs more than a website, we build lightweight custom apps that solve specific problems — from ordering and scheduling to internal tools that make your day easier."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: "Websites that convert",
      description: "Fast, modern websites built to clearly explain what you do and push customers to take action — not cookie-cutter templates that all look the same."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#b39347] via-[#d4b87f] to-[#b39347]">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2
            variants={fadeUpVariant}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-semibold text-[#0B1220] mb-12 text-center"
          >
            How we help
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {items.map((item, index) => (
              <HelpCard key={item.title} {...item} index={index} />
            ))}
          </div>

          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-center text-sm text-[#1a2332] font-medium"
          >
            Each service dives deeper — pick what you need.
          </motion.p>
        </motion.div>
      </Container>
    </section>
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

      {/* How We Help */}
      <HowWeHelp />

      {/* Proof Strip */}
      <ProofStrip />

      {/* Footer */}
      <Footer />
    </main>
  );
}
