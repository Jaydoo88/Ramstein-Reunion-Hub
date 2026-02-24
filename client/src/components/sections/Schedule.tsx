import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";

export function Schedule() {
  return (
    <section className="py-24 bg-rhs-navy text-white relative overflow-hidden" id="schedule">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rhs-blue via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6 tracking-wider uppercase">
            {siteContent.schedule.title}
          </h2>
          <p className="font-sans text-lg text-gray-300">
            {siteContent.schedule.description}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline connecting line */}
          <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-1 bg-rhs-blue/30 -translate-x-1/2 md:block hidden"></div>
          
          <div className="space-y-12">
            {siteContent.schedule.events.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-6 md:gap-0 relative ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-rhs-navy bg-rhs-gold items-center justify-center z-10">
                    <span className="w-3 h-3 rounded-full bg-rhs-navy"></span>
                  </div>

                  {/* Content Box */}
                  <div className={`md:w-1/2 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"} pl-12 md:pl-0 relative`}>
                    
                    {/* Mobile Timeline Node */}
                    <div className="md:hidden absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-rhs-navy bg-rhs-gold flex items-center justify-center z-10">
                      <span className="w-2 h-2 rounded-full bg-rhs-navy"></span>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-sm backdrop-blur-sm hover:bg-white/10 transition-colors group">
                      <div className="inline-block px-3 py-1 bg-rhs-blue text-white text-xs font-bold uppercase tracking-wider mb-3 rounded-sm">
                        {event.day}
                      </div>
                      <h4 className="font-serif font-bold text-xl text-rhs-gold mb-2 group-hover:text-white transition-colors">
                        {event.title}
                      </h4>
                      <p className="font-sans text-sm font-bold text-white/80 mb-2">
                        {event.time}
                      </p>
                      <p className="font-sans text-gray-300">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}