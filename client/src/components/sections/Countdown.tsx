import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(siteContent.countdown.targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 bg-muted relative overflow-hidden" id="countdown">
      {/* Varsity decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-rhs-blue"></div>
      <div className="absolute top-4 left-0 right-0 h-1 bg-rhs-red"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl text-rhs-navy mb-4 tracking-wider uppercase">
            {siteContent.countdown.title}
          </h2>
          <p className="font-sans text-muted-foreground mb-12 max-w-2xl mx-auto">
            {siteContent.countdown.statusMessage}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="bg-white border-4 border-rhs-navy p-6 flex flex-col items-center justify-center varsity-shadow group hover:-translate-y-2 transition-transform duration-300">
                <span className="font-display text-4xl md:text-6xl text-rhs-red mb-2">
                  {unit.value.toString().padStart(2, "0")}
                </span>
                <span className="font-serif font-bold text-rhs-navy uppercase tracking-widest text-sm md:text-base">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Varsity decorative lines */}
      <div className="absolute bottom-4 left-0 right-0 h-1 bg-rhs-red"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-rhs-blue"></div>
    </section>
  );
}