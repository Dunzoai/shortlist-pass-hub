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

// Hero background is now static (background image only)

function ScrollingBelt() {
  const beltText = "GET SEEN • LOOK LEGIT • WEBSITES THAT CONVERT • POSTS THAT SOUND LIKE YOU • SOCIAL THAT SHOWS UP • ONE PAGE THAT EXPLAINS EVERYTHING • INSTANT CUSTOMER ANSWERS • APPS BUILT FOR REAL PROBLEMS • TOOLS THAT SAVE YOU TIME • MORE CUSTOMERS, LESS CONFUSION";

  // Detect mobile for faster scroll speed
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative overflow-hidden h-14 bg-gradient-to-r from-[#2E8B57] via-[#2E8B57] to-[#2E8B57] flex items-center">
      <div
        className="flex items-center whitespace-nowrap animate-scroll"
        style={{
          animationDuration: isMobile ? '16s' : '17.25s'
        }}
      >
        <span className="px-4 text-xl font-black tracking-[0.1em] text-[#1A1F24] uppercase leading-none">{beltText} •</span>
        <span className="px-4 text-xl font-black tracking-[0.1em] text-[#1A1F24] uppercase leading-none">{beltText} •</span>
      </div>
    </div>
  );
}

interface ServiceTileProps {
  title: string;
  subhead: string;
  description: string;
  href: string;
  index: number;
}

function ServiceTile({ title, subhead, description, href, index }: ServiceTileProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={href} className="group block h-full">
        <div className="h-full p-8 bg-[#F4F1EC] border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2E8B57]/30 hover:shadow-lg hover:shadow-[#2E8B57]/5 hover:bg-[#2E8B57]">
          <h3 className="text-2xl font-semibold text-[#1A1F24] mb-2 transition-colors duration-300 group-hover:text-[#F4F1EC]">{title}</h3>
          <p className="text-sm font-medium text-[#2E8B57] mb-4 transition-colors duration-300 group-hover:text-[#F4F1EC]">{subhead}</p>
          <p className="text-base text-[#5A6570] leading-relaxed transition-colors duration-300 group-hover:text-[#F4F1EC]">{description}</p>
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
      className="group p-6 bg-[#F4F1EC] border border-[#1A1F24]/30 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#F4F1EC] hover:shadow-lg hover:shadow-[#F4F1EC]/20"
    >
      <div className="mb-4 text-[#2E8B57]">{icon}</div>
      <h3 className="text-xl font-semibold text-[#1A1F24] mb-3">{title}</h3>
      <p className="text-base text-[#5A6570] leading-relaxed">{description}</p>
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
      description: "We create scroll-stopping social media content designed to get shown — helping your business stay visible, familiar, and top-of-mind when customers are deciding where to go."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: "One page that explains everything",
      description: "We build SmartPages that know your business inside and out — answers, links, hours, menus, booking — all in one place so customers get what they need instantly and feel confident choosing you."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      title: "Apps built for real problems",
      description: "When your business needs more than a website, we build simple custom tools — ordering, scheduling, internal systems — designed around how you actually operate."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: "Websites that convert",
      description: "Fast, modern websites built to clearly explain what you do and push customers to take action — not cookie-cutter templates that look like everyone else."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#2E8B57] via-[#2E8B57] to-[#2E8B57]">
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
            className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-[#F4F1EC] leading-[1.05] mb-12 text-center"
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
            className="text-center text-sm text-[#1A1F24] font-medium"
          >
            Each service dives deeper — start where you need help most.
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
            className="text-3xl font-semibold text-[#1A1F24] mb-8"
          >
            Built for real business owners.
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
                className="px-3 py-1.5 text-xs text-[#5A6570]/70 bg-[#F4F1EC] border border-white/5 rounded-full"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          {/* Optional reinforcement line */}
          <motion.p
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-base text-[#5A6570]/80"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#5A6570]">
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
      title: "Social that actually shows up",
      subhead: "Be seen where customers already scroll.",
      description: "We create and manage social media that stops the scroll and beats the algorithms — so your business actually shows up in feeds, stays familiar, and gets picked when it matters.",
      href: "/social",
    },
    {
      title: "SmartPages",
      subhead: "One clear place customers trust.",
      description: "A website-light page that knows your business inside and out — answers, hours, menus, links, updates, booking — all in one place, with instant responses that keep customers confident and moving forward.",
      href: "/smartpages",
    },
    {
      title: "Websites & Apps",
      subhead: "When the problem needs more than a template.",
      description: "Custom websites and lightweight apps built around how your business actually runs — designed to explain clearly, remove friction, and turn interest into orders, bookings, and calls.",
      href: "/digital",
    },
  ];

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section
        className="relative py-20 lg:py-28"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#F4F1EC]/70 -z-5" />
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
                className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold text-[#1A1F24] leading-[1.05] mb-6"
              >
                <span className="block">Look legit.</span>
                <span className="block">
                  Get{" "}
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
                        stroke="#2E8B57"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0.8, 0.9, 0.8] }}
                        transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }}
                      />
                    </motion.svg>
                  </span>
                </span>
                <span className="block">Stay busy.</span>
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-[#5A6570] max-w-[720px] mx-auto"
              >
                Websites, social media, SmartPages, and custom apps that make customers pick you — not the place down the street.
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
