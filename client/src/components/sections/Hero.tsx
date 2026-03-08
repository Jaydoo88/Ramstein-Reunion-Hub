import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { MailingListModal } from "@/components/ui/MailingListModal";
import { ScheduleModal } from "@/components/ui/ScheduleModal";
import heroBg from "@assets/image_1771987222394.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-rhs-navy pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Vintage High School Building" 
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rhs-navy/80 via-rhs-navy/60 to-rhs-navy/95"></div>
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Class Year Badge */}
            <div className="inline-block mb-6 px-6 py-2 bg-rhs-red/20 border-2 border-rhs-red backdrop-blur-sm rounded-sm">
              <span className="font-serif text-rhs-red font-bold uppercase tracking-[0.2em] text-sm">
                {siteContent.hero.className}
              </span>
            </div>

            {/* School Name */}
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-4 opacity-90">
              {siteContent.hero.schoolName}
            </h2>

            {/* Main Title - Varsity Style */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 text-stroke-rhs drop-shadow-2xl">
              {siteContent.hero.eventTitle}
            </h1>

            {/* Date/Location Strip */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 font-serif text-lg md:text-xl text-rhs-gold">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-rhs-gold hidden md:block"></span>
                {siteContent.hero.dateSnippet}
                <span className="w-8 h-[2px] bg-rhs-gold hidden md:block"></span>
              </div>
            </div>

            {/* Pill Badge */}
            {siteContent.hero.pillBadge && (
              <div className="inline-block mb-8 px-6 py-2 bg-rhs-blue/90 border border-white/20 text-white rounded-full text-sm font-bold tracking-wider uppercase shadow-lg backdrop-blur-md">
                {siteContent.hero.pillBadge}
              </div>
            )}

            {/* Description */}
            <p className="font-sans text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              {siteContent.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <MailingListModal>
                <Button size="lg" className="w-full sm:w-auto bg-rhs-red hover:bg-rhs-red/90 text-white font-bold uppercase tracking-wider text-lg px-8 py-6 rounded-none varsity-shadow border-2 border-white transition-transform hover:-translate-y-1">
                  {siteContent.hero.ctaPrimary}
                </Button>
              </MailingListModal>
              <ScheduleModal>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold uppercase tracking-wider text-lg px-8 py-6 rounded-none transition-transform hover:-translate-y-1">
                  {siteContent.hero.ctaSecondary}
                </Button>
              </ScheduleModal>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-rhs-gold z-20"></div>
    </section>
  );
}