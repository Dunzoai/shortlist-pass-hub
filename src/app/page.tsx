"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Container } from "@/components/Container";
import { StoryStreetSection } from "@/components/StoryStreetSection";
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

interface HeroImageProps {
  scrollDrift: { x: number; y: number };
}

function HeroImageLeft({ scrollDrift }: HeroImageProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[260px] md:h-[260px] lg:w-[360px] lg:h-[360px] -mb-8 -ml-2 md:-mb-12 md:-ml-6 lg:-mb-16 lg:-ml-8 z-0"
        style={{ opacity: 0.45 }}
      >
        <Image src="/bubbles-homepage.png" alt="" fill className="object-contain object-bottom" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[260px] md:h-[260px] lg:w-[360px] lg:h-[360px] -mb-8 -ml-2 md:-mb-12 md:-ml-6 lg:-mb-16 lg:-ml-8 z-0"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 0.45,
        x: scrollDrift.x,
        scale: 1
      }}
      transition={{
        opacity: { delay: 1.8, duration: 0.5, ease: "easeOut" },
        x: { duration: 0.4, ease: "easeOut" },
        scale: { delay: 1.8, duration: 0.5, ease: "easeOut" },
      }}
    >
      {/* Inner div for continuous floating motion */}
      <motion.div
        className="w-full h-full"
        initial={{ y: 10 }}
        animate={{
          y: [scrollDrift.y, scrollDrift.y - 8, scrollDrift.y, scrollDrift.y + 6, scrollDrift.y],
          x: [0, 8, 0, -6, 0],
        }}
        transition={{
          y: { delay: 1.8, duration: 20, repeat: Infinity, ease: "easeInOut" },
          x: { delay: 1.8, duration: 20, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image src="/bubbles-homepage.png" alt="" fill className="object-contain object-bottom" />
      </motion.div>
    </motion.div>
  );
}

function HeroImageRight({ scrollDrift }: HeroImageProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute top-0 right-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mt-2 -mr-6 md:-mt-8 md:-mr-14 lg:-mt-10 lg:-mr-16 z-0"
        style={{ opacity: 0.28 }}
      >
        <Image src="/instagram-post.png" alt="" fill className="object-contain object-top" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute top-0 right-0 w-40 h-40 md:w-52 md:h-52 lg:w-72 lg:h-72 -mt-2 -mr-6 md:-mt-8 md:-mr-14 lg:-mt-10 lg:-mr-16 z-0"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 0.28,
        x: scrollDrift.x,
        scale: 1
      }}
      transition={{
        opacity: { delay: 2.2, duration: 0.5, ease: "easeOut" },
        x: { duration: 0.4, ease: "easeOut" },
        scale: { delay: 2.2, duration: 0.5, ease: "easeOut" },
      }}
    >
      {/* Inner div for continuous floating motion */}
      <motion.div
        className="w-full h-full"
        initial={{ y: -8 }}
        animate={{
          y: [scrollDrift.y, scrollDrift.y + 6, scrollDrift.y, scrollDrift.y - 8, scrollDrift.y],
          x: [0, -10, 0, 8, 0],
        }}
        transition={{
          y: { delay: 2.2, duration: 18, repeat: Infinity, ease: "easeInOut" },
          x: { delay: 2.2, duration: 18, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image src="/instagram-post.png" alt="" fill className="object-contain object-top" />
      </motion.div>
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
    <div className="relative overflow-hidden h-14 bg-gradient-to-r from-[#333333] via-[#333333] to-[#333333] flex items-center">
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
      <div className="h-full p-8 bg-[#F4F1EC] border border-transparent rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#333333] hover:shadow-lg hover:shadow-[#333333]/10 flex flex-col text-center">
        <h3 className="text-2xl font-semibold text-[#222222] mb-2">{title}</h3>
        <p className="text-sm font-medium text-[#333333] mb-4">{subhead}</p>
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
          className="mt-4 inline-block px-6 py-3 bg-[#333333] text-[#F4F1EC] font-medium rounded-full hover:bg-[#222222] transition-colors duration-300"
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
    <div className="group p-6 bg-[#F4F1EC] border border-[#222222]/30 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#F4F1EC] hover:shadow-lg hover:shadow-[#F4F1EC]/20">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#222222] mb-3">{title}</h3>
      <p className="text-base text-[#5A6570] leading-relaxed">{description}</p>
    </div>
  );
}

function HowWeHelp() {
  const items = [
    {
      icon: (
        <Image src="/light-vector.png" alt="" width={144} height={144} className="object-contain" />
      ),
      title: "Show up in the feed",
      description: "We create scroll-stopping social media content designed to get shown — helping your business stay visible, familiar, and top-of-mind when customers are deciding where to go."
    },
    {
      icon: (
        <Image src="/page.png" alt="" width={144} height={144} className="object-contain" />
      ),
      title: "One page that explains everything",
      description: "We build SmartPages that know your business inside and out — answers, links, hours, menus, booking — all in one place so customers get what they need instantly and feel confident choosing you."
    },
    {
      icon: (
        <Image src="/hand-tools.png" alt="" width={144} height={144} className="object-contain" />
      ),
      title: "Apps built for real problems",
      description: "When your business needs more than a website, we build simple custom tools — ordering, scheduling, internal systems — designed around how you actually operate."
    },
    {
      icon: (
        <Image src="/globe.png" alt="" width={144} height={144} className="object-contain" />
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
    <section className="pt-24 pb-12 bg-[#333333]">
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
    <section className="pt-8 pb-24 bg-[#333333]">
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
              className="text-3xl md:text-4xl font-normal text-[#222222] mb-4"
              style={{ fontFamily: "var(--font-libre-baskerville)" }}
            >
              Built for real business owners.
            </h2>
            <p className="text-base md:text-lg text-[#5A6570] mb-6">
              Designed around how customers actually behave.
            </p>
            <a
              href="mailto:hello@shortlistpass.com"
              className="inline-block px-6 py-3 bg-[#333333] text-[#F4F1EC] font-medium rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
            >
              Tell us your business needs
            </a>
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
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/shortlistpass"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#222222] transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <span>hello@shortlistpass.com</span>
          </div>
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

  // OPTION 5: Micro scroll interaction - one-time drift on first scroll
  const heroRef = useRef<HTMLElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollDriftLeft, setScrollDriftLeft] = useState({ x: 0, y: 0 });
  const [scrollDriftRight, setScrollDriftRight] = useState({ x: 0, y: 0 });
  const [subheadOpacity, setSubheadOpacity] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  // Toggle for showing old cards section
  const [showOldCards, setShowOldCards] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 20) {
        setHasScrolled(true);
        // Left elements drift left/down
        setScrollDriftLeft({ x: -8, y: 6 });
        // Right elements drift right/up
        setScrollDriftRight({ x: 8, y: -6 });
        // Subhead fades slightly
        setSubheadOpacity(0.92);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled, prefersReducedMotion]);

  // Listen for iframe resize messages from SmartPages
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Security: only accept messages from shortlistpass.com origins
      if (!e.origin.endsWith('shortlistpass.com')) return;

      if (!e.data || e.data.type !== "slp_embed_resize") return;

      // Validate height is a number
      if (typeof e.data.height !== 'number') return;

      const iframe = document.getElementById("slp-embed") as HTMLIFrameElement;
      if (!iframe) return;

      iframe.style.height = `${e.data.height}px`;
      iframe.style.transition = 'height 200ms ease';
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Send page context to SmartPages embed
  useEffect(() => {
    function sendContext() {
      const iframe = document.getElementById("slp-embed") as HTMLIFrameElement;
      if (!iframe) return;

      iframe.contentWindow?.postMessage(
        {
          type: "slp_context",
          payload: {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
          },
        },
        "https://hello.shortlistpass.com"
      );
    }

    sendContext();
  }, []);

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 bg-[#F4F1EC] overflow-hidden">
        {/* Floating hero images - OPTION 4: directional focus */}
        <HeroImageLeft scrollDrift={scrollDriftLeft} />
        <HeroImageRight scrollDrift={scrollDriftRight} />

        <Container>
          <div className="relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Headline - OPTION 2 & 3: appears first, BIG has visual weight */}
              <motion.h1
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[26px] sm:text-[32px] md:text-[44px] lg:text-[52px] font-normal text-[#222222] leading-[1.15] mb-6"
                style={{ fontFamily: "var(--font-libre-baskerville)" }}
              >
                <span className="block">
                  <span className="inline-block">We</span>{" "}
                  <span className="inline-block">help</span>{" "}
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, scale: 1.4, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.6,
                      duration: 0.8,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    small
                  </motion.span>{" "}
                  <span className="inline-block">businesses</span>
                </span>
                <span className="block">
                  <span className="inline-block">show up like</span>{" "}
                  <motion.span
                    className="inline-block font-semibold tracking-[-0.02em]"
                    style={{ color: "#1a1a1a", textShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
                    initial={{ opacity: 0, scale: 0.6, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 1.1,
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    BIG
                  </motion.span>{" "}
                  <span className="inline-block">ones.</span>
                </span>
              </motion.h1>
              {/* Subhead - OPTION 3 & 5: appears second, fades slightly on scroll */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: subheadOpacity, y: 0 }}
                transition={{
                  opacity: { delay: 0.3, duration: 0.5, ease: "easeOut" },
                  y: { delay: 0.3, duration: 0.5, ease: "easeOut" }
                }}
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

      {/* StoryStreet Section - with old cards revealed in place */}
      <StoryStreetSection
        showOldCards={showOldCards}
        onToggleOldCards={() => setShowOldCards(!showOldCards)}
        oldCardsContent={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceTile key={service.title} {...service} index={index} />
            ))}
          </div>
        }
      />

      {/* How We Help */}
      <HowWeHelp />

      {/* Proof Strip */}
      <ProofStrip />

      {/* Footer */}
      <Footer />

      {/* SmartPages embed */}
      <iframe
        id="slp-embed"
        src="https://hello.shortlistpass.com/embed"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(480px, 92vw)',
          height: '88px',
          border: 0,
          background: 'transparent',
          zIndex: 999999,
          pointerEvents: 'auto',
          transition: 'height 200ms ease',
        }}
      />
    </main>
  );
}

// deploy trigger

