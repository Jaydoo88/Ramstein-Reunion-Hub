import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function ScheduleModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const scheduleItems = [
    { day: "Friday", event: "Welcome Meetup", time: "6–9 PM" },
    { day: "Saturday", event: "Main Reunion Event", time: "5–11 PM" },
    { day: "Sunday", event: "Farewell Brunch", time: "10–12 PM" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[425px] bg-white border-2 border-rhs-gold"
        onCloseAutoFocus={(e) => {
          if (window.location.hash === '#schedule') {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-rhs-navy tracking-wide uppercase">
            Reunion Weekend Schedule
          </DialogTitle>
          <DialogDescription className="text-gray-600 font-sans text-base">
            Here’s a quick look at the tentative reunion itinerary.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 py-4">
          {scheduleItems.map((item, i) => (
            <div key={i} className="flex flex-row justify-between items-center p-4 bg-muted/50 border border-gray-100 rounded-md hover:border-rhs-gold/50 transition-colors group">
              <div className="flex flex-col">
                <span className="text-rhs-red font-bold uppercase text-xs tracking-widest mb-1">{item.day}</span>
                <span className="text-rhs-navy font-bold text-lg leading-tight">{item.event}</span>
              </div>
              <div className="text-gray-500 font-semibold text-sm whitespace-nowrap pl-4 group-hover:text-rhs-navy transition-colors">
                {item.time}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button 
            className="w-full bg-rhs-navy hover:bg-rhs-navy/90 text-white font-bold uppercase tracking-wider rounded-none py-6"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              // Delay the scroll to ensure the modal closes and releases focus first
              setTimeout(() => {
                window.location.hash = 'schedule';
                const el = document.getElementById('schedule');
                if (el) {
                  const yOffset = -80; // offset for fixed header if any
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }, 150);
            }}
          >
            View Full Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
