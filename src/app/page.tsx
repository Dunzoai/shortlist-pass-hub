"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { useState, useEffect, useRef } from "react";

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

function HeroImageLeft() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[260px] md:h-[260px] lg:w-[360px] lg:h-[360px] -mb-8 -ml-2 md:-mb-12 md:-ml-6 lg:-mb-16 lg:-ml-8 z-0"
        style={{ opacity: 0.35 }}
      >
        <Image src="/bubbles-homepage.png" alt="" fill className="object-contain object-bottom" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[260px] md:h-[260px] lg:w-[360px] lg:h-[360px] -mb-8 -ml-2 md:-mb-12 md:-ml-6 lg:-mb-16 lg:-ml-8 z-0"
      style={{ opacity: 0.35 }}
      animate={{
        x: [0, 8, 0, -6, 0],
        y: [0, -8, 0, 6, 0],
      }}
      transition={{
        x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <Image src="/bubbles-homepage.png" alt="" fill className="object-contain object-bottom" />
    </motion.div>
  );
}

function HeroImageRight() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute top-0 right-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mt-2 -mr-6 md:-mt-8 md:-mr-14 lg:-mt-10 lg:-mr-16 z-0"
        style={{ opacity: 0.35 }}
      >
        <Image src="/instagram-post.png" alt="" fill className="object-contain object-top" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute top-0 right-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mt-2 -mr-6 md:-mt-8 md:-mr-14 lg:-mt-10 lg:-mr-16 z-0"
      style={{ opacity: 0.35 }}
      animate={{
        x: [0, -10, 0, 8, 0],
        y: [0, 6, 0, -8, 0],
      }}
      transition={{
        x: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 },
        y: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 },
      }}
    >
      <Image src="/instagram-post.png" alt="" fill className="object-contain object-top" />
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
  // Door (0) slides from left, House frame (1) from right, House windows (2) from left
  const slideFromLeft = index === 0 || index === 2;

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
        <div className="mt-2 flex justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: slideFromLeft ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
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
          </motion.div>
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
      <div className="mb-4 w-[120px] h-[120px] relative">{icon}</div>
      <h3 className="text-xl font-semibold text-[#1A1F24] mb-3">{title}</h3>
      <p className="text-base text-[#5A6570] leading-relaxed">{description}</p>
    </div>
  );
}

function HowWeHelp() {
  const items = [
    {
      icon: (
        <Image src="/light-vector.png" alt="" fill className="object-contain" />
      ),
      title: "Show up in the feed",
      description: "We create scroll-stopping social media content designed to get shown — helping your business stay visible, familiar, and top-of-mind when customers are deciding where to go."
    },
    {
      icon: (
        <Image src="/page.png" alt="" fill className="object-contain" />
      ),
      title: "One page that explains everything",
      description: "We build SmartPages that know your business inside and out — answers, links, hours, menus, booking — all in one place so customers get what they need instantly and feel confident choosing you."
    },
    {
      icon: (
        <Image src="/hand-tools.png" alt="" fill className="object-contain" />
      ),
      title: "Apps built for real problems",
      description: "When your business needs more than a website, we build simple custom tools — ordering, scheduling, internal systems — designed around how you actually operate."
    },
    {
      icon: (
        <Image src="/globe.png" alt="" fill className="object-contain" />
      ),
      title: "Websites that convert",
      description: "Fast, modern websites built to clearly explain what you do and push customers to take action — not cookie-cutter templates that look like everyone else."
    }
  ];

  const text = "How we help";
  const [displayedText, setDisplayedText] = useState("");
  const [startTyping, setStartTyping] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.3 });

  // Trigger typing when in view
  useEffect(() => {
    if (isInView && !startTyping) {
      setStartTyping(true);
    }
  }, [isInView, startTyping]);

  // Handle the actual typing animation
  useEffect(() => {
    if (!startTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [startTyping]);

  return (
    <section className="pt-24 pb-12 bg-[#2B3A44]">
      <Container>
        <h2
          ref={headingRef}
          className="text-[32px] md:text-[40px] lg:text-[48px] font-normal text-[#F4F1EC] leading-[1.05] mb-12 text-center min-h-[1.2em]"
          style={{ fontFamily: "var(--font-libre-baskerville)" }}
        >
          {displayedText}
          <motion.span
            className="inline-block w-[3px] h-[0.9em] bg-[#F4F1EC] ml-1 align-middle"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        </h2>

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
        {/* Floating hero images */}
        <HeroImageLeft />
        <HeroImageRight />

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
                className="text-[26px] sm:text-[32px] md:text-[44px] lg:text-[52px] font-normal text-[#1A1F24] leading-[1.15] mb-6"
                style={{ fontFamily: "var(--font-libre-baskerville)" }}
              >
                <span className="block">
                  <span className="inline-block">We</span>{" "}
                  <motion.span
                    className="inline-block"
                    initial={{ x: 12 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                  >
                    help
                  </motion.span>{" "}
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, scale: 1.5, y: -25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.9,
                      duration: 1.2,
                      type: "spring",
                      stiffness: 80,
                      damping: 10
                    }}
                  >
                    small
                  </motion.span>{" "}
                  <motion.span
                    className="inline-block"
                    initial={{ x: -12 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                  >
                    businesses
                  </motion.span>
                </span>
                <span className="block">
                  <span className="inline-block">show up</span>{" "}
                  <motion.span
                    className="inline-block"
                    initial={{ x: 8 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.4, duration: 0.4, ease: "easeOut" }}
                  >
                    like
                  </motion.span>{" "}
                  <motion.span
                    className="inline-block font-semibold"
                    initial={{ opacity: 0, scale: 0.5, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 1.5,
                      duration: 1.2,
                      type: "spring",
                      stiffness: 80,
                      damping: 10
                    }}
                  >
                    BIG
                  </motion.span>{" "}
                  <motion.span
                    className="inline-block"
                    initial={{ x: -8 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1.4, duration: 0.4, ease: "easeOut" }}
                  >
                    ones.
                  </motion.span>
                </span>
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

