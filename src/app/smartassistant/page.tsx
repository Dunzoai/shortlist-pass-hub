'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Building2, Store } from 'lucide-react';

// Node positions and labels
const nodes = [
  { id: 1, x: 8, y: 12, label: 'Willow Creek HOA' },
  { id: 2, x: 12, y: 55, label: "Tony's Pizza" },
  { id: 3, x: 8, y: 88, label: 'Bright Electric Co.' },
  { id: 4, x: 88, y: 18, label: 'Lakeside Villas' },
  { id: 5, x: 92, y: 65, label: 'The Garden District' },
  { id: 6, x: 50, y: 92, label: 'Main St. Bakery' },
  { id: 7, x: 85, y: 8, label: 'Summit Plumbing' },
  { id: 8, x: 92, y: 88, label: 'Riverside Condos' },
];

// Line connections (pairs of node IDs)
const lines = [
  [1, 4], [2, 4], [3, 4], [4, 5], [4, 7],
  [2, 6], [5, 8], [6, 8], [1, 2], [3, 6], [7, 5],
];

// Lines with traveling dots (subset of lines)
const travelingDotLines = [
  { from: 1, to: 4 },
  { from: 2, to: 6 },
  { from: 4, to: 5 },
  { from: 6, to: 8 },
];

function NetworkBackground() {
  return (
    <div className="fixed inset-0 bg-[#1a1a1a]" style={{ opacity: 0.4 }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Lines */}
        {lines.map(([fromId, toId], index) => {
          const fromNode = nodes.find(n => n.id === fromId)!;
          const toNode = nodes.find(n => n.id === toId)!;
          const duration = 3 + Math.random() * 3;

          return (
            <motion.line
              key={`line-${fromId}-${toId}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="#4ade80"
              strokeWidth="0.15"
              opacity="0.3"
              strokeDasharray="2 2"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -20 }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay: index * 0.2,
              }}
            />
          );
        })}

        {/* Traveling dots */}
        {travelingDotLines.map(({ from, to }, index) => {
          const fromNode = nodes.find(n => n.id === from)!;
          const toNode = nodes.find(n => n.id === to)!;

          return (
            <motion.circle
              key={`dot-${from}-${to}`}
              r="0.4"
              fill="#4ade80"
              opacity="0.8"
              initial={{ cx: `${fromNode.x}%`, cy: `${fromNode.y}%` }}
              animate={{
                cx: [`${fromNode.x}%`, `${toNode.x}%`, `${fromNode.x}%`],
                cy: [`${fromNode.y}%`, `${toNode.y}%`, `${fromNode.y}%`],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: index * 1,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="0.8"
              fill="#4ade80"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.4,
              }}
            />
            <text
              x={`${node.x}%`}
              y={`${node.y + 3}%`}
              fill="#4ade80"
              fontSize="1.5"
              textAnchor="middle"
              opacity="0.6"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function SmartAssistantRoutingPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-[#1a1a1a]">
      {/* Hide the chat widget on this page */}
      <style jsx global>{`
        [data-slp-widget], .slp-widget, #slp-widget, [id^="slp-"] {
          display: none !important;
        }
      `}</style>

      {/* Animated SVG network background */}
      <NetworkBackground />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,0.3) 0%, rgba(26,26,26,0.5) 100%)',
        }}
      />

      {/* Modal overlay - no blur to preserve network visibility */}
      <motion.div
        className="absolute inset-0 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-[520px] bg-[#1f1f1f]/95 backdrop-blur-sm border border-[#2f2f2f] rounded-2xl p-5 md:p-10"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Top label */}
          <p className="text-xs uppercase tracking-widest text-[#4ade80] text-center mb-3 md:mb-4">
            Shortlist SmartAssistant
          </p>

          {/* Headline */}
          <h1 className="text-xl md:text-3xl font-bold text-white text-center mb-1 md:mb-2">
            What best describes you?
          </h1>

          {/* Subtext */}
          <p className="text-sm text-[#6b7280] text-center mb-5 md:mb-8">
            We'll show you exactly how SmartAssistant works for your world.
          </p>

          {/* Choice cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Community Manager Card */}
            <motion.button
              onClick={() => router.push('/smartassistant/hoa')}
              className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 md:p-7 text-left cursor-pointer transition-colors hover:border-[#4ade80] hover:bg-[#2f2f2f] h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Building2 className="w-7 h-7 md:w-8 md:h-8 text-[#4ade80] mb-3 md:mb-4" />
              <p className="text-[1.1rem] md:text-[1.2rem] font-bold text-white">
                I manage a community
              </p>
              <p className="text-[0.8rem] md:text-[0.875rem] text-[#6b7280] mt-1 md:mt-2">
                HOA, apartment complex, or residential community
              </p>
            </motion.button>

            {/* Business Owner Card */}
            <motion.button
              onClick={() => router.push('/smartassistant/business')}
              className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-5 md:p-7 text-left cursor-pointer transition-colors hover:border-[#4ade80] hover:bg-[#2f2f2f] h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Store className="w-7 h-7 md:w-8 md:h-8 text-[#4ade80] mb-3 md:mb-4" />
              <p className="text-[1.1rem] md:text-[1.2rem] font-bold text-white">
                I own a local business
              </p>
              <p className="text-[0.8rem] md:text-[0.875rem] text-[#6b7280] mt-1 md:mt-2">
                Restaurant, food truck, or service business
              </p>
            </motion.button>
          </div>

          {/* Bottom link */}
          <p className="text-xs text-[#6b7280] text-center mt-5 md:mt-8">
            Not sure?{' '}
            <a
              href="/smartassistant/hoa#contact"
              className="text-[#6b7280] hover:text-[#4ade80] transition-colors"
            >
              → Talk to us
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
