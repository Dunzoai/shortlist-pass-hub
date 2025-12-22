"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";

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

function HeroVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      {/* Ambient brass glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.06, 0.08, 0.06], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-[#B08D57] rounded-full blur-3xl"
      />

      {/* Light sweep */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "100%", opacity: [0, 0.03, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
      />
    </div>
  );
}

function ScrollingBelt() {
  const beltText = "Posts that get seen • Pages that explain things • Websites that convert • Apps built to solve real problems • Content that sounds like you • Custom builds, not templates • Fewer missed customers";

  return (
    <div className="border-t border-b border-white/[0.08] bg-[#0B1220] h-16 overflow-hidden">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="flex items-center h-full whitespace-nowrap"
      >
        {/* Duplicate for seamless loop */}
        <span className="text-[15px] font-medium tracking-[0.06em] text-[#A9B4C4]/65 px-4">
          {beltText} • {beltText}
        </span>
      </motion.div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  oneLiner: string;
  bullets: string[];
  href: string;
  index: number;
}

function FeatureCard({ title, oneLiner, bullets, href, index }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={href} className="group block h-full">
        <div className="h-full p-6 bg-[#0F1A2B] border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57]/30 hover:shadow-lg hover:shadow-[#B08D57]/5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-semibold text-[#F4F6FA]">{title}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-[#B08D57] transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <p className="text-base text-[#A9B4C4] mb-4">{oneLiner}</p>
          <ul className="space-y-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-sm text-[#A9B4C4]">
                <span className="w-1 h-1 rounded-full bg-[#B08D57]" />
                {bullet}
              </li>
            ))}
          </ul>
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
  const features = [
    {
      title: "Social",
      oneLiner: "Stay visible without sounding generic.",
      bullets: ["Posts, reels, stories", "Managed by real people"],
      href: "/social",
    },
    {
      title: "SmartPages",
      oneLiner: "One clear destination for your business.",
      bullets: ["No link chasing", "No confusion"],
      href: "/smartpages",
    },
    {
      title: "Websites & Apps",
      oneLiner: "When the problem needs more than a template.",
      bullets: ["Custom websites", "Purpose-built apps"],
      href: "/digital",
    },
  ];

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                variants={fadeUpVariant}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold text-[#F4F6FA] leading-[1.1] mb-6"
              >
                Small business tools <br className="hidden lg:block" />that actually get used.
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-[#A9B4C4] mb-8 max-w-[520px]"
              >
                We build systems, apps, and digital experiences that make it easier for customers to understand, decide, and take action — without getting lost or distracted.
              </motion.p>
              <motion.div
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="#choose-lane"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-colors duration-300"
                >
                  See how we help
                </Link>
                <Link
                  href="/digital"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-white/10 text-[#F4F6FA] rounded-full hover:border-[#B08D57]/50 hover:text-[#B08D57] transition-all duration-300"
                >
                  View our work
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Visual */}
            <div className="flex justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* Scrolling Belt */}
      <ScrollingBelt />

      {/* Choose Your Lane Section */}
      <section id="choose-lane" className="py-32 border-t border-white/10">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-semibold text-[#F4F6FA] text-center mb-16"
          >
            Choose your lane
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
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
