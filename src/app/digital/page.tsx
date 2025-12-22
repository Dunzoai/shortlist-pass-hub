"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function DigitalPage() {
  const bullets = [
    "Fast, modern sites built for performance",
    "Lightweight custom builds tailored to your needs",
    "No bloated templates — just what you need, done right",
  ];

  return (
    <main className="pt-16 min-h-screen flex flex-col">
      <section className="py-24 lg:py-32 flex-1">
        <Container>
          <div className="max-w-2xl">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-semibold text-[#F4F6FA] leading-tight mb-6"
            >
              Websites & Apps
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-lg text-[#A9B4C4] mb-10"
            >
              When templates aren&apos;t enough.
            </motion.p>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="space-y-4 mb-12"
            >
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-base text-[#A9B4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                  {bullet}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <a
                href="mailto:hello@shortlistpass.com"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-[#B08D57] text-[#0B1220] rounded-full hover:bg-[#c9a46a] transition-colors duration-300"
              >
                Get a demo
              </a>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A9B4C4]">
            <span>&copy; {new Date().getFullYear()} Shortlist Pass</span>
            <span>hello@shortlistpass.com</span>
          </div>
        </Container>
      </footer>
    </main>
  );
}
