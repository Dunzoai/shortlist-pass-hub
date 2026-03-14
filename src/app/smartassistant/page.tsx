'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Building2, Store } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SmartAssistantRoutingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated network pattern background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Three dots with connecting lines
    const dots = [
      { x: 0.3, y: 0.4, vx: 0.0003, vy: 0.0002 },
      { x: 0.6, y: 0.3, vx: -0.0002, vy: 0.0003 },
      { x: 0.5, y: 0.6, vx: 0.0002, vy: -0.0002 },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0.2 || dot.x > 0.8) dot.vx *= -1;
        if (dot.y < 0.2 || dot.y > 0.8) dot.vy *= -1;
      });

      // Draw lines
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x * canvas.width, dots[i].y * canvas.height);
          ctx.lineTo(dots[j].x * canvas.width, dots[j].y * canvas.height);
          ctx.stroke();
        }
      }

      // Draw dots
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x * canvas.width, dot.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1a1a1a]">
      {/* Animated network background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-[520px] bg-[#1f1f1f] border border-[#2f2f2f] rounded-2xl p-6 md:p-10"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Top label */}
          <p className="text-xs uppercase tracking-widest text-[#4ade80] text-center mb-4">
            Shortlist SmartAssistant
          </p>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
            What best describes you?
          </h1>

          {/* Subtext */}
          <p className="text-sm text-[#6b7280] text-center mb-8">
            We'll show you exactly how SmartAssistant works for your world.
          </p>

          {/* Choice cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Community Manager Card */}
            <motion.button
              onClick={() => router.push('/smartassistant/hoa')}
              className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-7 text-left cursor-pointer transition-colors hover:border-[#4ade80] hover:bg-[#2f2f2f] h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Building2 className="w-8 h-8 text-[#4ade80] mb-4" />
              <p className="text-[1.2rem] font-bold text-white">
                I manage a community
              </p>
              <p className="text-[0.875rem] text-[#6b7280] mt-2">
                HOA, apartment complex, or residential community
              </p>
            </motion.button>

            {/* Business Owner Card */}
            <motion.button
              onClick={() => router.push('/smartassistant/business')}
              className="bg-[#2a2a2a] border border-[#3f3f3f] rounded-xl p-7 text-left cursor-pointer transition-colors hover:border-[#4ade80] hover:bg-[#2f2f2f] h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Store className="w-8 h-8 text-[#4ade80] mb-4" />
              <p className="text-[1.2rem] font-bold text-white">
                I own a local business
              </p>
              <p className="text-[0.875rem] text-[#6b7280] mt-2">
                Restaurant, food truck, or service business
              </p>
            </motion.button>
          </div>

          {/* Bottom link */}
          <p className="text-xs text-[#6b7280] text-center mt-8">
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
