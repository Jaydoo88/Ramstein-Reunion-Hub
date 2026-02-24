import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";
import { MapPin, CalendarDays } from "lucide-react";

export function EventInfo() {
  return (
    <section className="py-24 bg-white relative" id="details">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl text-rhs-navy mb-6 tracking-wider uppercase inline-block relative">
              {siteContent.reunionInfo.title}
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-rhs-gold"></span>
            </h2>
            <p className="font-sans text-lg text-gray-600 mt-8 max-w-2xl mx-auto leading-relaxed">
              {siteContent.reunionInfo.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-rhs-blue/5 border-2 border-rhs-blue p-8 flex flex-col items-center text-center varsity-shadow relative group hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-rhs-blue text-white flex items-center justify-center mb-6 border-2 border-rhs-navy group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <h3 className="font-serif font-bold text-2xl text-rhs-navy mb-4">Location</h3>
              <p className="font-sans text-gray-700 font-medium">
                {siteContent.reunionInfo.location}
              </p>
            </motion.div>

            {/* Date Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-rhs-red/5 border-2 border-rhs-red p-8 flex flex-col items-center text-center varsity-shadow relative group hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 rounded-full bg-rhs-red text-white flex items-center justify-center mb-6 border-2 border-rhs-navy group-hover:scale-110 transition-transform">
                <CalendarDays size={28} />
              </div>
              <h3 className="font-serif font-bold text-2xl text-rhs-navy mb-4">Dates</h3>
              <p className="font-sans text-gray-700 font-medium">
                {siteContent.reunionInfo.dates}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}