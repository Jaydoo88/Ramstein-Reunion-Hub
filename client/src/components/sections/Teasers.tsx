import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import memoryWallImg from "@/assets/images/memory-wall.jpg";
import photoGalleryImg from "@/assets/images/photo-gallery.jpg";
import whoIsAttendingImg from "@/assets/images/who-is-attending.jpg";

export function Teasers() {
  const teasers = [
    {
      ...siteContent.teasers.memoryWall,
      image: memoryWallImg,
      bgColor: "bg-rhs-blue",
      textColor: "text-rhs-blue"
    },
    {
      ...siteContent.teasers.photoGallery,
      image: photoGalleryImg,
      bgColor: "bg-rhs-red",
      textColor: "text-rhs-red"
    },
    {
      ...siteContent.teasers.whereAreTheyNow,
      image: whoIsAttendingImg,
      bgColor: "bg-rhs-navy",
      textColor: "text-rhs-navy"
    }
  ];

  return (
    <section className="py-24 bg-muted relative" id="memories">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-rhs-navy mb-6 tracking-wider uppercase">
            Reconnect & Reminisce
          </h2>
          <p className="font-sans text-lg text-gray-600">
            Features coming soon to help us catch up before the big weekend.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teasers.map((teaser, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border-2 border-border flex flex-col h-full group hover:border-rhs-navy transition-colors overflow-hidden varsity-shadow card"
            >
              {/* Image Header */}
              <div className="aspect-square overflow-hidden relative card-image">
                <div className="absolute inset-0 bg-[#00204E]/15 z-10 pointer-events-none"></div>
                <img 
                  src={teaser.image} 
                  alt={teaser.title} 
                  className="block w-full h-full object-cover transition-transform duration-[350ms] ease-in-out group-hover:scale-105" 
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className={`font-serif font-bold text-2xl mb-3 ${teaser.textColor}`}>
                  {teaser.title}
                </h3>
                <p className="font-sans text-gray-600 mb-6 flex-grow">
                  {teaser.description}
                </p>
                
                <Button 
                  variant="outline" 
                  className={`w-full border-2 font-bold uppercase tracking-wider rounded-none
                    ${teaser.textColor === 'text-rhs-blue' ? 'border-rhs-blue text-rhs-blue hover:bg-rhs-blue hover:text-white' : 
                      teaser.textColor === 'text-rhs-red' ? 'border-rhs-red text-rhs-red hover:bg-rhs-red hover:text-white' : 
                      'border-rhs-navy text-rhs-navy hover:bg-rhs-navy hover:text-white'}`}
                  disabled
                >
                  {teaser.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}