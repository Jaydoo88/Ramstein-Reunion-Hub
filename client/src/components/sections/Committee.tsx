import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";
import jaySchuhPhoto from "@assets/jayschuh_1772250109274.jpg";
import jasonPhoto from "@assets/1665088037422_1772290199657.jpg";
import julasPhoto from "@assets/julas.jpg";

export function Committee() {
  const getPhoto = (photoName: string | undefined) => {
    if (photoName === "jay") return jaySchuhPhoto;
    if (photoName === "jason") return jasonPhoto;
    if (photoName === "julas") return julasPhoto;
    return null;
  };

  return (
    <section className="py-24 bg-white border-y-4 border-rhs-gold relative">
      {/* Decorative texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-rhs-navy mb-6 tracking-wider uppercase"
          >
            {siteContent.committee.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {siteContent.committee.description}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {siteContent.committee.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-muted border border-border p-6 text-center group hover:bg-rhs-blue/5 transition-colors"
            >
              {member.photo && member.photoName ? (
                <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full border-4 border-rhs-navy shadow-sm group-hover:scale-110 transition-transform">
                  <img src={getPhoto(member.photoName) || ""} alt={member.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white border-4 border-rhs-navy text-rhs-navy rounded-full mx-auto mb-4 flex items-center justify-center font-display text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>
              )}
              
              <h3 className="font-serif font-bold text-xl text-rhs-navy mb-1">{member.name}</h3>
              <p className="font-sans text-rhs-blue font-semibold text-sm uppercase tracking-wider mb-3">{member.role}</p>
              
              {member.name !== "TBD" && member.email && (
                <div className="flex justify-center text-sm mt-auto pt-2">
                  <a 
                    href={`mailto:${member.email}?subject=Ramstein%20Reunion%20Planning%20Committee`} 
                    className="text-rhs-navy font-bold hover:text-rhs-red transition-colors inline-flex items-center gap-1"
                  >
                    Contact {member.name.split(' ')[0]}
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}