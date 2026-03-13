'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users,
  UtensilsCrossed,
  Wrench,
  Building2,
  MessageCircle,
  Calendar,
  Bell,
  ShoppingBag,
  MapPin,
  Megaphone,
  Star,
  Zap,
  Search,
  CheckCircle,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PipeCard {
  id: number;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  pipeIndex: number;
  progress: number;
}

interface ActivityItem {
  id: number;
  text: string;
}

// =============================================================================
// CARD DATA PER PIPE
// =============================================================================

const pipeCards = [
  // Communities pipe (index 0)
  [
    { text: "Pool hours answered instantly", icon: MessageCircle },
    { text: "4,800 residents added", icon: Users },
    { text: "Community event — 84 RSVPs", icon: Calendar },
    { text: "Parking update pushed to 1,800 homes", icon: Bell },
  ],
  // Local Eats pipe (index 1)
  [
    { text: "2 orders placed — pickup at 6:30", icon: ShoppingBag },
    { text: "Food truck night booked", icon: MapPin },
    { text: "Happy hour visible to 12,000 residents", icon: Megaphone },
    { text: "5-star review posted", icon: Star },
  ],
  // Service Pros pipe (index 2)
  [
    { text: "Landscaping booked — Thursday 10am", icon: Wrench },
    { text: "Lead captured at 11:47pm", icon: Zap },
    { text: "Plumber found through Local Biz tab", icon: Search },
    { text: "Booking confirmed via chat", icon: CheckCircle },
  ],
];

const activityMessages = [
  "Lakewood Estates joined — 4,800 residents added to Your City",
  "Nito's Empanadas now discoverable to 18,500 residents",
  "City-wide food festival shared to 8 communities",
  "Mike's Landscaping booked 3 jobs this week through chat",
  "The Reserve HOA joined — 3,200 residents added",
];

const sourceNodes = [
  { label: "Communities", icon: Users },
  { label: "Local Eats", icon: UtensilsCrossed },
  { label: "Service Pros", icon: Wrench },
];

// =============================================================================
// NETWORK DIAGRAM COMPONENT
// =============================================================================

function NetworkDiagram() {
  const [cards, setCards] = useState<PipeCard[]>([]);
  const [cardIdCounter, setCardIdCounter] = useState(0);
  const [pulsingNodes, setPulsingNodes] = useState<Set<number>>(new Set());
  const [hubPulsing, setHubPulsing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Spawn cards on each pipe
  useEffect(() => {
    const pipeTimers: NodeJS.Timeout[] = [];
    const cardIndices = [0, 0, 0]; // Track which card to show next per pipe

    sourceNodes.forEach((_, pipeIndex) => {
      const spawnCard = () => {
        const cardData = pipeCards[pipeIndex][cardIndices[pipeIndex]];
        cardIndices[pipeIndex] = (cardIndices[pipeIndex] + 1) % pipeCards[pipeIndex].length;

        // Pulse the source node
        setPulsingNodes(prev => new Set(prev).add(pipeIndex));
        setTimeout(() => {
          setPulsingNodes(prev => {
            const next = new Set(prev);
            next.delete(pipeIndex);
            return next;
          });
        }, 400);

        setCardIdCounter(prev => {
          const newId = prev + 1;
          setCards(currentCards => [
            ...currentCards,
            {
              id: newId,
              text: cardData.text,
              icon: cardData.icon,
              pipeIndex,
              progress: 0,
            },
          ]);
          return newId;
        });
      };

      // Stagger initial spawns
      setTimeout(() => {
        spawnCard();
        pipeTimers.push(setInterval(spawnCard, 4000 + pipeIndex * 500));
      }, pipeIndex * 1200);
    });

    return () => pipeTimers.forEach(clearInterval);
  }, []);

  // Handle card reaching hub
  const handleCardComplete = useCallback((cardId: number) => {
    setHubPulsing(true);
    setTimeout(() => setHubPulsing(false), 400);
    setCards(currentCards => currentCards.filter(c => c.id !== cardId));
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Desktop Layout */}
      <div className="hidden md:block relative h-[400px]">
        <DesktopDiagram
          cards={cards}
          pulsingNodes={pulsingNodes}
          hubPulsing={hubPulsing}
          onCardComplete={handleCardComplete}
        />
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden relative">
        <MobileDiagram
          cards={cards}
          pulsingNodes={pulsingNodes}
          hubPulsing={hubPulsing}
          onCardComplete={handleCardComplete}
        />
      </div>
    </div>
  );
}

// =============================================================================
// DESKTOP DIAGRAM
// =============================================================================

interface DiagramProps {
  cards: PipeCard[];
  pulsingNodes: Set<number>;
  hubPulsing: boolean;
  onCardComplete: (id: number) => void;
}

function DesktopDiagram({ cards, pulsingNodes, hubPulsing, onCardComplete }: DiagramProps) {
  // Node positions (percentages)
  const sourcePositions = [
    { x: 12, y: 15 },
    { x: 12, y: 50 },
    { x: 12, y: 85 },
  ];
  const hubPosition = { x: 88, y: 50 };

  return (
    <>
      {/* SVG Pipes */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {sourcePositions.map((source, index) => {
          const startX = source.x + 4;
          const startY = source.y;
          const endX = hubPosition.x - 4;
          const endY = hubPosition.y;
          const midX = (startX + endX) / 2;

          return (
            <g key={index}>
              {/* Glow layer */}
              <motion.path
                d={`M ${startX}% ${startY}% C ${midX}% ${startY}%, ${midX}% ${endY}%, ${endX}% ${endY}%`}
                stroke="#4ade80"
                strokeWidth="4"
                fill="none"
                opacity="0.3"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
              {/* Main line */}
              <motion.path
                d={`M ${startX}% ${startY}% C ${midX}% ${startY}%, ${midX}% ${endY}%, ${endX}% ${endY}%`}
                stroke="#4ade80"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Source Nodes */}
      {sourceNodes.map((node, index) => (
        <SourceNode
          key={index}
          node={node}
          position={sourcePositions[index]}
          isPulsing={pulsingNodes.has(index)}
          layout="desktop"
        />
      ))}

      {/* Hub Node */}
      <HubNode position={hubPosition} isPulsing={hubPulsing} layout="desktop" />

      {/* Traveling Cards */}
      <AnimatePresence>
        {cards.map((card) => (
          <TravelingCard
            key={card.id}
            card={card}
            sourcePosition={sourcePositions[card.pipeIndex]}
            hubPosition={hubPosition}
            onComplete={() => onCardComplete(card.id)}
            layout="desktop"
          />
        ))}
      </AnimatePresence>
    </>
  );
}

// =============================================================================
// MOBILE DIAGRAM
// =============================================================================

function MobileDiagram({ cards, pulsingNodes, hubPulsing, onCardComplete }: DiagramProps) {
  // Vertical layout positions
  const sourcePositions = [
    { x: 50, y: 8 },
    { x: 50, y: 30 },
    { x: 50, y: 52 },
  ];
  const hubPosition = { x: 50, y: 85 };

  return (
    <div className="relative h-[500px]">
      {/* SVG Pipes */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glowMobile" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {sourcePositions.map((source, index) => {
          const startY = source.y + 6;
          const endY = hubPosition.y - 6;

          return (
            <g key={index}>
              {/* Glow layer */}
              <motion.line
                x1={`${source.x}%`}
                y1={`${startY}%`}
                x2={`${hubPosition.x}%`}
                y2={`${endY}%`}
                stroke="#4ade80"
                strokeWidth="3"
                opacity="0.3"
                filter="url(#glowMobile)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              />
              {/* Main line */}
              <motion.line
                x1={`${source.x}%`}
                y1={`${startY}%`}
                x2={`${hubPosition.x}%`}
                y2={`${endY}%`}
                stroke="#4ade80"
                strokeWidth="2"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Source Nodes */}
      {sourceNodes.map((node, index) => (
        <SourceNode
          key={index}
          node={node}
          position={sourcePositions[index]}
          isPulsing={pulsingNodes.has(index)}
          layout="mobile"
        />
      ))}

      {/* Hub Node */}
      <HubNode position={hubPosition} isPulsing={hubPulsing} layout="mobile" />

      {/* Traveling Cards */}
      <AnimatePresence>
        {cards.map((card) => (
          <TravelingCard
            key={card.id}
            card={card}
            sourcePosition={sourcePositions[card.pipeIndex]}
            hubPosition={hubPosition}
            onComplete={() => onCardComplete(card.id)}
            layout="mobile"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// SOURCE NODE COMPONENT
// =============================================================================

interface SourceNodeProps {
  node: { label: string; icon: React.ComponentType<{ className?: string }> };
  position: { x: number; y: number };
  isPulsing: boolean;
  layout: 'desktop' | 'mobile';
}

function SourceNode({ node, position, isPulsing, layout }: SourceNodeProps) {
  const IconComponent = node.icon;
  const isDesktop = layout === 'desktop';

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={`${isDesktop ? 'w-14 h-14' : 'w-12 h-12'} rounded-full bg-[#2a2a2a] border-2 border-[#4ade80]/60 flex items-center justify-center`}
        animate={isPulsing ? {
          boxShadow: ['0 0 0 0 rgba(74, 222, 128, 0)', '0 0 20px 8px rgba(74, 222, 128, 0.5)', '0 0 0 0 rgba(74, 222, 128, 0)'],
          borderColor: ['rgba(74, 222, 128, 0.6)', 'rgba(74, 222, 128, 1)', 'rgba(74, 222, 128, 0.6)'],
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <IconComponent className={`${isDesktop ? 'w-6 h-6' : 'w-5 h-5'} text-[#4ade80]`} />
      </motion.div>
      <span className={`${isDesktop ? 'text-sm' : 'text-xs'} font-medium text-[#f5f5f5] whitespace-nowrap`}>
        {node.label}
      </span>
    </motion.div>
  );
}

// =============================================================================
// HUB NODE COMPONENT
// =============================================================================

interface HubNodeProps {
  position: { x: number; y: number };
  isPulsing: boolean;
  layout: 'desktop' | 'mobile';
}

function HubNode({ position, isPulsing, layout }: HubNodeProps) {
  const isDesktop = layout === 'desktop';

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.div
        className={`${isDesktop ? 'w-20 h-20' : 'w-16 h-16'} rounded-full bg-[#4ade80]/20 border-2 border-[#4ade80] flex items-center justify-center`}
        animate={isPulsing ? {
          boxShadow: ['0 0 20px 0 rgba(74, 222, 128, 0.3)', '0 0 40px 12px rgba(74, 222, 128, 0.6)', '0 0 20px 0 rgba(74, 222, 128, 0.3)'],
          scale: [1, 1.05, 1],
        } : {
          boxShadow: ['0 0 15px 0 rgba(74, 222, 128, 0.2)', '0 0 25px 4px rgba(74, 222, 128, 0.35)', '0 0 15px 0 rgba(74, 222, 128, 0.2)'],
        }}
        transition={isPulsing ? { duration: 0.4 } : { duration: 2.5, repeat: Infinity }}
      >
        <Building2 className={`${isDesktop ? 'w-9 h-9' : 'w-7 h-7'} text-[#4ade80]`} />
      </motion.div>
      <span className={`${isDesktop ? 'text-base' : 'text-sm'} font-semibold text-[#4ade80] whitespace-nowrap`}>
        Your City
      </span>
    </motion.div>
  );
}

// =============================================================================
// TRAVELING CARD COMPONENT
// =============================================================================

interface TravelingCardProps {
  card: PipeCard;
  sourcePosition: { x: number; y: number };
  hubPosition: { x: number; y: number };
  onComplete: () => void;
  layout: 'desktop' | 'mobile';
}

function TravelingCard({ card, sourcePosition, hubPosition, onComplete, layout }: TravelingCardProps) {
  const IconComponent = card.icon;
  const isDesktop = layout === 'desktop';

  // Calculate start and end positions
  const startX = sourcePosition.x + (isDesktop ? 6 : 0);
  const startY = sourcePosition.y + (isDesktop ? 0 : 5);
  const endX = hubPosition.x + (isDesktop ? -6 : 0);
  const endY = hubPosition.y + (isDesktop ? 0 : -6);

  // Generate intermediate points for smooth curve (desktop only)
  const points = isDesktop ? [
    { x: startX, y: sourcePosition.y },
    { x: (startX + endX) / 2, y: (sourcePosition.y + hubPosition.y) / 2 },
    { x: endX, y: hubPosition.y },
  ] : [
    { x: sourcePosition.x, y: startY },
    { x: hubPosition.x, y: (startY + endY) / 2 },
    { x: hubPosition.x, y: endY },
  ];

  return (
    <motion.div
      className={`absolute z-10 flex items-center gap-1.5 ${isDesktop ? 'px-3 py-1.5' : 'px-2 py-1'} rounded-full bg-[#2a2a2a]/95 border border-[#4ade80]/40 shadow-lg backdrop-blur-sm`}
      style={{
        left: `${points[0].x}%`,
        top: `${points[0].y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        left: points.map(p => `${p.x}%`),
        top: points.map(p => `${p.y}%`),
        opacity: [0, 1, 1, 1, 0],
        scale: [0.7, 1, 1, 1, 0.7],
      }}
      transition={{
        duration: 3.5,
        ease: "easeInOut",
        times: [0, 0.1, 0.5, 0.9, 1],
      }}
      onAnimationComplete={onComplete}
    >
      <IconComponent className={`${isDesktop ? 'w-3.5 h-3.5' : 'w-3 h-3'} text-[#4ade80] flex-shrink-0`} />
      <span className={`${isDesktop ? 'text-xs' : 'text-[10px]'} text-[#f5f5f5] whitespace-nowrap`}>
        {card.text}
      </span>
    </motion.div>
  );
}

// =============================================================================
// ACTIVITY FEED COMPONENT
// =============================================================================

function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [itemIdCounter, setItemIdCounter] = useState(0);
  const messageIndex = useRef(0);

  useEffect(() => {
    // Initialize with first 3 items
    const initialItems: ActivityItem[] = [];
    for (let i = 0; i < 3; i++) {
      initialItems.push({
        id: i,
        text: activityMessages[i],
      });
    }
    setItems(initialItems);
    setItemIdCounter(3);
    messageIndex.current = 3;

    // Add new items periodically
    const interval = setInterval(() => {
      const newMessage = activityMessages[messageIndex.current % activityMessages.length];
      messageIndex.current++;

      setItemIdCounter(prev => {
        const newId = prev + 1;
        setItems(currentItems => {
          const updated = [...currentItems, { id: newId, text: newMessage }];
          // Keep only last 3 items
          if (updated.length > 3) {
            return updated.slice(-3);
          }
          return updated;
        });
        return newId;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 md:mt-12">
      <div className="relative h-[120px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-3 px-4 py-2.5 mb-2 rounded-lg bg-[#2a2a2a]/80 border border-[#4ade80]/20"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              layout
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0" />
              <span className="text-sm text-[#f5f5f5]/90">{item.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#1f1f1f] overflow-hidden pt-20 md:pt-24">
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Headlines */}
        <div className="text-center mb-10 md:mb-14">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[#f5f5f5] mb-5 md:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            One platform. Every neighbor.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Every business. Every block.
          </motion.h1>

          <motion.p
            className="text-base md:text-xl text-[#f5f5f5]/70 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            SmartAssistants for communities, restaurants, and local businesses — all connected
            through one growing network that gets more powerful every time someone joins.
          </motion.p>
        </div>

        {/* Network Diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <NetworkDiagram />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ActivityFeed />
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function SmartAssistantV2Page() {
  return (
    <main className="min-h-screen bg-[#1f1f1f]">
      <HeroSection />
    </main>
  );
}
