import { siteContent } from "@/lib/content";
import rhsLogo from "@assets/rhslogo_1772235631217.jpeg";

export function Footer() {
  return (
    <footer className="bg-rhs-navy text-white pt-16 pb-8 border-t-[8px] border-rhs-gold relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute opacity-[0.03] text-[20vw] font-display -top-10 -right-10 pointer-events-none select-none text-white">
        88
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={rhsLogo} 
                alt="Ramstein High School Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white bg-white"
              />
              <div>
                <span className="block font-display text-xl leading-none">{siteContent.hero.schoolName}</span>
                <span className="block font-serif text-sm font-bold text-gray-300">{siteContent.hero.className}</span>
              </div>
            </div>
            <p className="text-gray-400 font-sans text-sm max-w-xs leading-relaxed">
              {siteContent.footer.disclaimer}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-rhs-gold text-lg mb-4 tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li><a href="#details" className="text-gray-300 hover:text-white transition-colors">Reunion Details</a></li>
              <li><a href="#schedule" className="text-gray-300 hover:text-white transition-colors">Draft Schedule</a></li>
              <li><a href="#memories" className="text-gray-300 hover:text-white transition-colors">Memory Wall</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-rhs-gold text-lg mb-4 tracking-wider uppercase">Get in Touch</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <a href={`mailto:${siteContent.committee.contactEmail}`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>✉</span> {siteContent.committee.contactEmail}
                </a>
              </li>
              <li>
                <a href={siteContent.committee.facebookGroup} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>f</span> Join our Facebook Group
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm font-sans text-center md:text-left">
            {siteContent.footer.text}
          </p>
          <div className="flex gap-4 text-sm text-gray-500 font-sans">
            <span>Built by Alumni, for Alumni.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}