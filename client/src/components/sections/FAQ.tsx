import { motion } from "framer-motion";
import { siteContent } from "@/lib/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section className="py-24 bg-muted relative" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-rhs-navy mb-6 tracking-wider uppercase">
              {siteContent.faq.title}
            </h2>
          </div>

          <div className="bg-white border-4 border-rhs-navy p-6 md:p-10 varsity-shadow">
            <Accordion type="single" collapsible className="w-full">
              {siteContent.faq.questions.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border-b border-border last:border-0"
                >
                  <AccordionTrigger className="font-serif font-bold text-lg text-left hover:text-rhs-blue text-rhs-navy data-[state=open]:text-rhs-blue transition-colors py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-gray-600 text-base leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}