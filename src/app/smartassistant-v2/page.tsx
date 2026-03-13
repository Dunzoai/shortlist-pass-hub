'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UtensilsCrossed,
  Wrench,
  Network,
  ShoppingBag,
  Calendar,
  Star,
  Home,
  Megaphone,
  MessageCircle,
  MapPin,
  Zap,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface StoryCard {
  id: number;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  sourceNode: number; // 0, 1, or 2
}

interface ToastNotification {
  id: number;
  text: string;
}

// =============================================================================
// STORY CARD DATA
// =============================================================================

const storyCardTemplates = [
  { text: "New community joined — 4,800 residents added", icon: Users },
  { text: "2 empanadas ordered — pickup at 6:30", icon: ShoppingBag },
  { text: "City-wide event shared to 6 communities", icon: Calendar },
  { text: "Landscaping estimate booked through chat", icon: Wrench },
  { text: "5-star review posted", icon: Star },
  { text: "Lakewood Estates joined — 3,200 residents added", icon: Home },
  { text: "Happy hour special pushed to 12,000 residents", icon: Megaphone },
  { text: "Resident asked about pool hours — answered instantly", icon: MessageCircle },
  { text: "Food truck location updated for Friday", icon: MapPin },
  { text: "New lead captured at 11:47pm", icon: Zap },
];

const toastMessages = [
  "Lakewood Estates just joined — 4,800 residents added",
  "Nito's Empanadas now discoverable to 18,500 residents",
  "City-wide food festival shared to 8 communities",
  "Mike's Landscaping booked 3 jobs this week through chat",
  "The Reserve HOA just joined — 3,200 residents added",
];

// =============================================================================
// NETWORK DIAGRAM COMPONENT
// =============================================================================

function NetworkDiagram() {
  const [cards, setCards] = useState<StoryCard[]>([]);
  const [cardIdCounter, setCardIdCounter] = useState(0);

  // Spawn new cards periodically
  useEffect(() => {
    const spawnCard = () => {
      const template = storyCardTemplates[Math.floor(Math.random() * storyCardTemplates.length)];
      const sourceNode = Math.floor(Math.random() * 3);

      setCardIdCounter(prev => {
        const newId = prev + 1;
        setCards(currentCards => [
          ...currentCards,
          {
            id: newId,
            text: template.text,
            icon: template.icon,
            sourceNode,
          },
        ]);
        return newId;
      });
    };

    // Initial spawn
    spawnCard();

    // Spawn new cards every 1.5 seconds
    const interval = setInterval(spawnCard, 1500);

    return () => clearInterval(interval);
  }, []);

  // Remove cards after animation completes
  const handleCardComplete = useCallback((cardId: number) => {
    setCards(currentCards => currentCards.filter(c => c.id !== cardId));
  }, []);

  // Source node positions (left side) - percentages
  const sourceNodes = [
    { x: 8, y: 20, label: "Communities", icon: Users },
    { x: 8, y: 50, label: "Local Eats", icon: UtensilsCrossed },
    { x: 8, y: 80, label: "Service Pros", icon: Wrench },
  ];

  // Hub node position (right side)
  const hubNode = { x: 85, y: 50, label: "The Network" };

  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      {/* SVG for connection lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Animated connection lines */}
        {sourceNodes.map((node, index) => (
          <motion.path
            key={index}
            d={`M ${node.x + 5}% ${node.y}% Q 50% ${node.y}% ${hubNode.x - 5}% ${hubNode.y}%`}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          />
        ))}
      </svg>

      {/* Source Nodes */}
      {sourceNodes.map((node, index) => (
        <motion.div
          key={index}
          className="absolute flex flex-col items-center gap-2"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#4ade80]/20 border-2 border-[#4ade80] flex items-center justify-center">
            <node.icon className="w-6 h-6 md:w-7 md:h-7 text-[#4ade80]" />
          </div>
          <span className="text-xs md:text-sm font-medium text-[#f5f5f0] whitespace-nowrap">
            {node.label}
          </span>
        </motion.div>
      ))}

      {/* Hub Node */}
      <motion.div
        className="absolute flex flex-col items-center gap-2"
        style={{ left: `${hubNode.x}%`, top: `${hubNode.y}%`, transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#4ade80]/30 border-2 border-[#4ade80] flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 20px rgba(74, 222, 128, 0.3)',
              '0 0 40px rgba(74, 222, 128, 0.5)',
              '0 0 20px rgba(74, 222, 128, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Network className="w-8 h-8 md:w-10 md:h-10 text-[#4ade80]" />
        </motion.div>
        <span className="text-sm md:text-base font-semibold text-[#4ade80] whitespace-nowrap">
          {hubNode.label}
        </span>
      </motion.div>

      {/* Floating Story Cards */}
      <AnimatePresence>
        {cards.map((card) => (
          <FloatingCard
            key={card.id}
            card={card}
            sourceNode={sourceNodes[card.sourceNode]}
            hubNode={hubNode}
            onComplete={() => handleCardComplete(card.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// FLOATING CARD COMPONENT
// =============================================================================

interface FloatingCardProps {
  card: StoryCard;
  sourceNode: { x: number; y: number };
  hubNode: { x: number; y: number };
  onComplete: () => void;
}

function FloatingCard({ card, sourceNode, hubNode, onComplete }: FloatingCardProps) {
  const IconComponent = card.icon;

  // Calculate path - start from source, end at hub
  const startX = sourceNode.x + 8;
  const startY = sourceNode.y;
  const endX = hubNode.x - 8;
  const endY = hubNode.y;

  return (
    <motion.div
      className="absolute z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-[#2a2a2a] border border-[#4ade80]/30 shadow-lg"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        left: [`${startX}%`, `${(startX + endX) / 2}%`, `${endX}%`],
        top: [`${startY}%`, `${(startY + endY) / 2}%`, `${endY}%`],
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1, 1, 0.8],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <IconComponent className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
      <span className="text-xs text-[#f5f5f0] whitespace-nowrap max-w-[200px] truncate">
        {card.text}
      </span>
    </motion.div>
  );
}

// =============================================================================
// TOAST NOTIFICATION COMPONENT
// =============================================================================

function ToastNotifications() {
  const [currentToast, setCurrentToast] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToast((prev) => (prev + 1) % toastMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentToast}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2a2a2a]/90 border border-[#4ade80]/30 shadow-xl backdrop-blur-sm max-w-[320px]"
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -10, x: 10 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse flex-shrink-0" />
          <span className="text-sm text-[#f5f5f0]">{toastMessages[currentToast]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#1a1a1a] overflow-hidden pt-16">
      {/* Toast Notifications */}
      <ToastNotifications />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Headlines */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#f5f5f0] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            One platform. Every neighbor.
            <br />
            Every business. Every block.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#f5f5f0]/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            SmartAssistants for communities, restaurants, and local businesses — all connected
            through one growing network that gets more powerful every time someone joins.
          </motion.p>
        </div>

        {/* Network Diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <NetworkDiagram />
        </motion.div>
      </div>

      {/* Subtle gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none" />
    </section>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function SmartAssistantV2Page() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <HeroSection />
    </main>
  );
}
