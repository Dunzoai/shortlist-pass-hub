'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// =============================================================================
// ICON COMPONENTS
// =============================================================================

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// =============================================================================
// ICONS ARRAY
// =============================================================================

const icons = [
  InstagramIcon,
  GlobeIcon,
  MailIcon,
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  ShoppingBagIcon,
  CameraIcon,
  StarIcon,
  LinkIcon,
  HeartIcon,
  ChatBubbleIcon,
];

const scrollingIcons = [...icons, ...icons];

// App icons - 4 icons only (no Daisy's Dogs or Tango Mango)
const appIcons = [
  { src: '/nitos_app.png', alt: "Nito's Empanadas", url: 'https://nitos.shortlistpass.com' },
  { src: '/shorty_app.png', alt: 'Shorty demo', url: 'https://shorty.shortlistpass.com' },
  { src: '/palmetto_taps_app.png', alt: 'Palmetto Taps', url: 'https://palmettotaps.shortlistpass.com' },
  { src: '/honey_app.png', alt: 'Honey Hair Studio', url: 'https://honeyhairstudio.shortlistpass.com' },
];

// =============================================================================
// ICON BELT COMPONENT - Continuous flow left to right through modal
// =============================================================================

function IconBelt() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[200px] md:h-[240px] flex items-center justify-center overflow-visible z-0">
      {/* Left glow - icons entering/feeding info */}
      <div className="absolute left-[15%] md:left-[20%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#F4F1EC]/30 rounded-full blur-3xl" />
      {/* Right glow - icons exiting/sending to customers */}
      <div className="absolute right-[15%] md:right-[20%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#F4F1EC]/30 rounded-full blur-3xl" />

      {/* Full width continuous icon flow */}
      <motion.div
        className="flex items-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="flex gap-6 md:gap-10"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {scrollingIcons.map((Icon, index) => (
            <div
              key={`icon-${index}`}
              className="flex-shrink-0 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
            >
              <Icon className="h-7 w-7 md:h-10 md:w-10 text-[#F4F1EC]" />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// CHAT MESSAGES - Split into two phases for looping
// =============================================================================

type ChatMessage = {
  from: 'customer' | 'shorty';
  content: React.ReactNode;
};

// Phase 1: First 4 messages
const phase1Messages: ChatMessage[] = [
  { from: 'customer', content: 'What do you guys offer?' },
  {
    from: 'shorty',
    content: "I'm the AI assistant for this business — I can explain services, pricing, specials, and more.",
  },
  { from: 'customer', content: 'What are your hours?' },
  {
    from: 'shorty',
    content: (
      <>
        We&apos;re open Mon–Sat 11am–9pm — <span className="text-[#F4F1EC] underline">here&apos;s the map</span>.
      </>
    ),
  },
];

// Phase 2: Next 4 messages (2 questions, 2 answers)
const phase2Messages: ChatMessage[] = [
  { from: 'customer', content: 'Any deals this week?' },
  {
    from: 'shorty',
    content: "Yes! Happy hour 4-6pm and 20% off on Tuesdays.",
  },
  { from: 'customer', content: 'How do I book?' },
  {
    from: 'shorty',
    content: "Just tap the link below or ask me to reserve a spot for you!",
  },
];

// =============================================================================
// LINK TILE COMPONENT WITH HIGHLIGHT STATE
// =============================================================================

function LinkTile({
  label,
  icon: Icon,
  isHighlighted
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isHighlighted: boolean;
}) {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-3 px-2 transition-colors duration-300 ${
        isHighlighted
          ? 'bg-[#F4F1EC] border-[#F4F1EC]'
          : 'bg-white/5 border-white/10'
      }`}
      animate={isHighlighted ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-6 h-6 ${isHighlighted ? 'text-black' : 'text-[#F4F1EC]'}`}>
        <Icon className="w-full h-full" />
      </div>
      <span className={`text-[10px] md:text-xs ${isHighlighted ? 'text-black font-medium' : 'text-slate-300'}`}>
        {label}
      </span>
    </motion.div>
  );
}

// =============================================================================
// NOTIFICATION TILE WITH HIGHLIGHT STATE
// =============================================================================

function NotificationTile({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <motion.div
      className={`rounded-xl px-3 py-2.5 flex items-center gap-2 transition-colors duration-300 ${
        isHighlighted
          ? 'bg-[#F4F1EC]'
          : 'bg-slate-900/80'
      }`}
      animate={isHighlighted ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-5 h-5 ${isHighlighted ? 'text-black' : 'text-emerald-500'}`}>
        {isHighlighted ? <BellIcon className="w-full h-full" /> : <CheckIcon className="w-full h-full" />}
      </div>
      <div>
        <div className={`text-[11px] font-medium ${isHighlighted ? 'text-black' : 'text-white'}`}>
          Notifications On
        </div>
        <div className={`text-[9px] ${isHighlighted ? 'text-[#5A6570]' : 'text-slate-400'}`}>
          You&apos;ll get updates from us.
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SHORTY MODAL COMPONENT
// =============================================================================

type Mode = 'chat' | 'links';
type Phase = 1 | 2;

function ShortyModal() {
  const [mode, setMode] = useState<Mode>('chat');
  const [phase, setPhase] = useState<Phase>(1);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [highlightedLink, setHighlightedLink] = useState(-1);

  // Get current messages based on phase
  const currentMessages = phase === 1 ? phase1Messages : phase2Messages;

  // Chat animation - 15% slower (1000ms → 1150ms)
  useEffect(() => {
    if (mode !== 'chat') return;

    if (visibleMessages >= currentMessages.length) {
      // Chat finished, switch to links after 2 second pause
      const timeout = setTimeout(() => setMode('links'), 2000);
      return () => clearTimeout(timeout);
    }

    // Reveal next message
    const timeout = setTimeout(() => {
      setVisibleMessages((prev) => prev + 1);
    }, 1150);

    return () => clearTimeout(timeout);
  }, [mode, visibleMessages, currentMessages.length]);

  // Links highlight animation + loop to next phase
  useEffect(() => {
    if (mode !== 'links') {
      setHighlightedLink(-1);
      return;
    }

    // Animate through each link tile (0-4), then wait, then switch
    const totalItems = 5; // Website, Instagram, Facebook, Email, Notifications

    if (highlightedLink < totalItems) {
      // 25% slower (750ms → 940ms)
      const timeout = setTimeout(() => {
        setHighlightedLink((prev) => prev + 1);
      }, 940);
      return () => clearTimeout(timeout);
    } else {
      // All items highlighted, wait 3 seconds then switch to next phase
      const timeout = setTimeout(() => {
        setMode('chat');
        setVisibleMessages(0);
        setHighlightedLink(-1);
        // Toggle phase: 1 → 2 → 1 → 2...
        setPhase((prev) => (prev === 1 ? 2 : 1));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [mode, highlightedLink]);

  const displayedMessages = currentMessages.slice(0, visibleMessages);

  return (
    <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[320px] h-[440px] md:h-[475px] mx-auto rounded-3xl bg-[#2B3A44] border border-white/10 shadow-[0_0_60px_rgba(251,191,36,0.15)] z-10 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center pt-3 pb-2 px-3 border-b border-white/10">
        {/* Avatar */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F4F1EC]/15 overflow-hidden flex items-center justify-center mb-1.5">
          <Image
            src="/Shortlist_logo.png"
            alt="Shorty"
            fill
            className="object-contain"
          />
        </div>
        {/* Title */}
        <h2 className="text-xs md:text-sm font-semibold text-white">The Shortlist Co</h2>
        <p className="text-[9px] md:text-[10px] text-slate-400 text-center mt-0.5">
          Shorty handles the questions. You handle the business.
        </p>
        {/* Social icons */}
        <div className="flex gap-1.5 mt-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#F4F1EC]">
            <InstagramIcon className="w-2.5 h-2.5" />
          </div>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#F4F1EC]">
            <GlobeIcon className="w-2.5 h-2.5" />
          </div>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#F4F1EC]">
            <MailIcon className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>

      {/* Pill toggle */}
      <div className="flex justify-center py-1.5 border-b border-white/10">
        <div className="inline-flex rounded-full bg-slate-900/80 p-0.5">
          <button
            onClick={() => { setMode('chat'); setVisibleMessages(0); }}
            className={`px-2.5 py-0.5 text-[9px] md:text-[10px] font-medium rounded-full transition-colors ${
              mode === 'chat'
                ? 'bg-[#F4F1EC] text-slate-900'
                : 'text-slate-300'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('links')}
            className={`px-2.5 py-0.5 text-[9px] md:text-[10px] font-medium rounded-full transition-colors ${
              mode === 'links'
                ? 'bg-[#F4F1EC] text-slate-900'
                : 'text-slate-300'
            }`}
          >
            Links
          </button>
        </div>
      </div>

      {/* Content area - uniform height for both views */}
      <div className="h-[255px] md:h-[270px] px-2.5 py-2.5 overflow-hidden">
        {mode === 'chat' && (
          <div className="flex flex-col gap-1 text-[9px] md:text-[10px]">
            {displayedMessages.map((msg, idx) => {
              const isCustomer = msg.from === 'customer';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[90%] rounded-2xl px-2 py-1.5 leading-snug ${
                    isCustomer
                      ? 'self-start bg-white/10 text-white'
                      : 'self-end bg-[#F4F1EC] text-black'
                  }`}
                >
                  {msg.content}
                </motion.div>
              );
            })}
          </div>
        )}

        {mode === 'links' && (
          <motion.div
            key="links"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2"
          >
            <div className="grid grid-cols-2 gap-1.5">
              <LinkTile label="Website" icon={GlobeIcon} isHighlighted={highlightedLink === 0} />
              <LinkTile label="Instagram" icon={InstagramIcon} isHighlighted={highlightedLink === 1} />
              <LinkTile label="Facebook" icon={FacebookIcon} isHighlighted={highlightedLink === 2} />
              <LinkTile label="Email" icon={MailIcon} isHighlighted={highlightedLink === 3} />
            </div>

            <NotificationTile isHighlighted={highlightedLink === 4} />
          </motion.div>
        )}
      </div>

      {/* Input bar - always visible */}
      <div className="px-2.5 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1">
          <span className="flex-1 text-[9px] md:text-[10px] text-slate-400">
            Ask Shorty anything…
          </span>
          <button className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-[#F4F1EC] shadow-md">
            <ArrowRightIcon className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-900" />
          </button>
        </div>
      </div>

      {/* Suggestion chips - only in chat mode */}
      {mode === 'chat' && (
        <div className="px-2.5 pb-2.5 flex flex-wrap justify-center gap-1">
          <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-white/5 text-slate-300 border border-white/10">
            What do you offer?
          </span>
          <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-white/5 text-slate-300 border border-white/10">
            Hours & location?
          </span>
          <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-white/5 text-slate-300 border border-white/10">
            Why The Shortlist Co?
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// APP GRID SECTION - Static grid with staggered animations
// =============================================================================

function AppGridSection() {
  return (
    <section className="bg-[#2B3A44] py-10 md:py-14 px-4 overflow-x-hidden">
      {/* Header with animated highlighter on "Zero competition for attention" */}
      <div className="max-w-4xl mx-auto text-center mb-4 md:mb-5">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Your very own app.{' '}
          <span className="relative inline-block">
            <motion.span
              className="absolute inset-0 bg-[#2B3A44]/70 -skew-x-2 rounded-sm"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
            <span className="relative z-10">Zero competition for attention.</span>
          </span>
        </motion.h2>
        <motion.p
          className="mt-3 text-sm sm:text-base md:text-lg text-slate-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          No algorithm. No feed. Just you and your best customers.
        </motion.p>
      </div>

      {/* Try These Header */}
      <motion.p
        className="text-center text-base md:text-lg text-slate-300 mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Try these real live SmartPages
      </motion.p>

      {/* App Icons - 350px, desktop: one row, mobile: 2x2 */}
      {/* Mobile: 2x2 grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 w-fit mx-auto">
        {appIcons.map((app, index) => (
          <motion.a
            key={`mobile-${index}`}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
          >
            <Image
              src={app.src}
              alt={app.alt}
              width={350}
              height={350}
              style={{ width: '350px', height: '350px', minWidth: '350px', minHeight: '350px' }}
              className="rounded-2xl"
            />
            <span className="text-sm text-slate-400 mt-2">{app.alt}</span>
          </motion.a>
        ))}
      </div>

      {/* Desktop: single row */}
      <div className="hidden md:flex justify-center gap-8">
        {appIcons.map((app, index) => (
          <motion.a
            key={`desktop-${index}`}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
          >
            <Image
              src={app.src}
              alt={app.alt}
              width={350}
              height={350}
              style={{ width: '350px', height: '350px', minWidth: '350px', minHeight: '350px' }}
              className="rounded-2xl"
            />
            <span className="text-sm text-slate-400 mt-2">{app.alt}</span>
          </motion.a>
        ))}
      </div>

      {/* Scrolling Business Types - Yellow background with dark pills */}
      <div className="mt-12 md:mt-16 -mx-4 bg-[#2B3A44] py-8">
        <motion.p
          className="text-center text-lg sm:text-xl md:text-2xl text-black font-semibold mb-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The SmartPage assistant for every business
        </motion.p>

        <div className="overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: 'scrollText 25s linear infinite',
            }}
          >
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Food Trucks</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Breweries</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Coffee Shops</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Salons</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Barbershops</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Smoothie Bars</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Restaurants</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Boutiques</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Gyms</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Spas</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Food Vendors</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Bakeries</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Juice Bars</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Pet Groomers</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Tattoo Studios</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Yoga Studios</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Auto Shops</span>
                <span className="bg-gray-900 text-white rounded-full px-4 py-2 text-sm md:text-base font-medium">Florists</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Push Notifications Showcase */}
      <div className="mt-12 md:mt-16 py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Copy - Left on desktop, top on mobile */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold leading-tight">
              Send push notifications straight to their lock screen.
            </h3>
            <p className="mt-4 md:mt-6 text-base sm:text-lg text-slate-400">
              No DMs to miss. No emails to skip. No feed to scroll past. <span className="text-[#2B3A44] font-semibold">98% open rate.</span>
            </p>
          </motion.div>

          {/* Notification Cards - stacked on mobile, floating on desktop */}
          {/* Mobile: stacked cards with alternating slide directions */}
          <div className="md:hidden flex flex-col gap-3 overflow-hidden">
            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3A44]/20 border border-[#2B3A44]/40 flex items-center justify-center text-lg flex-shrink-0">
                  🥟
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Nito&apos;s Empanadas</span>
                    <span className="text-slate-500 text-xs">now</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5 line-clamp-2">Find us in Waterbridge! 10% off empanadas 5-6pm</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3A44]/20 border border-[#2B3A44]/40 flex items-center justify-center text-lg flex-shrink-0">
                  💇
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Honey Salon</span>
                    <span className="text-slate-500 text-xs">2m ago</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5 line-clamp-2">New appointment availability — tap to book</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3A44]/20 border border-[#2B3A44]/40 flex items-center justify-center text-lg flex-shrink-0">
                  🍺
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Palmetto Taps</span>
                    <span className="text-slate-500 text-xs">5m ago</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5 line-clamp-2">Holiday party with food truck 12/20 🎄</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop: stacked cards with alternating slide directions */}
          <div className="hidden md:flex flex-col gap-3 overflow-hidden">
            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform -rotate-1"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3A44]/20 border border-[#2B3A44]/40 flex items-center justify-center text-lg flex-shrink-0">
                  🥟
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Nito&apos;s Empanadas</span>
                    <span className="text-slate-500 text-xs">now</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5">Find us in Waterbridge! 10% off empanadas 5-6pm</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3A44]/20 border border-[#2B3A44]/40 flex items-center justify-center text-lg flex-shrink-0">
                  💇
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Honey Salon</span>
                    <span className="text-slate-500 text-xs">2m ago</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5">New appointment availability — tap to book</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform rotate-1"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3A44]/20 border border-[#2B3A44]/40 flex items-center justify-center text-lg flex-shrink-0">
                  🍺
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Palmetto Taps</span>
                    <span className="text-slate-500 text-xs">5m ago</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-0.5">Holiday party with food truck 12/20 🎄</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// FEATURES SECTION - Wispr-style alternating layout
// =============================================================================

const features = [
  {
    headline: "Customers get answers instantly",
    description: "Hours, menu, services, FAQs — customers ask and get clear answers immediately, even when you're busy or closed.",
    visual: "chat",
    textLeft: true,
  },
  {
    headline: "One tap and they're connected",
    description: "Customers add your SmartPage to their home screen instantly — no app store, no downloads, no friction.",
    visual: "app",
    textLeft: false,
  },
  {
    headline: "Important updates seen first",
    description: "Sales, closures, events — customers see what matters most the moment they open your page.",
    visual: "banner",
    textLeft: true,
  },
  {
    headline: "No more 'where do I click?' moments",
    description: "Every link in one place. Customers ask for what they need and get sent directly there.",
    visual: "links",
    textLeft: false,
  },
  {
    headline: "Get found anywhere you do business",
    description: "Place your SmartPage link anywhere customers interact with your business:",
    items: [
      "Business cards",
      "Receipts",
      "Proposals",
      "Link in bio",
      "QR codes"
    ],
    footer: "One scan and they're in.",
    visual: "qr",
    textLeft: true,
  },
];

function FeatureVisual({ type }: { type: string }) {
  switch (type) {
    case 'chat':
      return (
        <div className="bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-2xl px-4 py-2.5 text-sm text-white max-w-[80%]">
                What time do you close?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#2B3A44] rounded-2xl px-4 py-2.5 text-sm text-black max-w-[80%]">
                We close at 9pm tonight! Come by before then.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-2xl px-4 py-2.5 text-sm text-white max-w-[80%]">
                Do you have parking?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#2B3A44] rounded-2xl px-4 py-2.5 text-sm text-black max-w-[80%]">
                Yes! Free parking in the lot behind us.
              </div>
            </div>
          </div>
        </div>
      );
    case 'app':
      // Subtle fake app colors and patterns
      const fakeApps = [
        'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
        'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
        'bg-gradient-to-br from-green-500/20 to-green-600/20',
        'bg-gradient-to-br from-red-500/20 to-red-600/20',
        'bg-gradient-to-br from-pink-500/20 to-pink-600/20',
        'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
        'bg-gradient-to-br from-teal-500/20 to-teal-600/20',
      ];

      return (
        <div className="bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-4">
            {/* 2x4 grid of app icons */}
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                i === 7 ? (
                  // Bottom-right: Shortlist logo with gold glow
                  <div key={i} className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(229,168,51,0.5)]">
                    <Image
                      src="/Shortlist_logo.png"
                      alt="Shortlist"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  // Subtle fake app icons with gradients and blur
                  <div
                    key={i}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl backdrop-blur-sm border border-white/5 ${fakeApps[i]} opacity-40`}
                  />
                )
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/Shortlist_logo.png"
                  alt="Shortlist"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-white text-sm font-medium">Your Business</span>
            </div>
            <p className="text-slate-400 text-xs text-center">Added to Home Screen</p>
          </div>
        </div>
      );
    case 'banner':
      return (
        <div className="bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="space-y-4">
            {/* Yellow announcement banner */}
            <div className="bg-[#2B3A44] rounded-lg px-4 py-3 text-center">
              <p className="text-black font-semibold text-sm md:text-base">Holiday Hours: Closed Dec 25-26</p>
            </div>
            {/* Separator */}
            <div className="border-t border-white/10" />
            {/* Mini profile */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="relative w-8 h-8">
                  <Image
                    src="/Shortlist_logo.png"
                    alt="Your Business"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Your Business</p>
                <p className="text-slate-400 text-xs">Tap to chat with Shorty</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'links':
      return (
        <div className="bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="space-y-3">
            {['Website', 'Instagram', 'Order Online', 'Book Now'].map((label, i) => (
              <div key={i} className="bg-gray-800 rounded-xl px-4 py-3.5 flex items-center justify-between">
                <span className="text-white text-sm md:text-base">{label}</span>
                <ArrowRightIcon className="w-4 h-4 text-[#2B3A44]" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'qr':
      return (
        <div className="bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-48 h-48 md:w-56 md:h-56 shadow-[0_0_30px_rgba(229,168,51,0.3)] rounded-xl overflow-hidden">
              <Image
                src="/shorty_qr_code.png"
                alt="QR Code"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-slate-400 text-sm text-center">Scan to visit your SmartPage</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function FeaturesSection() {
  return (
    <section className="bg-[#2B3A44] py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Everything your business needs
        </motion.h2>

        <div className="space-y-12 md:space-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`grid md:grid-cols-2 gap-6 md:gap-8 items-center ${
                feature.textLeft ? '' : 'md:[direction:rtl]'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`text-center md:text-left ${feature.textLeft ? '' : 'md:[direction:ltr]'}`}>
                <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-semibold flex items-center gap-3 justify-center md:justify-start">
                  {index === 1 && (
                    <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                      <Image
                        src="/Shortlist_logo.png"
                        alt="Shortlist"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  {feature.headline}
                </h3>
                <div className="mt-3 md:mt-4 text-base sm:text-lg text-slate-400">
                  <p>{feature.description}</p>
                  {feature.items && (
                    <ul className="mt-3 space-y-1.5 list-disc list-inside">
                      {feature.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {feature.footer && (
                    <p className="mt-3">{feature.footer}</p>
                  )}
                </div>
              </div>
              <div className={feature.textLeft ? '' : 'md:[direction:ltr]'}>
                <FeatureVisual type={feature.visual} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ShortyLandingPage() {
  const [showCTA, setShowCTA] = useState(false);
  const finalCtaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;

      const pastHero = scrollY > 500;
      const nearBottom = scrollY + windowHeight > docHeight - 200;

      // Also hide when final CTA section is in view
      let inFinalCta = false;
      if (finalCtaRef.current) {
        const rect = finalCtaRef.current.getBoundingClientRect();
        inFinalCta = rect.top < windowHeight && rect.bottom > 0;
      }

      setShowCTA(pastHero && !nearBottom && !inFinalCta);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F1EC] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <section className="relative min-h-screen overflow-hidden pt-16 md:pt-24 pb-16 md:pb-20 flex flex-col items-center px-4 bg-[#2B3A44]">
        {/* Headline + Subheadline - above modal */}
        <div className="text-center max-w-2xl mb-6 md:mb-8 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-[#F4F1EC]" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
            What is a SmartPage?
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#F4F1EC]/80">
            Think of it as a lightweight website—an intelligent version of Linktree that keeps your most important links organized but chats with clients and answers any questions about your business.
          </p>
        </div>

        {/* Icon belt - behind modal */}
        <IconBelt />

        {/* Modal */}
        <ShortyModal />
      </section>

      {/* =========================================================================== */}
      {/* SECTION 2 - Let's Be Real (moved from bottom) */}
      {/* =========================================================================== */}

      {/* Why This Exists Section */}
      <section ref={finalCtaRef} className="bg-[#F4F1EC] py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Headline */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1F24]"
            style={{ fontFamily: "var(--font-libre-baskerville)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The problem isn&apos;t traffic. It&apos;s confusion.
          </motion.h2>

          {/* Body copy */}
          <motion.p
            className="text-lg md:text-xl text-[#5A6570] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Most customers don&apos;t leave because they&apos;re not interested — they leave because they can&apos;t quickly figure out what to do next.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-[#5A6570] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Hours, menus, links, booking, updates, FAQs — when this information is scattered, customers bounce.
          </motion.p>

          {/* Solution */}
          <motion.div
            className="py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-2xl md:text-3xl font-semibold text-[#1A1F24]">
              SmartPages fix that.
            </span>
          </motion.div>

          {/* Let's be real - Dark card */}
          <motion.div
            className="mt-8 md:mt-10 p-6 md:p-8 rounded-2xl bg-[#2B3A44] border border-[#2B3A44]/20 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl md:text-2xl font-normal text-[#F4F1EC] mb-4" style={{ fontFamily: "var(--font-libre-baskerville)" }}>Let&apos;s be real:</h3>

            <p className="text-[#F4F1EC]/80 text-base md:text-lg leading-relaxed mb-3">
              Your customers aren&apos;t reading through pages of content. Neither are you. Simply ask Shorty anything about your business, and your customer gets the answer instantly. 24/7.
            </p>

            <p className="text-[#F4F1EC]/80 text-base md:text-lg leading-relaxed">
              No more lost sales from click fatigue or missed opportunities. Perfect for every business that needs an online presence and real communication.
            </p>
          </motion.div>

          {/* Once they tap - BIG */}
          <motion.div
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-2xl md:text-3xl font-semibold text-[#1A1F24]">
              Once they tap, you&apos;re connected forever.
            </span>
          </motion.div>

          {/* CTA Button */}
          <motion.a
            href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#2B3A44] text-[#F4F1EC] font-semibold px-8 py-4 text-lg shadow-lg hover:bg-[#1A1F24] transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Get Your SmartPage — $25/mo
            <ArrowRightIcon className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      {/* Without vs With Comparison */}
      <section className="bg-[#2B3A44] py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Without SmartPages */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl md:text-2xl font-normal text-[#F4F1EC] mb-6" style={{ fontFamily: "var(--font-libre-baskerville)" }}>Without SmartPages</h3>
              <div className="space-y-3 text-[#F4F1EC]/60">
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>&quot;Check our bio&quot;</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>&quot;DM us&quot;</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>&quot;Link in link&quot;</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>Info spread across multiple platforms</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✕</span>
                  <span>Customers leave to figure it out later</span>
                </p>
              </div>
            </motion.div>

            {/* With SmartPages */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl md:text-2xl font-normal text-[#F4F1EC] mb-6" style={{ fontFamily: "var(--font-libre-baskerville)" }}>With SmartPages</h3>
              <div className="space-y-3 text-[#F4F1EC]">
                <p className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>One clear page</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Instant answers</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>All links in one place</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Clear actions</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Customers decide faster</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom part - Dark background like modal */}
      <AppGridSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* =========================================================================== */}
      {/* POSITIONING CLARIFIER */}
      {/* =========================================================================== */}

      {/* Positioning clarifier section */}
      <section className="bg-[#2B3A44] py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Positioning Statement */}
          <div className="space-y-4 text-lg md:text-xl text-[#F4F1EC]/80 leading-relaxed">
            <p>
              <span className="font-semibold text-[#F4F1EC]">Social gets attention.</span>
            </p>
            <p>
              <span className="font-semibold text-[#F4F1EC]">SmartPages give clarity.</span>
            </p>
            <p>
              <span className="font-semibold text-[#F4F1EC]">Websites go deeper when needed.</span>
            </p>
          </div>

          {/* Explanation */}
          <p className="mt-8 text-xl md:text-2xl font-normal text-[#F4F1EC]" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
            SmartPages sit in the middle — turning interest into action.
          </p>

          {/* CTA Button */}
          <a
            href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#F4F1EC] px-8 py-3 text-sm sm:text-base font-semibold text-[#2B3A44] shadow-lg hover:bg-[#F4F1EC]/90 transition"
          >
            Get started
          </a>
        </div>
      </section>

      {/* Floating CTA Bubble */}
      <a
        href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2B3A44] text-[#F4F1EC] font-semibold px-5 py-3 rounded-full shadow-lg z-50 text-center max-w-[250px] text-sm md:text-base transition-opacity duration-300 hover:bg-[#1A1F24] ${
          showCTA ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        Get Your SmartPage<br className="md:hidden" />
        <span className="md:hidden"> </span>— $25/mo
      </a>
    </main>
  );
}
