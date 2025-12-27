"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

// Hero rotating images - bottom left
const heroImagesLeft = [
  "/coffee-receipt.png",
  "/laptop-note.png",
  "/barber.png",
  "/takeout.png",
  "/wrench-screwdriver.png",
];

// Hero rotating images - top right
const heroImagesRight = [
  "/website-homepage.png",
  "/instagram-post.png",
  "/smartpage-hero.png",
  "/bubbles-homepage.png",
  "/apps.png",
];

function HeroImageRotatorLeft() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Initial fade-in delay
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImagesLeft.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isReady]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mb-4 -ml-6 md:-mb-8 md:-ml-14 lg:-mb-10 lg:-ml-16 z-0 opacity-25 md:opacity-35">
        <Image src={heroImagesLeft[0]} alt="" fill className="object-contain object-bottom" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mb-4 -ml-6 md:-mb-8 md:-ml-14 lg:-mb-10 lg:-ml-16 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -20, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 opacity-25 md:opacity-35"
        >
          <Image src={heroImagesLeft[currentIndex]} alt="" fill className="object-contain object-bottom" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function HeroImageRotatorRight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Initial fade-in delay (offset from left rotator)
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    // Offset timing so they don't sync up
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImagesRight.length);
      }, 5000);
      return () => clearInterval(interval);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [isReady]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute top-0 right-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mt-2 -mr-6 md:-mt-8 md:-mr-14 lg:-mt-10 lg:-mr-16 z-0 opacity-25 md:opacity-35">
        <Image src={heroImagesRight[0]} alt="" fill className="object-contain object-top" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute top-0 right-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mt-2 -mr-6 md:-mt-8 md:-mr-14 lg:-mt-10 lg:-mr-16 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 opacity-25 md:opacity-35"
        >
          <Image src={heroImagesRight[currentIndex]} alt="" fill className="object-contain object-top" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

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
    <div className="relative overflow-hidden h-14 bg-gradient-to-r from-[#2B3A44] via-[#2B3A44] to-[#2B3A44] flex items-center">
      <div
        className="flex items-center whitespace-nowrap animate-scroll"
        style={{
          animationDuration: isMobile ? '16s' : '17.25s'
        }}
      >
        <span className="px-4 text-xl tracking-[0.05em] text-[#F4F1EC] leading-none" style={{ fontFamily: "var(--font-libre-baskerville)" }}>{beltText} •</span>
        <span className="px-4 text-xl tracking-[0.05em] text-[#F4F1EC] leading-none" style={{ fontFamily: "var(--font-libre-baskerville)" }}>{beltText} •</span>
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
  image: string;
  cta: string;
}

function ServiceTile({ title, subhead, description, href, index, image, cta }: ServiceTileProps) {
  const isHouseWindows = image === "/house-windows.png";

  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className="h-full p-8 bg-[#F4F1EC] border border-transparent rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2B3A44] hover:shadow-lg hover:shadow-[#2B3A44]/10 flex flex-col text-center">
        <h3 className="text-2xl font-semibold text-[#1A1F24] mb-2">{title}</h3>
        <p className="text-sm font-medium text-[#2B3A44] mb-4">{subhead}</p>
        <p className="text-base text-[#5A6570] leading-relaxed flex-1">{description}</p>
        <div className="mt-2 flex justify-center">
          {isHouseWindows ? (
            <motion.div
              animate={{
                filter: [
                  "brightness(1)",
                  "brightness(1.15)",
                  "brightness(1)",
                  "brightness(1.1)",
                  "brightness(1)",
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.7, 1]
              }}
            >
              <Image src={image} alt="" width={288} height={288} className="w-72 h-72 object-contain" />
            </motion.div>
          ) : (
            <Image src={image} alt="" width={288} height={288} className="w-72 h-72 object-contain" />
          )}
        </div>
        <Link
          href={href}
          className="mt-4 inline-block px-6 py-3 bg-[#2B3A44] text-[#F4F1EC] font-medium rounded-full hover:bg-[#1A1F24] transition-colors duration-300"
        >
          {cta}
        </Link>
      </div>
    </motion.div>
  );
}

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function HelpCard({ icon, title, description }: HelpCardProps) {
  return (
    <div className="group p-6 bg-[#F4F1EC] border border-[#1A1F24]/30 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#F4F1EC] hover:shadow-lg hover:shadow-[#F4F1EC]/20">
      <div className="mb-4 text-[#2B3A44]">{icon}</div>
      <h3 className="text-xl font-semibold text-[#1A1F24] mb-3">{title}</h3>
      <p className="text-base text-[#5A6570] leading-relaxed">{description}</p>
    </div>
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
    <section className="pt-24 pb-12 bg-[#2B3A44]">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[32px] md:text-[40px] lg:text-[48px] font-normal text-[#F4F1EC] leading-[1.05] mb-12 text-center"
          style={{ fontFamily: "var(--font-libre-baskerville)" }}
        >
          How we help
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <HelpCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="pt-8 pb-24 bg-[#2B3A44]">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-[#F4F1EC] rounded-2xl px-8 py-12 md:px-16 md:py-16 max-w-2xl mx-auto"
          >
            <h2
              className="text-3xl md:text-4xl font-normal text-[#1A1F24] mb-4"
              style={{ fontFamily: "var(--font-libre-baskerville)" }}
            >
              Built for real business owners.
            </h2>
            <p className="text-base md:text-lg text-[#5A6570]">
              Designed around how customers actually behave.
            </p>
          </motion.div>
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
          <span>&copy; {year} The Shortlist Co</span>
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
      description: "Social is how people first come across your business. It introduces who you are, what you offer, and why you're worth paying attention to — before they ever click a link. We create and manage social that builds familiarity early, so when someone's ready to act, your business already feels like a known choice.",
      href: "/social",
      image: "/Door.png",
      cta: "Get seen first",
    },
    {
      title: "SmartPages",
      subhead: "One clear place customers trust.",
      description: "Once people want to learn more, they need a clear, reliable place to land. SmartPages bring everything about your business together — answers, hours, menus, links, updates, and booking — so customers don't have to hunt or second-guess. It's the framework that holds your business online, and makes it feel organized and real.",
      href: "/smartpages",
      image: "/house-frame.png",
      cta: "Build your foundation",
    },
    {
      title: "Websites & Apps",
      subhead: "When the problem needs more than a template.",
      description: "As your business grows, you need more than a single page. Custom websites and lightweight apps let you explain clearly, guide people through decisions, and handle real-world needs — ordering, booking, events, memberships, and more. This is where everything comes together and actually works, turning interest into action and keeping your business running smoothly.",
      href: "/digital",
      image: "/house-windows.png",
      cta: "Make it work",
    },
  ];

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 bg-[#F4F1EC] overflow-hidden">
        {/* Rotating hero images */}
        <HeroImageRotatorLeft />
        <HeroImageRotatorRight />

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
                className="text-[32px] md:text-[44px] lg:text-[52px] font-normal text-[#1A1F24] leading-[1.15] mb-6"
                style={{ fontFamily: "var(--font-libre-baskerville)" }}
              >
                We help small businesses show up like big ones.
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-[#5A6570] max-w-[720px] mx-auto"
              >
                Social media management, SmartPages, websites and custom apps built to make customers choose you.
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

// deploy trigger

