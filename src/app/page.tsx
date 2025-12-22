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
    <div className="relative">
      {/* Radial glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-15">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#B08D57] rounded-full" />
      </div>

      {/* Floating cards */}
      <div className="relative flex flex-col gap-3">
        {[
          { label: "Social", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
          { label: "SmartPages", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          { label: "Digital", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 px-4 py-3 bg-[#0F1A2B] border border-white/10 rounded-lg"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded bg-[#B08D57]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-[#B08D57]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#F4F6FA]">{card.label}</span>
          </motion.div>
        ))}
      </div>
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
  const chips = ["Food trucks", "Taprooms", "Salons", "Contractors", "Studios"];
  const proofBlocks = [
    { title: "Speed", desc: "Updates in minutes, not days." },
    { title: "Clarity", desc: "Customers stop DM'ing the same questions." },
  ];

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
            Built for operators who move fast.
          </motion.h2>

          {/* Chips */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-4 py-2 text-sm text-[#A9B4C4] bg-[#0F1A2B] border border-white/10 rounded-full"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          {/* Proof blocks */}
          <motion.div
            variants={fadeUpVariant}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto"
          >
            {proofBlocks.map((block) => (
              <div
                key={block.title}
                className="p-6 bg-[#0F1A2B] border border-white/10 rounded-xl text-left"
              >
                <h3 className="text-lg font-semibold text-[#B08D57] mb-2">{block.title}</h3>
                <p className="text-sm text-[#A9B4C4]">{block.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-8">
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
      oneLiner: "Consistent content that keeps you top-of-mind.",
      bullets: ["Posts + reels + stories", "Local-first strategy"],
      href: "/social",
    },
    {
      title: "SmartPages",
      oneLiner: "One place for customers to get answers fast.",
      bullets: ["App-style experience", "Links, updates, and info"],
      href: "/smartpages",
    },
    {
      title: "Websites & Apps",
      oneLiner: "When templates aren't enough.",
      bullets: ["Fast, modern sites", "Lightweight custom builds"],
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
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#F4F6FA] leading-tight mb-6"
              >
                Small business tools that actually get used.
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-[#A9B4C4] mb-8 max-w-lg"
              >
                Social, SmartPages, and custom builds — designed to keep customers engaged and moving.
              </motion.p>
              <motion.div
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/smartpages"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-colors duration-300"
                >
                  See SmartPages
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
            <div className="hidden lg:flex justify-end">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* Choose Your Lane Section */}
      <section className="py-24 border-t border-white/10">
        <Container>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-semibold text-[#F4F6FA] text-center mb-12"
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
