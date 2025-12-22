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
  const beltText = "FEWER MISSED CUSTOMERS • PAGES THAT EXPLAIN • POSTS THAT GET SEEN • WEBSITES THAT CONVERT • APPS BUILT FOR REAL PROBLEMS • LOOK LEGIT ONLINE • STAY TOP-OF-MIND";

  return (
    <div className="relative overflow-hidden h-16 bg-gradient-to-r from-[#B08D57] via-[#c9a46a] to-[#B08D57]">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="flex items-center h-full whitespace-nowrap"
      >
        {/* Duplicate for seamless loop */}
        <span className="text-[15px] font-extrabold tracking-[0.06em] text-[#0B1220] px-6 uppercase">
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
                Look legit. Get chosen. Stay busy.
              </motion.h1>
              <motion.p
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg lg:text-xl text-[#A9B4C4] mb-8 max-w-[720px] mx-auto"
              >
                We help local businesses show up clearly online — with websites, social, SmartPages, and custom tools that make it easier for customers to understand, decide, and take action.
              </motion.p>
              <motion.div
                variants={fadeUpVariant}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="mailto:hello@shortlistpass.com"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-colors duration-300"
                >
                  Get a demo
                </Link>
                <Link
                  href="/digital"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium border border-white/10 text-[#F4F6FA] rounded-full hover:border-[#B08D57]/50 hover:text-[#B08D57] transition-all duration-300"
                >
                  See our work
                </Link>
              </motion.div>
            </motion.div>
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
