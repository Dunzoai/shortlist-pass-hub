'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Caveat } from 'next/font/google';
import {
  Monitor,
  Calendar,
  MessageCircle,
  BookOpen,
  Brain,
  Rss,
  Store,
  Bell,
  Smartphone,
  HelpCircle,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';

// =============================================================================
// FONTS
// =============================================================================

const caveat = Caveat({ subsets: ['latin'] });

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
      staggerChildren: 0.15,
    },
  },
};

// =============================================================================
// SECTION WRAPPER WITH SCROLL ANIMATION
// =============================================================================

function AnimatedSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
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
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const rebuttalRows = [
    { their: "Website", reality: "Residents don't chase links." },
    { their: "Facebook", reality: "Arguments. Key info buried." },
    { their: "Email", reality: "10% open rate. It's 2026." },
    { their: "Newsletter", reality: "Where does it even live?" },
  ];

  const gutPunchLines = [
    { text: "Community communication is spread out. It's messy.", className: "font-normal" },
    { text: "And it's YOUR fault.", className: "font-bold text-xl md:text-2xl" },
    { text: "...Even if it's not.", className: "text-sm md:text-base italic text-[#f5f5f5]/60" },
  ];

  const managementLines = [
    "We know — your management company has an app.",
    "No. They have a self-serving ChatGPT wrapper stuffed inside a chat widget.",
    "Cutting edge to them. That's 2024 stuff. Your community deserves better.",
  ];

  return (
    <section className="relative bg-[#1a1a1a] pt-24 pb-16 md:pt-32 md:pb-24 px-6">
      <div className="max-w-[700px] mx-auto">
        {/* Top Label */}
        <motion.p
          className="text-xs md:text-sm uppercase tracking-widest text-[#4ade80] font-medium mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          For HOA Boards & Community Managers
        </motion.p>

        {/* Two-Line Headline */}
        <div className="text-center mb-12">
          <motion.span
            className="block text-[2.5rem] md:text-[3.5rem] font-bold text-[#f5f5f5] leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Communication is the problem.
          </motion.span>
          <motion.span
            className="relative inline-block text-[3rem] md:text-[4.5rem] font-black text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We solved it.
            {/* Hand-drawn circle SVG */}
            <motion.svg
              className="absolute -inset-x-4 -inset-y-2 w-[calc(100%+2rem)] h-[calc(100%+1rem)]"
              viewBox="0 0 220 110"
              fill="none"
              preserveAspectRatio="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <motion.path
                d="M 10,55 C 20,15 60,5 110,8 C 160,11 200,20 210,55 C 220,90 180,102 110,105 C 40,108 5,95 10,55"
                stroke="#4ade80"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.span>
        </div>

        {/* Two-Column Rebuttal Section */}
        <div className="max-w-[680px] mx-auto mt-12 mb-8">
          {/* Headers */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p className="text-xs uppercase tracking-widest text-[#6b7280] font-medium">
              Their way
            </p>
            <p className="text-xs uppercase tracking-widest text-[#4ade80] font-medium text-right md:text-left">
              Reality
            </p>
          </div>

          {/* Rows */}
          <div className="space-y-4">
            {rebuttalRows.map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                <motion.p
                  className="text-[1.1rem] text-[#6b7280]"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 * index }}
                >
                  {row.their}
                </motion.p>
                <motion.p
                  className={`text-[1.3rem] text-[#4ade80] text-right md:text-left ${caveat.className}`}
                  style={{ transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' }}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 * index }}
                >
                  {row.reality}
                </motion.p>
              </div>
            ))}
          </div>
        </div>

        {/* Mint Green Divider */}
        <motion.div
          className="w-16 h-0.5 bg-[#4ade80] mx-auto mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.6 }}
        />

        {/* Gut Punch Block — slide in from RIGHT */}
        <div className="mb-6 text-left md:text-center">
          {gutPunchLines.map((line, index) => (
            <motion.p
              key={index}
              className={`text-[#f5f5f5] mb-3 ${line.className}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 * index }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        {/* Truth line */}
        <motion.p
          className="text-[#f5f5f5] mb-6 text-left md:text-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
        >
          The truth is you can't communicate every place for everybody.
        </motion.p>

        {/* Strikethrough correction line */}
        <motion.p
          className="text-[#f5f5f5] mb-12 text-left md:text-center text-lg md:text-xl"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
        >
          So we built an{" "}
          <span
            className="font-normal"
            style={{
              color: '#d1d5db',
              textDecoration: 'line-through',
              textDecorationColor: '#ef4444',
              textDecorationThickness: '3px'
            }}
          >app</span>{" "}
          <span className="font-bold text-[#4ade80]">digital assistant.</span>
        </motion.p>

        {/* Accent Statement */}
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#4ade80] mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          One app. One place. Your entire community.
        </motion.p>

        {/* Management Company Callout Block — slide in from LEFT */}
        <div className="mb-6 text-left md:text-center">
          {managementLines.map((line, index) => (
            <motion.p
              key={index}
              className="text-[#f5f5f5] mb-3"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 * index }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Bold statement */}
        <motion.p
          className="text-xl md:text-2xl font-bold text-[#f5f5f5] mb-4 text-left md:text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
        >
          We built the 24/7 digital board member that knows more than your president.
        </motion.p>

        {/* Apology line */}
        <motion.p
          className="text-sm md:text-base italic text-[#f5f5f5]/60 mb-6 text-left md:text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
        >
          Sorry if you're reading this, Pres. It's true.
        </motion.p>

        {/* Sally paragraph */}
        <motion.p
          className="text-[#f5f5f5] mb-14 text-left md:text-center leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.3 }}
        >
          Any data your community has gets answered instantly via chat. Sally from South Street sitting in bed at 2am gets the exact color she's allowed to paint her door. No texts. No emails. No board meeting required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
        >
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#4ade80] text-[#1a1a1a] font-semibold text-base hover:bg-[#3fcf70] transition-colors"
          >
            Get your community on the network
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-[#4ade80] text-[#4ade80] font-semibold text-base hover:bg-[#4ade80]/10 transition-colors"
          >
            See how it works
          </button>
        </motion.div>
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
    { icon: MessageCircle, label: "Ask Anything. Get Answers." },
    { icon: BookOpen, label: "Newsletters. Always There." },
  ];

  return (
    <AnimatedSection className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Phone Frame */}
        <div className="flex justify-center mb-12">
          <div className="relative w-[240px] md:w-[280px] h-[480px] md:h-[560px] rounded-[32px] md:rounded-[40px] border-2 border-[#4ade80] bg-[#111111] flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-12 h-12 md:w-16 md:h-16 text-[#4ade80] mx-auto mb-4" />
              <p className="text-sm text-[#4ade80] font-medium px-4">
                Live demo coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Feature Labels */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <feature.icon className="w-5 h-5 text-[#4ade80]" />
              <span className="text-sm md:text-base font-semibold text-[#f5f5f5]">
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
// SECTION 3 - FEATURES
// =============================================================================

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      headline: "An assistant that actually knows your community",
      description: "Upload your bylaws, rules, and documents by scanning, copy-pasting, or typing. A resident can ask what color they're allowed to paint their door at 2am from bed and get the exact answer. No board member woken up. No thread of 34 replies.",
    },
    {
      icon: Rss,
      headline: "An Instagram-style feed for your community",
      description: "Every event, announcement, and newsletter lives in a scrollable feed that residents actually check. Not buried in an inbox. Not lost in a Facebook thread. Right there, always available, always current.",
    },
    {
      icon: Store,
      headline: "Neighbors hiring neighbors",
      description: "Resident-owned businesses get their own verified listing inside your community app. Neighbors can tap in, ask questions 24/7, book appointments, place orders — without ever leaving your community. Local commerce that stays local.",
    },
    {
      icon: Bell,
      headline: "Push notifications that actually land",
      description: "Important memo? Gate closure? Hurricane prep? Send a push notification and it hits their phone — where they spend 70% of their day. Not their inbox. Not a Facebook group. Their home screen.",
    },
    {
      icon: Smartphone,
      headline: "A PWA — not another app to download",
      description: "Older residents who refuse to download apps open your branded website and get the full experience. Tech-savvy residents add it to their home screen like a native app. Everyone gets it. Nobody gets left out.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="features" className="bg-[#f5f5f5] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Everything your community needs. Nothing they have to dig for.
        </motion.h2>

        <div className="space-y-16 md:space-y-20">
          {features.map((feature, index) => {
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#4ade80]/15 flex items-center justify-center">
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-[#4ade80]" />
                  </div>
                </div>

                {/* Text */}
                <div className={`text-center md:text-left ${isEven ? 'md:text-right' : ''}`}>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-3">
                    {feature.headline}
                  </h3>
                  <p className="text-base md:text-lg text-[#1a1a1a]/70 leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 4 - SOCIAL PROOF
// =============================================================================

function SocialProofSection() {
  const stats = [
    { number: "24/7", label: "Board assistant availability" },
    { number: "2,000+", label: "Avg. homes per community" },
    { number: "0", label: "App store downloads required" },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Quote */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-6xl md:text-8xl text-[#4ade80] font-serif leading-none block">
            "
          </span>
          <p className="text-lg md:text-2xl text-[#f5f5f5] italic leading-relaxed max-w-[600px] mx-auto mb-6 -mt-4 md:-mt-6">
            Residents started getting answers the same day we went live. The board finally stopped getting texts at night.
          </p>
          <p className="text-sm md:text-base text-[#4ade80]">
            — A Grand Strand community, active on the network
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={fadeInUp}
            >
              <p className="text-4xl md:text-5xl font-bold text-[#4ade80] mb-2">
                {stat.number}
              </p>
              <p className="text-sm md:text-base text-[#f5f5f5]/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5 - OBJECTION BLOCK
// =============================================================================

function ObjectionSection() {
  const objections = [
    {
      question: "Our management company already has an app.",
      answer: "Their app serves them, not you. It's designed to protect their contract, not your residents. Ours is built for the community you were elected to serve.",
    },
    {
      question: "Is this expensive?",
      answer: "It's free for your community. The businesses and vendors in your network cover the cost. You bring the residents. We handle the rest.",
    },
    {
      question: "Our residents won't use it.",
      answer: "They already use their phones for everything. You're just giving them one place that works instead of seven that don't.",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#f5f5f5] py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          We know what you're thinking.
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {objections.map((obj, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm"
              variants={fadeInUp}
            >
              <HelpCircle className="w-6 h-6 text-[#4ade80] mb-4" />
              <p className="text-base md:text-lg font-bold text-[#1a1a1a] mb-3">
                {obj.question}
              </p>
              <p className="text-sm md:text-base text-[#1a1a1a]/70 leading-relaxed">
                {obj.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 6 - CTA / CONTACT FORM
// =============================================================================

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // TODO: wire up form submission to Supabase or email

  return (
    <section ref={ref} id="contact" className="bg-[#1a1a1a] py-16 md:py-24 px-6">
      <div className="max-w-[480px] mx-auto text-center">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-[#f5f5f5] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Get your community on the network.
        </motion.h2>

        <motion.p
          className="text-base md:text-lg text-[#f5f5f5]/70 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Free to join. No contracts. No management company approval needed. Just a better experience for your residents starting this week.
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
            placeholder="Your name"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="text"
            placeholder="Community name"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <input
            type="text"
            placeholder="Approximate number of homes"
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors"
          />
          <textarea
            placeholder="Anything you want us to know (optional)"
            rows={4}
            className="w-full px-5 py-4 rounded-lg bg-[#2a2a2a] border border-[#3a3a3a] text-[#f5f5f5] placeholder-[#f5f5f5]/40 focus:outline-none focus:border-[#4ade80] transition-colors resize-none"
          />
          <button
            type="submit"
            className="w-full py-4 rounded-lg bg-[#4ade80] text-[#1a1a1a] font-bold text-base hover:bg-[#3fcf70] transition-colors"
          >
            Let's talk — we'll reach out within 24 hours
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
  { icon: Mail, href: '#', label: 'Email' },
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
      <FeaturesSection />
      <SocialProofSection />
      <ObjectionSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
