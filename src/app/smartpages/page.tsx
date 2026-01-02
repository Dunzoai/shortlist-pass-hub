'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
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
      <div className="absolute left-[5%] md:left-[10%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#F4F1EC]/30 rounded-full blur-3xl" />
      {/* Right glow - icons exiting/sending to customers */}
      <div className="absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#F4F1EC]/30 rounded-full blur-3xl" />

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
      <span className={`text-[10px] md:text-xs ${isHighlighted ? 'text-black font-medium' : 'text-neutral-300'}`}>
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
          : 'bg-neutral-900/80'
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
        <div className={`text-[9px] ${isHighlighted ? 'text-[#5A6570]' : 'text-neutral-400'}`}>
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
    <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[320px] h-[440px] md:h-[475px] mx-auto rounded-3xl bg-[#333333] border border-white/10 shadow-[0_0_60px_rgba(251,191,36,0.15)] z-10 flex flex-col overflow-hidden">
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
        <p className="text-[9px] md:text-[10px] text-neutral-400 text-center mt-0.5">
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
        <div className="inline-flex rounded-full bg-neutral-900/80 p-0.5">
          <button
            onClick={() => { setMode('chat'); setVisibleMessages(0); }}
            className={`px-2.5 py-0.5 text-[9px] md:text-[10px] font-medium rounded-full transition-colors ${
              mode === 'chat'
                ? 'bg-[#F4F1EC] text-neutral-900'
                : 'text-neutral-300'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('links')}
            className={`px-2.5 py-0.5 text-[9px] md:text-[10px] font-medium rounded-full transition-colors ${
              mode === 'links'
                ? 'bg-[#F4F1EC] text-neutral-900'
                : 'text-neutral-300'
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
        <div className="flex items-center gap-1.5 rounded-full bg-neutral-900/80 px-2.5 py-1">
          <span className="flex-1 text-[9px] md:text-[10px] text-neutral-400">
            Ask Shorty anything…
          </span>
          <button className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-[#F4F1EC] shadow-md">
            <ArrowRightIcon className="w-2.5 h-2.5 md:w-3 md:h-3 text-neutral-900" />
          </button>
        </div>
      </div>

      {/* Suggestion chips - only in chat mode */}
      {mode === 'chat' && (
        <div className="px-2.5 pb-2.5 flex flex-wrap justify-center gap-1">
          <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-white/5 text-neutral-300 border border-white/10">
            What do you offer?
          </span>
          <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-white/5 text-neutral-300 border border-white/10">
            Hours & location?
          </span>
          <span className="px-1.5 py-0.5 text-[8px] rounded-full bg-white/5 text-neutral-300 border border-white/10">
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

// =============================================================================
// SMARTPAGE CAROUSEL DATA
// =============================================================================

const smartPageCards = [
  {
    name: "Nito's Empanadas",
    type: "Food Truck",
    description: "Quick ordering, menu questions, locations, hours — handled instantly while they're on the move.",
    icon: "/nitos_app.png",
    url: "https://nitos.shortlistpass.com",
  },
  {
    name: "Palmetto Taps",
    type: "Self-Serve Taproom",
    description: "Tap lists, events, hours, directions, and updates — all in one place, always current.",
    icon: "/palmetto_taps_app.png",
    url: "https://palmettotaps.shortlistpass.com",
  },
  {
    name: "Honey Hair Studio",
    type: "Beauty Salon",
    description: "Services, pricing, policies, booking links, and reminders — without missed messages or follow-ups.",
    icon: "/honey_app.png",
    url: "https://honeyhairstudio.shortlistpass.com",
  },
  {
    name: "The Shortlist Assistant",
    type: "Your Business HQ",
    description: "This is the engine behind every SmartPage — trained once, working everywhere your customers interact.",
    icon: "/shorty_app.png",
    url: "https://shorty.shortlistpass.com",
  },
];

// =============================================================================
// APP CAROUSEL SECTION
// =============================================================================

function AppCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll and update active card
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(containerCenter - cardCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 100);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    const container = scrollContainerRef.current;
    if (card && container) {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (cardRect.left - containerRect.left) - (containerRect.width / 2) + (cardRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#333333] py-16 md:py-20 px-4 overflow-hidden">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#F4F1EC] font-normal leading-tight"
          style={{ fontFamily: "var(--font-libre-baskerville)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Your business. Installed like an app.
        </motion.h2>
        <motion.p
          className="mt-5 md:mt-6 text-base md:text-lg text-[#F4F1EC]/70 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          What used to be reserved for big brands is now yours.<br />
          Customers add your SmartPage to their home screen for instant access — no links to remember, no searching, no friction.
        </motion.p>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Left spacer for centering first card */}
        <div className="shrink-0 w-[calc(50%-160px)] md:w-[calc(50%-200px)]" />

        {smartPageCards.map((card, index) => {
          const isActive = index === activeIndex;

          const cardContent = (
            <div
              className={`rounded-3xl p-6 md:p-8 h-[420px] md:h-[480px] flex flex-col transition-all duration-300 ${
                isActive
                  ? "bg-[#4a4a4a] border border-[#F4F1EC]/20 shadow-[0_0_40px_rgba(244,241,236,0.1)]"
                  : "bg-[#333333]/50 border border-[#F4F1EC]/10"
              }`}
            >
              {/* App Icon - zoomed in to crop the large transparent canvas */}
              <div className="relative w-44 h-44 md:w-56 md:h-56 mx-auto mb-4 md:mb-6 overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={card.icon}
                  alt={card.name}
                  width={320}
                  height={320}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3] md:scale-[3.5]"
                />
              </div>

              {/* Card Content */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className={`text-xl md:text-2xl font-semibold mb-1 transition-colors duration-300 ${
                  isActive ? "text-[#F4F1EC]" : "text-[#F4F1EC]/70"
                }`}>
                  {card.name}
                </h3>
                <p className={`text-sm uppercase tracking-wider mb-4 transition-colors duration-300 ${
                  isActive ? "text-[#F4F1EC]/60" : "text-[#F4F1EC]/40"
                }`}>
                  {card.type}
                </p>
                <p className={`text-sm md:text-base leading-relaxed flex-1 transition-colors duration-300 ${
                  isActive ? "text-[#F4F1EC]/80" : "text-[#F4F1EC]/50"
                }`}>
                  {card.description}
                </p>

                {/* Try button text - only visible on active card */}
                {isActive && (
                  <span className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-[#F4F1EC]/70">
                    Try this SmartPage
                    <ArrowRightIcon className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          );

          return (
            <div
              key={card.name}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="shrink-0 w-[320px] md:w-[400px] snap-center"
            >
              {isActive ? (
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                >
                  {cardContent}
                </a>
              ) : (
                <div
                  onClick={() => scrollToCard(index)}
                  className="cursor-pointer"
                >
                  {cardContent}
                </div>
              )}
            </div>
          );
        })}

        {/* Right spacer for centering last card */}
        <div className="shrink-0 w-[calc(50%-160px)] md:w-[calc(50%-200px)]" />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {smartPageCards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-[#F4F1EC] w-6"
                : "bg-[#F4F1EC]/30 hover:bg-[#F4F1EC]/50"
            }`}
          />
        ))}
      </div>

      {/* Micro-CTA with pulsing glow */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.a
          href="https://shorty.shortlistpass.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#F4F1EC]/70 hover:text-[#F4F1EC] transition-colors inline-flex items-center gap-2"
          animate={{
            textShadow: [
              "0 0 0px rgba(244, 241, 236, 0)",
              "0 0 20px rgba(244, 241, 236, 0.5)",
              "0 0 0px rgba(244, 241, 236, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Try a live SmartPage
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowRightIcon className="w-4 h-4" />
          </motion.span>
        </motion.a>
      </motion.div>

      {/* Push Notifications Showcase */}
      <div className="mt-16 md:mt-20 py-8 md:py-12 px-4 border-t border-[#F4F1EC]/10">
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
            <p className="mt-4 md:mt-6 text-base sm:text-lg text-neutral-400">
              No DMs to miss. No emails to skip. No feed to scroll past. <span className="text-[#F4F1EC] font-semibold">98% open rate.</span>
            </p>
          </motion.div>

          {/* Notification Cards - stacked with smooth animations */}
          <div className="flex flex-col gap-3 overflow-hidden">
            <motion.div
              className="bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-lg md:-rotate-1"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#333333]/20 border border-[#333333]/40 flex items-center justify-center text-lg flex-shrink-0">
                  🥟
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Nito&apos;s Empanadas</span>
                    <span className="text-neutral-500 text-xs">now</span>
                  </div>
                  <p className="text-neutral-300 text-sm mt-0.5 line-clamp-2">Find us in Waterbridge! 10% off empanadas 5-6pm</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-lg"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#333333]/20 border border-[#333333]/40 flex items-center justify-center text-lg flex-shrink-0">
                  💇
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Honey Hair Studio</span>
                    <span className="text-neutral-500 text-xs">2m ago</span>
                  </div>
                  <p className="text-neutral-300 text-sm mt-0.5 line-clamp-2">New appointment availability — tap to book</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-lg md:rotate-1"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#333333]/20 border border-[#333333]/40 flex items-center justify-center text-lg flex-shrink-0">
                  🍺
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Palmetto Taps</span>
                    <span className="text-neutral-500 text-xs">5m ago</span>
                  </div>
                  <p className="text-neutral-300 text-sm mt-0.5 line-clamp-2">Holiday party with food truck 12/20</p>
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
        <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="space-y-3">
            <div className="flex justify-start">
              <div className="bg-neutral-700 rounded-2xl px-4 py-2.5 text-sm text-white max-w-[80%]">
                What time do you close?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#F4F1EC] rounded-2xl px-4 py-2.5 text-sm text-[#222222] max-w-[80%]">
                We close at 9pm tonight! Come by before then.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-neutral-700 rounded-2xl px-4 py-2.5 text-sm text-white max-w-[80%]">
                Do you have parking?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#F4F1EC] rounded-2xl px-4 py-2.5 text-sm text-[#222222] max-w-[80%]">
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
        <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
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
            <p className="text-neutral-400 text-xs text-center">Added to Home Screen</p>
          </div>
        </div>
      );
    case 'banner':
      return (
        <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="space-y-4">
            {/* Announcement banner */}
            <div className="bg-[#F4F1EC] rounded-lg px-4 py-3 text-center">
              <p className="text-[#222222] font-semibold text-sm md:text-base">Holiday Hours: Closed Dec 25-26</p>
            </div>
            {/* Separator */}
            <div className="border-t border-white/10" />
            {/* Mini profile */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center">
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
                <p className="text-neutral-400 text-xs">Tap to chat with Shorty</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'links':
      return (
        <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="space-y-3">
            {['Website', 'Instagram', 'Order Online', 'Book Now'].map((label, i) => (
              <div key={i} className="bg-neutral-800 rounded-xl px-4 py-3.5 flex items-center justify-between">
                <span className="text-white text-sm md:text-base">{label}</span>
                <ArrowRightIcon className="w-4 h-4 text-[#F4F1EC]" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'qr':
      return (
        <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 w-full max-w-sm md:max-w-lg md:min-w-[400px] mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-48 h-48 md:w-56 md:h-56 shadow-[0_0_30px_rgba(229,168,51,0.3)] rounded-xl overflow-hidden">
              <Image
                src="/shorty_qr_code.png"
                alt="QR Code"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-neutral-400 text-sm text-center">Scan to visit your SmartPage</p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

// Alternating backgrounds for features section
const featureBackgrounds = [
  "bg-[#3a3a3a]",  // Feature 1
  "bg-[#333333]",  // Feature 2
  "bg-[#3a3a3a]",  // Feature 3
  "bg-[#333333]",  // Feature 4
  "bg-[#3a3a3a]",  // Feature 5
];

function FeaturesSection() {
  return (
    <section className="overflow-hidden">
      {/* Section header */}
      <div className="bg-[#3a3a3a] pt-16 md:pt-20 pb-8 md:pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Everything your business needs
          </motion.h2>
        </div>
      </div>

      {/* Individual feature cards with alternating backgrounds */}
      {features.map((feature, index) => (
        <div
          key={index}
          className={`${featureBackgrounds[index]} py-12 md:py-16 px-4`}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                feature.textLeft ? '' : 'md:[direction:rtl]'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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
                <div className="mt-3 md:mt-4 text-base sm:text-lg text-neutral-400">
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
          </div>
        </div>
      ))}
    </section>
  );
}

// =============================================================================
// RESPONSIBILITY TILES DATA (Ordered for strength)
// =============================================================================

const responsibilities = [
  {
    title: "Handles customer conversations for you",
    description: "Questions, details, directions, policies — delivered instantly, clearly, and the same way every time.",
  },
  {
    title: "Handles real business actions",
    description: "Bookings, reservations, orders, updates — confirmed, routed, and added to calendars for you and your customer.",
    isHighlighted: true,
  },
  {
    title: "Keeps your business organized behind the scenes",
    description: "All your information lives in one place and stays in sync everywhere it shows up. No scattered pages. No outdated details. No second-guessing.",
  },
  {
    title: "Makes it easy for customers to move forward",
    description: "Links, notifications, follow-ups, reminders — right when they're needed. Nothing to search for. Nothing to explain twice.",
  },
  {
    title: "Represents your business the way you would",
    description: "Trained on how you operate, what you offer, and what matters most. It knows what to say — and what not to say.",
  },
];

// =============================================================================
// RESPONSIBILITY TILE COMPONENT - Scroll-linked smooth animation
// =============================================================================

function ResponsibilityTile({
  title,
  description,
  index,
  isHighlighted = false
}: {
  title: string;
  description: string;
  index: number;
  isHighlighted?: boolean;
}) {
  const tileRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: tileRef,
    offset: ["start end", "end start"]
  });

  // Alternate slide direction: even from left, odd from right
  const slideDirection = index % 2 === 0 ? "-60%" : "60%";

  // Scroll-linked transforms for buttery smooth animation
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 1],
    [slideDirection, "0%", "0%", "0%"]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 1],
    [0, 1, 1, 1]
  );

  return (
    <motion.div
      ref={tileRef}
      className={`rounded-2xl px-5 py-4 md:px-6 md:py-5 cursor-pointer transition-colors duration-300 ${
        isHighlighted
          ? "bg-[#F4F1EC]/10 border-2 border-[#F4F1EC]/20"
          : "bg-[#F4F1EC]/5 border border-[#F4F1EC]/10"
      } hover:bg-[#F4F1EC]/15 hover:border-[#F4F1EC]/25`}
      style={{ x, opacity }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className={`text-[#F4F1EC] text-base md:text-lg mb-1.5 ${
        isHighlighted ? "font-semibold" : "font-medium"
      }`}>
        {title}
      </h3>
      <p className={`text-sm md:text-base leading-relaxed ${
        isHighlighted ? "text-[#F4F1EC]/70" : "text-[#F4F1EC]/60"
      }`}>
        {description}
      </p>
    </motion.div>
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
      {/* =========================================================================== */}
      {/* SECTION 1 — HERO (Above the fold) */}
      {/* =========================================================================== */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-12 md:pb-16 flex flex-col items-center px-4 bg-[#333333]">
        {/* H1 — Headline */}
        <div className="text-center max-w-3xl mb-4 md:mb-6 z-10 mt-10 md:mt-6 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-[#F4F1EC]" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
            The digital business assistant that replaces more than you think.
          </h1>
        </div>

        {/* H2 — Subhead */}
        <div className="text-center max-w-2xl mb-2 z-10 px-4">
          <p className="text-lg md:text-xl text-[#F4F1EC]/80 leading-relaxed">
            What you&apos;re looking at isn&apos;t a chatbot.<br />
            It&apos;s a trained part of your business, doing real work for you.
          </p>
        </div>

        {/* Supporting line (small, optional) */}
        <p className="text-sm text-[#F4F1EC]/50 z-10 mb-6 md:mb-8">
          Always on. Always consistent. Always working in your best interest.
        </p>

        {/* Modal container with Icon belt locked to modal center */}
        <div className="relative w-full flex justify-center">
          {/* Icon belt - locked to middle of modal */}
          <IconBelt />
          {/* Modal */}
          <ShortyModal />
        </div>
      </section>

      {/* =========================================================================== */}
      {/* SECTION 2 — HERE'S WHAT IT DOES (Bullet tiles) */}
      {/* =========================================================================== */}
      <section className="bg-[#333333] py-14 md:py-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#F4F1EC] leading-tight" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
              Here&apos;s what your Digital Assistant actually handles.
            </h2>
          </motion.div>

          {/* Responsibility Tiles */}
          <div className="space-y-3 md:space-y-4">
            {responsibilities.map((item, index) => (
              <ResponsibilityTile
                key={index}
                title={item.title}
                description={item.description}
                index={index}
                isHighlighted={item.isHighlighted}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================== */}
      {/* SECTION 3 — THE "FRONT COUNTER" MOMENT (Reinforcement) */}
      {/* =========================================================================== */}
      <section className="bg-[#2d2d2d] py-20 md:py-28 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            className="text-[#F4F1EC]/70 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Customers interact naturally — like they&apos;re talking to someone at the front counter.
          </motion.p>
          <motion.p
            className="mt-6 text-[#F4F1EC]/70 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Behind the scenes, everything stays organized, up to date, and easy to manage.
          </motion.p>

          {/* Power statement */}
          <motion.p
            className="mt-12 text-[#F4F1EC] text-xl md:text-2xl font-medium leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Always on.<br />
            Always consistent.<br />
            Always working in your best interest.
          </motion.p>

          {/* Footer line */}
          <motion.p
            className="mt-12 text-sm text-[#F4F1EC]/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Not a chatbot. Your business, handled.
          </motion.p>

          {/* CTA Button - moved here after Section 3 */}
          <motion.a
            href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
            className="mt-12 inline-flex items-center justify-center gap-2 rounded-full bg-[#F4F1EC] text-[#333333] font-semibold px-8 py-4 text-base md:text-lg shadow-lg hover:bg-white transition"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Get Your SmartPage — $25/mo
            <ArrowRightIcon className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      {/* Bottom part - Dark background like modal */}
      <AppCarouselSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* =========================================================================== */}
      {/* POSITIONING CLARIFIER */}
      {/* =========================================================================== */}

      {/* Positioning clarifier section */}
      <section className="bg-[#333333] py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Positioning Statement */}
          <div className="space-y-4 text-lg md:text-xl text-[#F4F1EC]/80 leading-relaxed">
            <p>
              <span className="font-semibold text-[#F4F1EC]">Social media is your introduction.</span>
            </p>
            <p>
              <span className="font-semibold text-[#F4F1EC]">SmartPages is your business assistant.</span>
            </p>
            <p>
              <span className="font-semibold text-[#F4F1EC]">Websites and apps legitimize your brand.</span>
            </p>
          </div>

          {/* Explanation */}
          <p className="mt-8 text-xl md:text-2xl font-normal text-[#F4F1EC]" style={{ fontFamily: "var(--font-libre-baskerville)" }}>
            SmartPages sit in the middle — turning interest into action.
          </p>

          {/* CTA Button */}
          <a
            href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#F4F1EC] px-8 py-3 text-sm sm:text-base font-semibold text-[#333333] shadow-lg hover:bg-[#F4F1EC]/90 transition"
          >
            Get started
          </a>
        </div>
      </section>

      {/* Floating CTA Bubble */}
      <a
        href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#333333] text-[#F4F1EC] font-semibold px-5 py-3 rounded-full shadow-lg z-50 text-center max-w-[250px] text-sm md:text-base transition-opacity duration-300 hover:bg-[#222222] ${
          showCTA ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        Get Your SmartPage<br className="md:hidden" />
        <span className="md:hidden"> </span>— $25/mo
      </a>
    </main>
  );
}
