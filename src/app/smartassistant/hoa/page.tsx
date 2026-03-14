'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Monitor,
  Calendar,
  MessageCircle,
  BookOpen,
  Mail,
  Users,
  FileText,
  MessageSquare,
  Bell,
  Building2,
  Instagram,
  Twitter,
  Linkedin,
  MailIcon,
} from 'lucide-react';

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// =============================================================================
// SECTION WRAPPER WITH SCROLL ANIMATION
// =============================================================================

function AnimatedSection({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

// =============================================================================
// SECTION 1 - HERO
// =============================================================================

function HeroSection() {
  return (
    <section className="relative bg-[#1a1a1a] pt-24 pb-16 md:pt-32 md:pb-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[#f5f5f5] leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Email gets ignored. Meetings get argued. Newsletters get lost.
        </motion.h1>

        <motion.p
          className="text-base md:text-xl text-[#f5f5f5]/70 max-w-[600px] mx-auto leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Your community deserves one place that works for everyone — and a board assistant that never clocks out.
        </motion.p>

        <motion.p
          className="text-sm md:text-lg font-medium text-[#4ade80]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          24/7. Every resident. Every question. Every announcement. Free.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 2 - PHONE MOCKUP
// =============================================================================

function PhoneMockupSection() {
  const features = [
    { icon: Calendar, label: "Events & Announcements" },
    { icon: MessageCircle, label: "Ask Anything, Get Answers" },
    { icon: BookOpen, label: "Newsletters & FAQs" },
  ];

  return (
    <AnimatedSection className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Phone Frame */}
        <div className="flex justify-center mb-12">
          <div
            className="relative w-[240px] md:w-[280px] h-[480px] md:h-[560px] rounded-[32px] md:rounded-[40px] border-2 border-[#4ade80] bg-[#111] flex items-center justify-center"
          >
            <div className="text-center">
              <Monitor className="w-12 h-12 md:w-16 md:h-16 text-[#4ade80] mx-auto mb-4" />
              <p className="text-sm md:text-base text-[#4ade80] font-medium px-4">
                App demo coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Feature Labels */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <feature.icon className="w-5 h-5 text-[#4ade80]" />
              <span className="text-sm md:text-base text-[#f5f5f5]/80">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// =============================================================================
// SECTION 3 - THE PROBLEM
// =============================================================================

function ProblemSection() {
  const problems = [
    {
      icon: Mail,
      headline: "Emails nobody opens",
      description: "You send it. Half the community never sees it. The other half says they never got it.",
    },
    {
      icon: Users,
      headline: "Meetings that go nowhere",
      description: "One person dominates. Important things get tabled. Nobody leaves with answers.",
    },
    {
      icon: FileText,
      headline: "Newsletters that get buried",
      description: "You spend hours writing it. Residents can't find it a week later. You write it again.",
    },
    {
      icon: MessageSquare,
      headline: "Group chats that explode",
      description: "One complaint turns into 47 replies. The board gets tagged at 11pm. Every time.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#f5f5f5] text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Sound familiar?
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-6"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <problem.icon className="w-8 h-8 text-[#4ade80] mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-[#f5f5f5] mb-2">
                {problem.headline}
              </h3>
              <p className="text-sm md:text-base text-[#f5f5f5]/60 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4 - THE SOLUTION
// =============================================================================

function SolutionSection() {
  const features = [
    {
      icon: MessageCircle,
      headline: "Residents get answers instantly",
      description: "Pool hours, gate codes, trash pickup, event details. Answered in seconds without anyone on the board lifting a finger.",
    },
    {
      icon: Bell,
      headline: "Announcements that actually land",
      description: "Post once. Every resident sees it. No more wondering if people got the message.",
    },
    {
      icon: Building2,
      headline: "Your Local Biz directory",
      description: "Resident-owned businesses live inside your community app. Neighbors hire neighbors. No searching required.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#f5f5f5] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          One place. Every resident. Every question. Every announcement.
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-[#1a1a1a]/70 text-center max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Shorty is your board's 24/7 assistant. It answers resident questions instantly, shares your announcements, posts your newsletters, and logs maintenance requests — so your board can focus on running the community, not answering the same question 40 times a week.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-full bg-[#4ade80]/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-[#4ade80]" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#1a1a1a] mb-3">
                {feature.headline}
              </h3>
              <p className="text-sm md:text-base text-[#1a1a1a]/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5 - SOCIAL PROOF
// =============================================================================

function SocialProofSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-[600px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Large quotation mark */}
          <span className="text-6xl md:text-8xl text-[#4ade80] font-serif leading-none">
            "
          </span>

          <p className="text-lg md:text-2xl text-[#f5f5f5] italic leading-relaxed mb-6 -mt-4 md:-mt-6">
            Residents started getting answers the same day we went live. The board finally stopped getting texts at night.
          </p>

          <p className="text-sm md:text-base text-[#4ade80]">
            — A Grand Strand community, active on the network
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 6 - CTA FORM
// =============================================================================

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // TODO: Wire up form submission

  return (
    <section ref={ref} className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-[500px] mx-auto text-center">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#f5f5f5] mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Get your community on the network.
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-[#f5f5f5]/70 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          It's free. No contracts. No management company approval needed.
        </motion.p>

        <motion.form
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Board member name"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="text"
            placeholder="Community name"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="text"
            placeholder="Approximate number of homes"
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <textarea
            placeholder="Anything you want us to know (optional)"
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors resize-none"
          />
          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-[#4ade80] text-[#1a1a1a] font-semibold text-base hover:bg-[#3fcf70] transition-colors"
          >
            Let's talk
          </button>
        </motion.form>
      </div>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '/smartassistant#solution' },
    { label: 'Pricing', href: '/smartassistant#pricing' },
    { label: 'Tool Shed', href: '/smartassistant#toolshed' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Support', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: MailIcon, href: '#', label: 'Email' },
];

function Footer() {
  return (
    <footer className="relative bg-[#1a1a1a] py-16 px-6 border-t border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/shortlist-logo-ivory-transparent.png"
                alt="Shortlist"
                width={24}
                height={24}
              />
              <span className="text-[#f5f5f5] font-semibold text-lg">
                Shortlist
              </span>
            </div>
            <p className="text-[#f5f5f5]/40 text-sm leading-relaxed">
              Your community, always connected
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#f5f5f5]/50 hover:text-[#f5f5f5] hover:bg-white/10 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-[#f5f5f5]/40 text-xs uppercase tracking-wider font-semibold mb-4">
                {category}
              </p>
              <div className="space-y-2.5">
                {links.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[#f5f5f5]/60 text-sm hover:text-[#f5f5f5] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[#f5f5f5]/30 text-xs">
            2026 Shortlist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function HOALandingPage() {
  // Hide the SmartPage chat widget on this page
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '#slp-widget-container { display: none !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <HeroSection />
      <PhoneMockupSection />
      <ProblemSection />
      <SolutionSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
}
