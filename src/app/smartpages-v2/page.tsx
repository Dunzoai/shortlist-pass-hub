'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// =============================================================================
// SVG ICON COMPONENTS (no emoji anywhere)
// =============================================================================

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

// Industry icons — proper SVGs
function UtensilsIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function BeerIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
      <path d="M9 12v6" />
      <path d="M13 12v6" />
      <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" />
      <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    </svg>
  );
}

function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 4 5 7c0 2 .5 3.5 1 5 .8 2.5 1.5 5 2 8 .3 1.5 1 2 2 2s1.5-1 2-3c.5 2 1 3 2 3s1.7-.5 2-2c.5-3 1.2-5.5 2-8 .5-1.5 1-3 1-5 0-3-3-5-7-5z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M18 14l.7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14z" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h3" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

// =============================================================================
// TYPEWRITER HOOK
// =============================================================================

function useTypewriter(text: string, speed = 30, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
}

// =============================================================================
// SECTION 1: STICKY NAV
// =============================================================================

const navLinks = [
  { label: 'How It Works', href: '#solution' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Tool Shed', href: '#toolshed' },
];

function StickyNav() {
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < 80 || currentY < lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 h-[72px] md:h-[72px] flex items-center px-6 md:px-10"
        style={{ backgroundColor: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <Image src="/shortlist-logo-ivory-transparent.png" alt="Shortlist" width={28} height={28} />
            <span className="text-[#F5F5F5] font-semibold text-lg tracking-tight" style={{ fontFamily: 'var(--font-sans-inter)' }}>
              Shortlist
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#F5F5F5] text-[15px] font-medium hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'var(--font-sans-inter)' }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              className="bg-[#F4F1EC] text-[#1A1A1A] text-[15px] font-semibold px-6 py-2.5 rounded-full hover:bg-[#D9D5CF] transition-colors"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="#pricing"
              className="bg-[#F4F1EC] text-[#1A1A1A] text-sm font-semibold px-4 py-2 rounded-full"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
            >
              Start
            </a>
            <button onClick={() => setMobileOpen(true)} className="text-[#F5F5F5] p-1">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#1A1A1A] z-[70] p-8 flex flex-col gap-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button onClick={() => setMobileOpen(false)} className="self-end text-[#F5F5F5]">
                <XMarkIcon className="w-6 h-6" />
              </button>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#F5F5F5] text-xl font-medium"
                  style={{ fontFamily: 'var(--font-sans-inter)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-[#F4F1EC] text-[#1A1A1A] text-center font-semibold px-6 py-3 rounded-full"
                style={{ fontFamily: 'var(--font-sans-inter)' }}
              >
                Start Free Trial
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// =============================================================================
// SECTION 2: HERO — Phone Animation (native React, no video)
// =============================================================================

const HC = {
  phoneBg: '#1A1A1A',
  screen: '#1C1C1E',
  cardText: '#FFFFFF',
  cardSub: '#B0B0B0',
  customer: '#FFFFFF',
  customerText: '#1A1A1A',
  reply: '#2C2C30',
  replyText: '#E8E8EA',
  tabBg: '#3A3A3E',
  tabActive: '#FFFFFF',
  tabInactive: '#888',
  green: '#22C55E',
  greenTapped: 'rgba(34,197,94,0.35)',
  amber: '#F59E0B',
  blue: '#3B82F6',
};

const SOCIAL_ICON_PATHS = [
  'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01',
  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z',
  'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
];

const BTN_W = 240;
const BTN_HT = 44;
const BTN_RAD = 22;
const BTN_PERIM_VAL = 2 * (BTN_W - 2 * BTN_RAD) + 2 * (BTN_HT - 2 * BTN_RAD) + 2 * Math.PI * BTN_RAD;
const TRACE_LEN_VAL = BTN_PERIM_VAL * 0.25;

interface SceneConfig {
  name: string;
  tagline: string;
  logo: React.ReactNode;
  messages: { text: string; isCustomer: boolean; hasTyping: boolean }[];
  button: { label: string; color: string; tappedColor: string; icon: 'card' | 'calendar' | 'shield'; glowRgb: string };
  card: {
    title: string;
    iconType: 'check' | 'calendar' | 'shield';
    iconColor: string;
    rows: { label: string; value: string }[];
    linkText: string;
    linkIcon: 'pin' | 'calendar' | 'shield';
  };
}

const NitosLogo = () => (
  <img src="/nitos_logo.avif" alt="Nito's Empanadas" style={{ width: 80, height: 80, objectFit: 'contain' as const, marginTop: 6 }} />
);

const BarberLogoSvg = () => (
  <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #1A1A1A, #2C2C30)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', marginTop: 6 }}>
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" stroke={HC.amber} strokeWidth="1.8" />
      <circle cx="6" cy="18" r="3" stroke={HC.amber} strokeWidth="1.8" />
      <path d="M20 4L8.12 15.88" stroke={HC.amber} strokeWidth="1.8" />
      <path d="M14.47 14.48L20 20" stroke={HC.amber} strokeWidth="1.8" />
      <path d="M8.12 8.12L12 12" stroke={HC.amber} strokeWidth="1.8" />
    </svg>
  </div>
);

const DentalLogoSvg = () => (
  <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #1A1A1A, #2C2C30)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', marginTop: 6 }}>
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C9.5 2 7.5 3.5 6.5 5C5.5 6.5 5 8 5 10C5 12 5.5 13.5 6 15C6.5 16.5 7 18 7.5 20C7.8 21.2 8.5 22 9.5 22C10.5 22 11 21 11 20C11 19 11.5 18 12 18C12.5 18 13 19 13 20C13 21 13.5 22 14.5 22C15.5 22 16.2 21.2 16.5 20C17 18 17.5 16.5 18 15C18.5 13.5 19 12 19 10C19 8 18.5 6.5 17.5 5C16.5 3.5 14.5 2 12 2Z" stroke={HC.blue} strokeWidth="1.6" fill="none" />
      <path d="M9 8C9.5 9.5 10.5 10 12 10C13.5 10 14.5 9.5 15 8" stroke={HC.blue} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </div>
);

const SCENES: SceneConfig[] = [
  {
    name: "Nito's Empanadas",
    tagline: 'Best Empanadas in Town',
    logo: <NitosLogo />,
    messages: [
      { text: 'Can I order 3 steak and cheese empanadas?', isCustomer: true, hasTyping: false },
      { text: 'That qualifies for our 3 for $15 deal! Ready to order?', isCustomer: false, hasTyping: true },
    ],
    button: { label: 'Complete Payment – $15', color: HC.green, tappedColor: HC.greenTapped, icon: 'card', glowRgb: '34,197,94' },
    card: { title: 'Order Complete!', iconType: 'check', iconColor: HC.green, rows: [{ label: 'Item', value: '3 Steak & Cheese Empanadas' }, { label: 'Deal', value: '3 for $15' }, { label: 'Pickup', value: 'Ready in 15 min' }], linkText: 'Track Order Here', linkIcon: 'pin' },
  },
  {
    name: "Matteo's Barber Shop",
    tagline: 'Fresh Cuts. Clean Lines. Walk-In Vibes.',
    logo: <BarberLogoSvg />,
    messages: [
      { text: 'Can I book a haircut for Friday?', isCustomer: true, hasTyping: false },
      { text: 'We have an opening with Mario at 3pm. Does that work?', isCustomer: false, hasTyping: true },
      { text: "Yes I'll take it!", isCustomer: true, hasTyping: false },
    ],
    button: { label: 'Confirm Booking', color: HC.amber, tappedColor: 'rgba(245,158,11,0.35)', icon: 'calendar', glowRgb: '245,158,11' },
    card: { title: 'Booking Confirmed!', iconType: 'calendar', iconColor: HC.amber, rows: [{ label: 'Service', value: 'Haircut' }, { label: 'Barber', value: 'Mario' }, { label: 'Date', value: 'Friday at 3:00 PM' }], linkText: 'Add to Calendar', linkIcon: 'calendar' },
  },
  {
    name: 'Bright Smile Dental',
    tagline: 'Your Smile. Our Priority.',
    logo: <DentalLogoSvg />,
    messages: [
      { text: 'Do you take Aetna?', isCustomer: true, hasTyping: false },
      { text: 'Yes! We accept Aetna, Delta, Cigna, MetLife, and most PPO plans. Want me to verify your coverage?', isCustomer: false, hasTyping: true },
      { text: 'Yes please!', isCustomer: true, hasTyping: false },
    ],
    button: { label: 'Verify Coverage', color: HC.blue, tappedColor: 'rgba(59,130,246,0.35)', icon: 'shield', glowRgb: '59,130,246' },
    card: { title: 'Coverage Verified!', iconType: 'shield', iconColor: HC.blue, rows: [{ label: 'Provider', value: 'Aetna PPO' }, { label: 'Copay', value: '$25' }, { label: 'Next Opening', value: 'Tuesday at 10:00 AM' }], linkText: 'View Full Benefits', linkIcon: 'shield' },
  },
];

// Steps within each scene: show messages one by one, then button, trace, tap, fade chat, show card, pause, then next scene
type SceneStep = 'idle' | `msg-typing-${number}` | `msg-${number}` | 'btn' | 'trace' | 'tap' | 'fade-chat' | 'card' | 'done';

function getIconPath(icon: 'card' | 'calendar' | 'shield') {
  if (icon === 'card') return <><rect x="1" y="4" width="22" height="16" rx="3" /><path d="M1 10h22" /></>;
  if (icon === 'calendar') return <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>;
  return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
}

function getConfirmIconPath(icon: 'check' | 'calendar' | 'shield') {
  if (icon === 'check') return <path d="M5 13l4 4L19 7" />;
  if (icon === 'calendar') return <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>;
  return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
}

function getLinkIconPath(icon: 'pin' | 'calendar' | 'shield') {
  if (icon === 'pin') return <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>;
  if (icon === 'calendar') return <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>;
  return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
}

function HeroPhoneAnimation() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [step, setStep] = useState<SceneStep>('idle');
  const [visibleMsgs, setVisibleMsgs] = useState<number[]>([]);
  const [showBtn, setShowBtn] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [chatFaded, setChatFaded] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const scene = SCENES[sceneIdx];

  // Reset state when scene changes
  useEffect(() => {
    setStep('idle');
    setVisibleMsgs([]);
    setShowBtn(false);
    setIsTracing(false);
    setIsTapped(false);
    setChatFaded(false);
    setShowCard(false);
    setTransitioning(false);
  }, [sceneIdx]);

  // Scene step machine
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (step === 'idle') {
      // Start first message after 700ms
      timer = setTimeout(() => setStep('msg-0'), 700);
    } else if (step.startsWith('msg-typing-')) {
      const idx = parseInt(step.split('-')[2]);
      // Show typing for 700ms then show message
      timer = setTimeout(() => {
        setVisibleMsgs(prev => [...prev, idx]);
        setStep(`msg-${idx}` as SceneStep);
      }, 700);
    } else if (step.startsWith('msg-')) {
      const idx = parseInt(step.split('-')[1]);
      const nextIdx = idx + 1;
      if (nextIdx < scene.messages.length) {
        // Next message after delay
        const delay = scene.messages[nextIdx].hasTyping ? 1500 : 1200;
        timer = setTimeout(() => {
          if (scene.messages[nextIdx].hasTyping) {
            setStep(`msg-typing-${nextIdx}` as SceneStep);
          } else {
            setVisibleMsgs(prev => [...prev, nextIdx]);
            setStep(`msg-${nextIdx}` as SceneStep);
          }
        }, delay);
      } else {
        // All messages shown, show button
        timer = setTimeout(() => {
          setShowBtn(true);
          setStep('btn');
        }, 800);
      }
    } else if (step === 'btn') {
      // Start trace after 400ms
      timer = setTimeout(() => {
        setIsTracing(true);
        setStep('trace');
      }, 400);
    } else if (step === 'trace') {
      // Trace takes 1s, then tap
      timer = setTimeout(() => {
        setIsTracing(false);
        setIsTapped(true);
        setStep('tap');
      }, 1000);
    } else if (step === 'tap') {
      // Fade chat after 500ms
      timer = setTimeout(() => {
        setChatFaded(true);
        setStep('fade-chat');
      }, 500);
    } else if (step === 'fade-chat') {
      // Show card after 800ms (chat fade duration)
      timer = setTimeout(() => {
        setShowCard(true);
        setStep('card');
      }, 800);
    } else if (step === 'card') {
      // Hold card for 2s then transition to next scene
      timer = setTimeout(() => {
        setTransitioning(true);
        setStep('done');
      }, 2000);
    } else if (step === 'done') {
      // After fade-out, switch scene
      timer = setTimeout(() => {
        setSceneIdx(prev => (prev + 1) % SCENES.length);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [step, scene.messages]);

  // Start first message (handle typing)
  useEffect(() => {
    if (step === 'msg-0' && !visibleMsgs.includes(0)) {
      if (scene.messages[0].hasTyping) {
        setStep('msg-typing-0');
      } else {
        setVisibleMsgs([0]);
      }
    }
  }, [step, visibleMsgs, scene.messages]);

  // Which message is currently typing
  const typingIdx = step.startsWith('msg-typing-') ? parseInt(step.split('-')[2]) : -1;

  return (
    <div className="mx-auto hero-phone-scale">
      <div style={{ width: 390, background: HC.phoneBg, borderRadius: 50, padding: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ width: '100%', background: HC.screen, borderRadius: 42, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', height: 830 }}>
          {/* Notch + status bar */}
          <div style={{ position: 'relative', height: 30, flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 26, background: HC.screen, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 10 }} />
            <div style={{ position: 'absolute', top: 6, left: 18, fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 600, color: HC.cardText, zIndex: 5 }}>9:41</div>
            <div style={{ position: 'absolute', top: 6, right: 18, display: 'flex', gap: 4, alignItems: 'center', zIndex: 5 }}>
              <svg width="13" height="9" viewBox="0 0 18 12" fill={HC.cardText}>
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" />
                <rect x="10" y="2" width="3" height="10" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg width="20" height="10" viewBox="0 0 27 13" fill={HC.cardText}>
                <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke={HC.cardText} strokeWidth="1" fill="none" />
                <rect x="2" y="2" width="19" height="9" rx="1.5" />
                <path d="M25 4v5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Scene content with crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: transitioning ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
            >
              {/* SmartPage Header */}
              <div style={{ background: HC.screen, padding: '28px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                {scene.logo}
                <div style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 19, fontWeight: 800, color: HC.cardText, marginTop: 6 }}>{scene.name}</div>
                <div style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: HC.cardSub, textAlign: 'center' }}>{scene.tagline}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  {SOCIAL_ICON_PATHS.map((d, i) => (
                    <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid ${HC.cardSub}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={HC.cardText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', marginTop: 14, background: HC.tabBg, borderRadius: 20, padding: 3 }}>
                  <div style={{ padding: '6px 20px', borderRadius: 18, background: HC.tabActive, fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: HC.screen }}>Chat</div>
                  <div style={{ padding: '6px 20px', borderRadius: 18, fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: HC.tabInactive }}>Links</div>
                </div>
              </div>

              {/* Chat area */}
              <motion.div
                animate={{ opacity: chatFaded ? 0 : 1 }}
                transition={{ duration: 0.7 }}
                style={{ flex: 1, background: HC.screen, padding: '12px 10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                {/* Messages */}
                {scene.messages.map((msg, i) => {
                  if (typingIdx === i) {
                    return (
                      <div key={`typing-${i}`} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 5, padding: '10px 16px', background: HC.reply, borderRadius: '20px 20px 20px 4px', width: 'fit-content' }}>
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    );
                  }
                  if (!visibleMsgs.includes(i)) return null;
                  return (
                    <motion.div
                      key={`msg-${i}`}
                      initial={{ opacity: 0, y: 24, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 180 }}
                      style={{ display: 'flex', justifyContent: msg.isCustomer ? 'flex-end' : 'flex-start', marginBottom: 8 }}
                    >
                      <div style={{
                        maxWidth: msg.isCustomer ? '75%' : '88%',
                        padding: msg.isCustomer ? '10px 16px' : '14px 18px',
                        borderRadius: msg.isCustomer ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: msg.isCustomer ? HC.customer : HC.reply,
                        boxShadow: msg.isCustomer ? '0 1px 6px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.3)',
                      }}>
                        <p style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: msg.isCustomer ? HC.customerText : HC.replyText, margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Action button */}
                {showBtn && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: isTapped ? 0.95 : 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 160 }}
                    style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}
                  >
                    <div style={{ position: 'relative', width: BTN_W, height: BTN_HT }}>
                      <div style={{
                        position: 'absolute', inset: 0, borderRadius: BTN_RAD,
                        background: isTapped ? scene.button.tappedColor : scene.button.color,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isTapped ? 'rgba(255,255,255,0.5)' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          {getIconPath(scene.button.icon)}
                        </svg>
                        <span style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: isTapped ? 'rgba(255,255,255,0.5)' : '#FFFFFF' }}>
                          {scene.button.label}
                        </span>
                      </div>
                      {/* Border trace */}
                      {isTracing && (
                        <svg width={BTN_W + 4} height={BTN_HT + 4} viewBox={`-2 -2 ${BTN_W + 4} ${BTN_HT + 4}`} style={{ position: 'absolute', top: -2, left: -2, pointerEvents: 'none' }}>
                          <rect x="0" y="0" width={BTN_W} height={BTN_HT} rx={BTN_RAD} ry={BTN_RAD}
                            fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"
                            strokeDasharray={`${TRACE_LEN_VAL} ${BTN_PERIM_VAL - TRACE_LEN_VAL}`}
                            strokeLinecap="round"
                            style={{
                              strokeDashoffset: BTN_PERIM_VAL,
                              animation: 'heroTraceAnim 1s linear forwards',
                              filter: `drop-shadow(0 0 6px rgba(${scene.button.glowRgb},0.8)) drop-shadow(0 0 12px rgba(${scene.button.glowRgb},0.5))`,
                            }}
                          />
                        </svg>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirmation card */}
              {showCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 140 }}
                  style={{ position: 'absolute', left: 0, right: 0, top: '50%', bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 12px' }}
                >
                  <div style={{ background: HC.reply, borderRadius: 24, padding: '24px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: scene.card.iconColor, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: `0 4px 16px ${scene.card.iconColor}66` }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {getConfirmIconPath(scene.card.iconType)}
                      </svg>
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{scene.card.title}</div>
                    <div style={{ width: '80%', height: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', padding: '0 8px' }}>
                      {scene.card.rows.map((r, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                          <span style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: '#FFFFFF', textAlign: 'right' }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '80%', height: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ fontFamily: 'var(--font-sans-inter), Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: scene.card.iconColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={scene.card.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {getLinkIconPath(scene.card.linkIcon)}
                      </svg>
                      {scene.card.linkText}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CSS for border trace + phone scaling */}
      <style jsx>{`
        @keyframes heroTraceAnim {
          from { stroke-dashoffset: ${BTN_PERIM_VAL}; }
          to { stroke-dashoffset: 0; }
        }
        .hero-phone-scale {
          width: 390px;
          height: 340px;
          transform: scale(0.38);
          transform-origin: top center;
        }
        @media (min-width: 768px) {
          .hero-phone-scale {
            height: 500px;
            transform: scale(0.58);
          }
        }
      `}</style>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-[180px] md:pt-[120px] pb-8 overflow-x-clip" style={{ background: 'linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 100%)' }}>
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #F4F1EC, transparent 70%)',
            top: '10%',
            left: '60%',
            animation: 'meshDrift1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #F4F1EC, transparent 70%)',
            bottom: '10%',
            right: '60%',
            animation: 'meshDrift2 25s ease-in-out infinite',
          }}
        />
      </div>

      {/* Calendar — top-right, cut off right edge of screen, behind phone */}
      <img
        src="/calendar%20drawn.png"
        alt=""
        className="absolute z-[5] w-[280px] md:w-[480px] top-[40%] md:top-[8%] -right-[136px] md:-right-[180px] rotate-[12deg] opacity-40 pointer-events-none"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 items-center">
          {/* Copy */}
          <div className="relative text-center md:text-left">
            <motion.h1
              className="text-[32px] sm:text-[44px] md:text-[56px] font-extrabold text-[#F5F5F5] leading-[1.1] tracking-tight"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Your Business,<br />
              <span className="text-[#F4F1EC]/70">
                Always Available
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 md:mt-6 text-[14px] md:text-[20px] text-[#F5F5F5]/70 leading-relaxed md:max-w-[560px] mx-auto md:mx-0"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Your smart assistant that never sleeps — answering questions, booking appointments, taking orders, and more while you focus on what you do best.
            </motion.p>
            {/* CTA + trust badges: visible on desktop, hidden on mobile (shown below phone instead) */}
            <motion.div
              className="hidden md:flex mt-8 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <a
                href="#pricing"
                className="bg-[#F4F1EC] text-[#1A1A1A] font-semibold text-lg px-8 py-4 rounded-full hover:bg-[#D9D5CF] transition-colors inline-flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-sans-inter)' }}
              >
                Start 7-Day Free Trial
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </motion.div>
            <motion.div
              className="hidden md:flex mt-6 flex-row gap-6 justify-start text-[#F5F5F5]/50 text-sm"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-[#4CAF50]" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-[#4CAF50]" /> Setup in 5 minutes</span>
              <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-[#4CAF50]" /> Cancel anytime</span>
            </motion.div>
          </div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Text bubble — top-left of phone, offset right */}
            <img
              src="/text%20bubble.png"
              alt=""
              className="absolute z-10 w-[160px] md:w-[240px] -top-8 -left-10 md:-top-12 md:-left-12 opacity-40 pointer-events-none"
            />
            {/* Checkmark — bottom-left of phone */}
            <img
              src="/checkmark%20drawn.png"
              alt=""
              className="absolute z-10 w-[120px] md:w-[180px] -bottom-4 -left-6 md:-bottom-8 md:-left-28 opacity-40 pointer-events-none"
            />
            <HeroPhoneAnimation />
          </motion.div>
        </div>

        {/* Mobile-only CTA + trust badges below phone */}
        <div className="md:hidden flex flex-col items-center gap-4 mt-4">
          <a
            href="#pricing"
            className="bg-[#F4F1EC] text-[#1A1A1A] font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#D9D5CF] transition-colors inline-flex items-center justify-center gap-2"
            style={{ fontFamily: 'var(--font-sans-inter)' }}
          >
            Start 7-Day Free Trial
            <ArrowRightIcon className="w-4 h-4" />
          </a>
          <div
            className="flex flex-row gap-4 text-[#F5F5F5]/50 text-[11px]"
            style={{ fontFamily: 'var(--font-sans-inter)' }}
          >
            <span className="flex items-center gap-1"><CheckCircleIcon className="w-3.5 h-3.5 text-[#4CAF50]" /> No credit card</span>
            <span className="flex items-center gap-1"><CheckCircleIcon className="w-3.5 h-3.5 text-[#4CAF50]" /> 5 min setup</span>
            <span className="flex items-center gap-1"><CheckCircleIcon className="w-3.5 h-3.5 text-[#4CAF50]" /> Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Mesh drift animations */}
      <style jsx>{`
        @keyframes meshDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 40px) scale(1.1); }
          66% { transform: translate(40px, -30px) scale(0.95); }
        }
        @keyframes meshDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -50px) scale(1.15); }
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 3: SOCIAL PROOF
// =============================================================================

const testimonials = [
  { quote: 'This saved my business 10+ hours a week', name: 'Sarah', biz: 'Bloom Salon' },
  { quote: 'I wake up to orders already placed', name: 'Mike', biz: "Sal's Pizza Truck" },
  { quote: 'Customers love how fast they get answers', name: 'Diana', biz: 'Bright Smile Dental' },
  { quote: 'Finally stopped missing calls', name: 'James', biz: 'Fresh Cuts Barber' },
  { quote: "It's like having a 24/7 receptionist", name: 'Luis', biz: 'Glow Day Spa' },
  { quote: 'Bookings doubled in the first month', name: 'Karen', biz: 'Paws & Claws Grooming' },
  { quote: 'My regulars use it every week now', name: 'Damian', biz: "Nito's Empanadas" },
  { quote: 'Set it up in a day, been running ever since', name: 'Rachel', biz: 'Conway Cleaning Co.' },
  { quote: 'I actually take weekends off now', name: 'Marcus', biz: 'M&M Plumbing' },
  { quote: 'Best investment I made this year', name: 'Jen', biz: 'The Craft Corner' },
];

function SocialProofStrip() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 mb-12">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#1A1A1A] text-center leading-tight"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Positively Impacting Businesses Across the Country
        </motion.h2>
      </div>

      <div className="relative">
        <div className="flex gap-5 animate-scroll-testimonials hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[360px] rounded-2xl px-6 py-5 border border-[#1A1A1A]/10 bg-transparent"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
            >
              <p className="text-[#1A1A1A] text-[15px] md:text-base leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-3 text-[#1A1A1A]/40 text-sm">
                — {t.name}, {t.biz}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollTestimonials {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-testimonials {
          animation: scrollTestimonials 45s linear infinite;
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 4: PROBLEM
// =============================================================================

const painPoints = [
  'Answering the same questions over and over',
  'Playing phone tag to schedule appointments',
  'Losing customers because you couldn\'t respond fast enough',
  'Figuring out how to promote your menu or services',
  'Manually tracking sales in spreadsheets',
  'Paying for a website that just sits there',
];

function ProblemSection() {
  return (
    <section className="bg-[#1A1A1A] py-16 md:py-24 px-4">
      <div className="max-w-[800px] mx-auto">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#F5F5F5] text-center leading-tight"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Running a Business Shouldn&apos;t Feel Like Running a Marathon
        </motion.h2>
        <motion.p
          className="mt-6 text-lg md:text-xl text-[#F5F5F5]/60 text-center leading-relaxed"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          You didn&apos;t start your business to spend hours:
        </motion.p>

        <div className="mt-10 grid sm:grid-cols-2 gap-3 md:gap-4">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mt-0.5 text-[#FF4444] flex-shrink-0">
                <XMarkIcon className="w-5 h-5" />
              </div>
              <span className="text-[#F5F5F5]/80 text-[15px] md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-sans-inter)' }}>
                {point}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-lg text-[#F5F5F5]/60 leading-relaxed" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            You started your business because you&apos;re passionate about what you do.
          </p>
          <p className="mt-3 text-xl font-semibold text-[#F5F5F5]" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            Let your Smart Assistant handle the rest.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 5: SOLUTION DEMO
// =============================================================================

const solutionChat = [
  { from: 'customer' as const, text: 'Do you have appointments available this week?' },
  { from: 'assistant' as const, text: 'Yes! I have openings on Wed at 2pm or Fri at 10am. Which works better for you?' },
  { from: 'customer' as const, text: 'Friday works!' },
  { from: 'assistant' as const, text: "Perfect! You're booked for Friday 10am. I'll send you a confirmation text." },
];

const statsRow: { stat: string; label: string; biz: string; icon: React.FC<{ className?: string }> }[] = [
  { stat: '+47', label: 'Orders this week', biz: 'Nito\'s Empanadas', icon: UtensilsIcon },
  { stat: '$1,200', label: 'Booked overnight', biz: 'Fresh Cuts Barber', icon: ScissorsIcon },
  { stat: '156', label: 'Questions answered', biz: 'Bright Smile Dental', icon: ToothIcon },
  { stat: '24/7', label: 'Always online', biz: 'Never miss a customer', icon: BoltIcon },
  { stat: '+32', label: 'New bookings', biz: 'Glow Day Spa', icon: SparklesIcon },
  { stat: '$890', label: 'Weekend orders', biz: 'Sal\'s Pizza Truck', icon: UtensilsIcon },
  { stat: '98%', label: 'Auto-resolved', biz: 'Mike\'s Plumbing', icon: WrenchIcon },
  { stat: '4.9★', label: 'Customer satisfaction', biz: 'CleanPro Services', icon: HomeIcon },
];

const questionsRow = [
  'What are your hours?',
  'Can I book for Saturday?',
  'Do you take Aetna?',
  'What\'s your most popular item?',
  'How much for a fade?',
  'Are you open tomorrow?',
  'Can I order ahead for pickup?',
  'Do you have vegan options?',
  'What\'s the wait time?',
  'Can I get a quote?',
];

function SolutionSection() {
  return (
    <section id="solution" className="py-16 md:py-24 overflow-hidden" style={{ background: '#f5f5f0' }}>
      <div className="max-w-[1100px] mx-auto px-4">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#1A1A1A] text-center leading-tight"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Meet Your New<br className="md:hidden" /> Smart Assistant
        </motion.h2>
        <motion.p
          className="mt-4 text-base md:text-xl text-[#1A1A1A]/60 text-center max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Working for you 24/7.<br />
          Questions answered. Deals closed. More revenue.<br />
          <span className="text-sm md:text-base text-[#1A1A1A]/40">And we&apos;re always building more.</span>
        </motion.p>
      </div>

      {/* Scrolling cards — full width */}
      <div className="mt-12 space-y-4">
        {/* Row 1: Stats — scrolls left */}
        <div className="relative group">
          <div className="flex gap-4 animate-scroll-left hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
            {[...statsRow, ...statsRow].map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px] md:w-[270px] h-[140px] md:h-[150px] rounded-2xl p-5 flex flex-col justify-between border border-white/[0.06]"
                style={{
                  background: 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%)',
                  fontFamily: 'var(--font-sans-inter)',
                }}
              >
                <div>
                  <p className="text-[28px] md:text-[32px] font-bold text-white leading-none">{card.stat}</p>
                  <p className="text-white/50 text-sm mt-1.5">{card.label}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <card.icon className="w-3.5 h-3.5 text-white/30" />
                  <p className="text-white/30 text-xs">{card.biz}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Questions — scrolls right */}
        <div className="relative group">
          <div className="flex gap-4 animate-scroll-right hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
            {[...questionsRow, ...questionsRow].map((q, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px] md:w-[270px] h-[140px] md:h-[150px] rounded-2xl p-5 flex items-center gap-3 border border-white/[0.06]"
                style={{
                  background: 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%)',
                  fontFamily: 'var(--font-sans-inter)',
                }}
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <ChatIcon className="w-4 h-4 text-white/50" />
                </div>
                <p className="text-white/90 text-[15px] leading-snug">&ldquo;{q}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 28s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 28s linear infinite;
        }
      `}</style>
    </section>
  );
}

// =============================================================================
// SECTION 6: INDUSTRY CAROUSEL
// =============================================================================

type IndustryData = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: { q: string; a: string }[];
  results: string[];
};

const industries: IndustryData[] = [
  {
    name: 'Food Trucks',
    icon: UtensilsIcon,
    questions: [
      { q: 'Where are you today?', a: 'Automatically shares your current location and hours from your schedule' },
      { q: "What's on the menu?", a: "Displays today's offerings, prices, and specials — always up to date" },
      { q: 'Can I pre-order for pickup?', a: 'Takes orders, collects payment via Stripe, sends confirmation — you just cook' },
      { q: 'What time do you close?', a: "Shares hours, warns about sell-outs, suggests tomorrow's location" },
    ],
    results: ['More orders while driving between stops', 'No more answering "where are you" 50x/day', 'Pre-orders ready when customers arrive', 'Full sales tracking without spreadsheets'],
  },
  {
    name: 'Taprooms',
    icon: BeerIcon,
    questions: [
      { q: "What's on tap today?", a: 'Shows current tap list, ABV, tasting notes' },
      { q: 'Do you have trivia night this week?', a: 'Shares event calendar, takes reservations' },
      { q: 'Can I order food?', a: 'Takes food orders, notifies kitchen' },
      { q: 'Can I book the private room?', a: 'Checks availability, books space, collects deposit' },
    ],
    results: ['Customers know what\'s pouring before they arrive', 'Event bookings happen 24/7', 'Food orders ready when guests sit down', 'Private event revenue on autopilot'],
  },
  {
    name: 'Salons',
    icon: ScissorsIcon,
    questions: [
      { q: 'Do you have appointments today?', a: 'Checks calendar, books available slots instantly' },
      { q: 'How much is a haircut?', a: 'Shares pricing, suggests packages' },
      { q: 'Can I see your work?', a: 'Shows portfolio, before/afters from Instagram' },
      { q: 'Do you sell gift cards?', a: 'Processes gift card sales via Stripe' },
    ],
    results: ['Chairs filled without playing phone tag', 'Late-night bookings while you sleep', 'No-shows reduced with auto-reminders', 'Retail sales without lifting a finger'],
  },
  {
    name: 'Contractors',
    icon: WrenchIcon,
    questions: [
      { q: 'How much does a bathroom remodel cost?', a: 'Shares pricing ranges, recent projects' },
      { q: 'Can you give me an estimate?', a: 'Books estimate appointments, sends confirmation' },
      { q: 'Do you do residential or commercial?', a: 'Answers service area, specialties, licenses' },
      { q: 'Can I see examples of your work?', a: 'Shows portfolio from past projects' },
    ],
    results: ['Estimate calendar filled without cold calls', 'Qualified leads (price-aware before estimate)', 'Portfolio shared instantly', '24/7 lead capture from Nextdoor/Yelp/Google'],
  },
  {
    name: 'Dentists',
    icon: ToothIcon,
    questions: [
      { q: 'Do you take my insurance?', a: 'Lists accepted insurance, verifies coverage' },
      { q: 'What does a cleaning cost?', a: 'Shares pricing, explains with/without insurance' },
      { q: 'I need an emergency appointment', a: 'Checks urgent slots, books same-day when possible' },
      { q: 'Do you see kids?', a: 'Confirms pediatric services, suggests family packages' },
    ],
    results: ['New patient appointments booked 24/7', 'Insurance questions answered instantly', 'Reduced front desk call volume', 'Higher show-up rate with SMS reminders'],
  },
  {
    name: 'Realtors',
    icon: HomeIcon,
    questions: [
      { q: 'What homes do you have for sale?', a: 'Shows active listings with photos, pricing' },
      { q: 'Can I schedule a showing?', a: 'Books showing times, sends address/details' },
      { q: "What's the HOA fee?", a: 'Answers listing-specific questions instantly' },
      { q: 'Do you work in my neighborhood?', a: 'Confirms service areas, shares neighborhood expertise' },
    ],
    results: ['Showings booked while you\'re showing other homes', 'Buyer questions answered immediately', 'Qualified leads (budget-aware before showing)', '24/7 listing info without late-night calls'],
  },
  {
    name: 'Retail',
    icon: ShoppingBagIcon,
    questions: [
      { q: 'Do you have this in size medium?', a: 'Checks inventory, holds items for pickup' },
      { q: 'Can I order online?', a: 'Takes orders, processes payment, notifies for pickup' },
      { q: 'Do you do gift wrapping?', a: 'Explains services, adds to order' },
      { q: 'Are you open Sunday?', a: 'Shares hours, holiday schedules, directions' },
    ],
    results: ['Online orders without building an e-commerce site', 'Inventory questions answered instantly', 'Curbside pickup coordinated automatically', 'Revenue outside business hours'],
  },
  {
    name: 'Auto Shops',
    icon: CarIcon,
    questions: [
      { q: 'How much is an oil change?', a: 'Shares service menu, pricing, add-ons' },
      { q: 'Can I get in today?', a: 'Checks shop schedule, books available slots' },
      { q: 'Do you work on my car?', a: 'Confirms specialties, certifications' },
      { q: 'Do you take credit cards?', a: 'Explains payment options, estimates' },
    ],
    results: ['Service bays filled without receptionist', 'Customers book at midnight', 'Upsells suggested automatically', 'Reminder texts reduce no-shows'],
  },
];

function IndustryModal({ industry, onClose }: { industry: IndustryData; onClose: () => void }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/70 z-[80]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[680px] md:w-full md:max-h-[80vh] bg-white rounded-2xl md:rounded-3xl z-[90] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="p-6 md:p-8">
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors">
            <XMarkIcon className="w-4 h-4 text-[#1A1A1A]" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1A1A1A]/5 flex items-center justify-center">
              <industry.icon className="w-7 h-7 text-[#1A1A1A]/40" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-sans-inter)' }}>
              {industry.name}
            </h3>
          </div>

          <p className="text-[#1A1A1A]/50 text-sm font-medium uppercase tracking-wider mb-5" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            Your Smart Assistant handles
          </p>

          {/* Questions */}
          <div className="space-y-5 mb-8">
            {industry.questions.map((item, i) => (
              <div key={i}>
                <p className="font-semibold text-[#1A1A1A] text-base" style={{ fontFamily: 'var(--font-sans-inter)' }}>
                  &ldquo;{item.q}&rdquo;
                </p>
                <p className="text-[#1A1A1A]/70 text-[15px] mt-1" style={{ fontFamily: 'var(--font-sans-inter)' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="bg-[#f8f8f8] rounded-xl p-5">
            <p className="font-semibold text-[#1A1A1A] text-sm uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-sans-inter)' }}>
              The Result
            </p>
            <div className="space-y-2">
              {industry.results.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                  <span className="text-[#1A1A1A]/70 text-[15px]" style={{ fontFamily: 'var(--font-sans-inter)' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <a
              href="#pricing"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-[#F4F1EC] text-[#1A1A1A] font-semibold px-8 py-3.5 rounded-full hover:bg-[#D9D5CF] transition-colors"
              style={{ fontFamily: 'var(--font-sans-inter)' }}
            >
              Start 7-Day Free Trial <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function IndustryCarousel() {
  const [selected, setSelected] = useState<IndustryData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#1A1A1A] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#F5F5F5] text-center leading-tight"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Built for Your Industry, Made for You
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-[#F5F5F5]/60 text-center"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          See how businesses like yours use their Smart Assistant every day
        </motion.p>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="mt-10 md:mt-14 flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-8 pt-2 pb-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {industries.map((ind, i) => (
          <motion.button
            key={ind.name}
            onClick={() => setSelected(ind)}
            className="flex-shrink-0 w-[260px] md:w-[280px] bg-[#2A2A2A] hover:bg-[#F5F5F5] rounded-2xl border border-white/[0.06] hover:border-[#1A1A1A]/10 p-6 md:p-8 text-left snap-center transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F4F1EC]/10 group-hover:bg-[#1A1A1A]/10 flex items-center justify-center mb-5 transition-colors">
              <ind.icon className="w-8 h-8 text-[#F4F1EC] group-hover:text-[#1A1A1A] transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-[#F5F5F5] group-hover:text-[#1A1A1A] mb-2 transition-colors" style={{ fontFamily: 'var(--font-sans-inter)' }}>{ind.name}</h3>
            <p className="text-sm text-[#F5F5F5]/40 group-hover:text-[#1A1A1A]/50 transition-colors" style={{ fontFamily: 'var(--font-sans-inter)' }}>Tap to see how it helps</p>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-[#F5F5F5]/30 text-xs mt-2 md:hidden" style={{ fontFamily: 'var(--font-sans-inter)' }}>
        Swipe to explore
      </p>

      <AnimatePresence>
        {selected && <IndustryModal industry={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

// =============================================================================
// SECTION 7: TOOL SHED
// =============================================================================

type Tool = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  price: string;
  tagline: string;
  perfectFor: string;
  features: string[];
  howItWorks: string;
  example: string;
};

const tools: Tool[] = [
  {
    icon: SmartphoneIcon,
    name: 'Online Ordering',
    price: '+$29/mo',
    tagline: 'Take orders & payments 24/7',
    perfectFor: 'Food trucks, bakeries, retail shops',
    features: ['Pre-order & walk-up ordering', 'Stripe payment processing', 'Order management dashboard', 'Customer order confirmations (SMS)', 'Real-time order notifications', 'Menu management (update anytime)', 'Promo codes & discounts'],
    howItWorks: 'Customer asks your assistant about the menu, browses items, places order, pays via Stripe, you get notified, they show up to pick up.',
    example: "Nito's Empanadas takes 20+ pre-orders every event before the truck even opens. No phone calls, no confusion.",
  },
  {
    icon: CalendarIcon,
    name: 'Booking System',
    price: '+$19/mo',
    tagline: 'Schedule appointments automatically',
    perfectFor: 'Salons, dentists, contractors, studios',
    features: ['Calendar syncing (Google/Apple)', 'Automatic appointment booking', 'SMS reminders (reduce no-shows)', 'Cancellation/rescheduling', 'Buffer time between appointments', 'Deposit collection (optional)', 'Staff scheduling (multi-provider)'],
    howItWorks: 'Customer asks for availability, assistant shows open slots, customer picks, booked instantly, both get confirmation, reminder sent day before.',
    example: "Bloom Salon fills 80% of their calendar from after-hours bookings while they sleep.",
  },
  {
    icon: BarChartIcon,
    name: 'Financial Reports',
    price: '+$15/mo',
    tagline: 'Track everything automatically',
    perfectFor: 'Every business (seriously, everyone)',
    features: ['Stripe integration (auto-sync)', 'Revenue tracking by day/week/month', 'Smart analysis (trends, insights)', 'PDF reports (for accountant)', 'CSV exports (for spreadsheets)', 'Customer lifetime value', 'Best-selling items/services'],
    howItWorks: 'Link your Stripe account once. Reports update automatically. See what\'s working, what\'s not. Download for taxes or accountant.',
    example: "Joe's Coffee stopped spending 3 hours every Sunday doing books. Now it takes 5 minutes to download a report.",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="bg-[#2A2A2A] rounded-2xl border border-white/[0.06] overflow-hidden hover:border-[#F4F1EC]/20 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 md:p-8"
      >
        <div className="w-12 h-12 rounded-xl bg-[#F4F1EC]/10 flex items-center justify-center mb-4">
          <tool.icon className="w-6 h-6 text-[#F4F1EC]" />
        </div>
        <h3 className="text-xl font-semibold text-[#F5F5F5]" style={{ fontFamily: 'var(--font-sans-inter)' }}>{tool.name}</h3>
        <p className="text-[#F4F1EC] font-bold text-xl mt-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>{tool.price}</p>
        <p className="text-[#F5F5F5]/50 text-sm mt-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>{tool.tagline}</p>
        <div className={`mt-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 transition-transform ${open ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="w-4 h-4 text-[#F5F5F5]/50" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/[0.06] pt-5">
              <p className="text-[#F5F5F5]/40 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>Perfect for</p>
              <p className="text-[#F5F5F5]/70 text-sm mb-5" style={{ fontFamily: 'var(--font-sans-inter)' }}>{tool.perfectFor}</p>

              <p className="text-[#F5F5F5]/40 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>What you get</p>
              <div className="space-y-1.5 mb-5">
                {tool.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                    <span className="text-[#F5F5F5]/70 text-sm" style={{ fontFamily: 'var(--font-sans-inter)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <p className="text-[#F5F5F5]/40 text-xs uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>How it works</p>
              <p className="text-[#F5F5F5]/60 text-sm mb-5" style={{ fontFamily: 'var(--font-sans-inter)' }}>{tool.howItWorks}</p>

              <div className="bg-white/[0.03] rounded-lg p-4 border border-white/[0.06]">
                <p className="text-[#F5F5F5]/40 text-xs uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-sans-inter)' }}>Real example</p>
                <p className="text-[#F5F5F5]/80 text-sm italic" style={{ fontFamily: 'var(--font-sans-inter)' }}>&ldquo;{tool.example}&rdquo;</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ToolShedSection() {
  return (
    <section id="toolshed" className="bg-[#1A1A1A] py-16 md:py-24 px-4">
      <div className="max-w-[1100px] mx-auto">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#F5F5F5] text-center"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Your Tool Shed
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-[#F5F5F5]/60 text-center max-w-xl mx-auto"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          We build the tools you need to grow. Start with the basics, add as you scale.
        </motion.p>

        <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-4 md:gap-6">
          {tools.map(tool => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 8: STRIPE SPOTLIGHT
// =============================================================================

const stripeFeatures = [
  { icon: CreditCardIcon, title: 'Accept payments in your assistant', desc: 'Orders, bookings, deposits — all processed securely through your Stripe account' },
  { icon: BarChartIcon, title: 'Automatic financial reports', desc: 'Every transaction flows into your dashboard. Revenue, trends, insights — all automated' },
  { icon: ShieldIcon, title: 'Bank-level security', desc: 'We never store payment info. Stripe handles everything — same security as Apple/Amazon' },
  { icon: DollarIcon, title: 'Keep more of your money', desc: "Stripe's standard rates (2.9% + 30¢). No markup, no hidden fees from us" },
];

function StripeSpotlight() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24 px-4">
      <div className="max-w-[1100px] mx-auto">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#1A1A1A] text-center leading-tight"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Powered by Stripe. Powered by You.
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-[#1A1A1A]/60 text-center max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          We&apos;ve integrated with Stripe so you can focus on your business, not payment headaches.
        </motion.p>

        {/* Logos */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Placeholder: Replace with official Stripe wordmark SVG */}
          <div className="bg-[#635BFF] text-white font-bold text-xl px-6 py-3 rounded-lg" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            stripe
          </div>
          <span className="text-[#1A1A1A]/30 text-2xl font-light">+</span>
          <div className="relative w-10 h-10">
            <Image src="/Shortlist_logo.png" alt="Shortlist" fill className="object-contain" />
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-12 grid sm:grid-cols-2 gap-4 md:gap-6">
          {stripeFeatures.map((feat, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#F4F1EC]/10 flex items-center justify-center mb-4">
                <feat.icon className="w-6 h-6 text-[#F4F1EC]" />
              </div>
              <h3 className="text-[#1A1A1A] font-semibold text-base md:text-lg" style={{ fontFamily: 'var(--font-sans-inter)' }}>{feat.title}</h3>
              <p className="text-[#1A1A1A]/60 text-sm mt-2 leading-relaxed" style={{ fontFamily: 'var(--font-sans-inter)' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Coming soon */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-[#1A1A1A]/40 text-sm mb-3" style={{ fontFamily: 'var(--font-sans-inter)' }}>More integrations coming soon</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Square', 'QuickBooks', 'Google Calendar'].map(name => (
              <span key={name} className="bg-[#1A1A1A]/5 text-[#1A1A1A]/50 text-xs font-medium px-3 py-1.5 rounded-full" style={{ fontFamily: 'var(--font-sans-inter)' }}>
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 9: PRICING
// =============================================================================

const basePlanFeatures = [
  'Your smart assistant (24/7)',
  'Answers customer questions',
  'Custom domain (yourbusiness.com)',
  'Social media integration',
  'Hours & location info',
  'Lead capture & notifications',
  'Mobile-optimized',
];

const bundles = [
  { name: 'Service Pro', price: '$55', desc: 'Base + Booking + Reports', save: 'Save $4/mo' },
  { name: 'Food & Retail', price: '$59', desc: 'Base + Ordering + Reports', save: 'Save $10/mo' },
  { name: 'All-in-One', price: '$69', desc: 'Base + All 3 tools', save: 'Save $19/mo', featured: true },
];

const faqs = [
  { q: 'Can I switch plans?', a: 'Yes, anytime. Upgrade or downgrade with a click.' },
  { q: 'What if I cancel?', a: 'Keep your data, no lock-in. We make it easy.' },
  { q: 'Is setup included?', a: 'Yes, 100% free. We help you get started.' },
  { q: 'Do you charge transaction fees?', a: "No, just Stripe's standard rate (2.9% + 30¢)." },
];

function PricingSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="bg-[#1A1A1A] py-16 md:py-24 px-4">
      <div className="max-w-[1100px] mx-auto">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#F5F5F5] text-center"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Simple, Honest Pricing
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-[#F5F5F5]/60 text-center"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Start with what you need. Add as you grow.
        </motion.p>

        {/* Base plan */}
        <motion.div
          className="mt-10 md:mt-14 max-w-md mx-auto bg-[#2A2A2A] rounded-3xl border-2 border-[#F4F1EC]/40 p-8 md:p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#F4F1EC] font-semibold text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans-inter)' }}>Smart Assistant Base</p>
          <p className="mt-4 text-5xl md:text-6xl font-extrabold text-[#F5F5F5]" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            $25<span className="text-lg font-medium text-[#F5F5F5]/40">/month</span>
          </p>
          <div className="mt-6 space-y-2.5 text-left max-w-xs mx-auto">
            {basePlanFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                <span className="text-[#F5F5F5]/70 text-[15px]" style={{ fontFamily: 'var(--font-sans-inter)' }}>{f}</span>
              </div>
            ))}
          </div>
          <a
            href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
            className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-[#F4F1EC] text-[#1A1A1A] font-semibold text-lg px-8 py-4 rounded-full hover:bg-[#D9D5CF] transition-colors"
            style={{ fontFamily: 'var(--font-sans-inter)' }}
          >
            Start 7-Day Free Trial
          </a>
          <p className="mt-3 text-[#F5F5F5]/30 text-xs" style={{ fontFamily: 'var(--font-sans-inter)' }}>No credit card required</p>
        </motion.div>

        {/* Add-ons */}
        <div className="mt-12 text-center">
          <p className="text-[#F5F5F5]/40 text-sm font-medium uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            Add the tools you need
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map(t => (
              <div key={t.name} className="bg-[#2A2A2A] border border-white/[0.06] rounded-xl px-5 py-3 text-center">
                <p className="text-[#F5F5F5] text-sm font-medium" style={{ fontFamily: 'var(--font-sans-inter)' }}>{t.name}</p>
                <p className="text-[#F4F1EC] font-bold text-sm mt-1" style={{ fontFamily: 'var(--font-sans-inter)' }}>{t.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bundles */}
        <div className="mt-12">
          <p className="text-[#F5F5F5]/40 text-sm font-medium uppercase tracking-wider mb-6 text-center" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            Or bundle &amp; save
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {bundles.map((b, i) => (
              <motion.div
                key={b.name}
                className={`bg-[#2A2A2A] rounded-2xl p-6 text-center border transition-all duration-300 hover:-translate-y-1 ${
                  b.featured ? 'border-[#F4F1EC]/40 shadow-[0_0_30px_rgba(255,107,53,0.1)]' : 'border-white/[0.06]'
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-[#F5F5F5] font-semibold text-base" style={{ fontFamily: 'var(--font-sans-inter)' }}>{b.name}</p>
                <p className="text-3xl font-extrabold text-[#F5F5F5] mt-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>
                  {b.price}<span className="text-sm font-medium text-[#F5F5F5]/40">/mo</span>
                </p>
                <p className="text-[#F5F5F5]/50 text-sm mt-2" style={{ fontFamily: 'var(--font-sans-inter)' }}>{b.desc}</p>
                <motion.span
                  className="inline-block mt-3 bg-[#F4F1EC]/15 text-[#F4F1EC] font-semibold text-xs px-3 py-1 rounded-full"
                  style={{ fontFamily: 'var(--font-sans-inter)' }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {b.save}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <p className="text-[#F5F5F5]/40 text-sm font-medium uppercase tracking-wider mb-6 text-center" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            FAQ
          </p>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#2A2A2A] rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between"
                >
                  <span className="text-[#F5F5F5] text-[15px] font-medium" style={{ fontFamily: 'var(--font-sans-inter)' }}>{faq.q}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-[#F5F5F5]/40 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-[#F5F5F5]/60 text-sm" style={{ fontFamily: 'var(--font-sans-inter)' }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 10: FINAL CTA
// =============================================================================

function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2d1a11 50%, #1A1A1A 100%)' }}>
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,107,53,0.15), transparent 70%)',
        }}
      />
      <div className="relative z-10 max-w-[680px] mx-auto text-center">
        <motion.h2
          className="text-[28px] sm:text-[36px] md:text-[48px] font-bold text-[#F5F5F5] leading-tight"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Stop Losing Customers to Voicemail
        </motion.h2>
        <motion.p
          className="mt-6 text-lg md:text-xl text-[#F5F5F5]/60 leading-relaxed"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your competitors are answering questions while you sleep. Your customers are booking with businesses that respond instantly.
        </motion.p>
        <motion.p
          className="mt-4 text-xl md:text-2xl font-semibold text-[#F5F5F5]"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Don&apos;t let another customer slip away.
        </motion.p>

        <motion.a
          href="https://buy.stripe.com/3cI4gyfB1eg65uZ02Q4sE05"
          className="mt-10 inline-flex items-center justify-center gap-2 bg-white text-[#1A1A1A] font-bold text-lg md:text-xl px-12 py-5 md:py-6 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-[#F5F5F5] transition-colors"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Your 7-Day Free Trial
          <ArrowRightIcon className="w-5 h-5" />
        </motion.a>

        <motion.div
          className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-[#F5F5F5]/40 text-sm"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span>No credit card required</span>
          <span className="hidden sm:inline">·</span>
          <span>Setup takes 5 minutes</span>
          <span className="hidden sm:inline">·</span>
          <span>Cancel anytime, keep your data</span>
        </motion.div>

        <motion.p
          className="mt-10 text-[#F5F5F5]/30 text-sm"
          style={{ fontFamily: 'var(--font-sans-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Join 200+ businesses who never miss a customer
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION 11: FOOTER
// =============================================================================

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '#solution' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Tool Shed', href: '#toolshed' },
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
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: LinkedInIcon, href: '#', label: 'LinkedIn' },
  { icon: MailIcon, href: '#', label: 'Email' },
];

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-16 px-4 border-t border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/shortlist-logo-ivory-transparent.png" alt="Shortlist" width={24} height={24} />
              <span className="text-[#F5F5F5] font-semibold text-lg" style={{ fontFamily: 'var(--font-sans-inter)' }}>Shortlist</span>
            </div>
            <p className="text-[#F5F5F5]/40 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-sans-inter)' }}>
              Your business, always available
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#F5F5F5]/50 hover:text-[#F4F1EC] hover:bg-white/10 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-[#F5F5F5]/40 text-xs uppercase tracking-wider font-semibold mb-4" style={{ fontFamily: 'var(--font-sans-inter)' }}>
                {category}
              </p>
              <div className="space-y-2.5">
                {links.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[#F5F5F5]/60 text-sm hover:text-[#F5F5F5] transition-colors"
                    style={{ fontFamily: 'var(--font-sans-inter)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-[#F5F5F5]/30 text-xs" style={{ fontFamily: 'var(--font-sans-inter)' }}>
            &copy; 2026 Shortlist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SmartPagesV2() {
  // Hide the SmartPage chat widget on this page
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '#slp-widget-container { display: none !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <main className="min-h-screen bg-[#1A1A1A] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <StickyNav />
      <HeroSection />
      <SolutionSection />
      <ProblemSection />
      <SocialProofStrip />
      <IndustryCarousel />
      <ToolShedSection />
      <StripeSpotlight />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
