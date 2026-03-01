import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MailingListModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gradYear: "1988",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "duplicate" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx8WqR921m0XgLroHkFhsHusAihlwsInLQ1gFoMhqVUGNQpvqm3d593CmJgL-A-SZNt8g/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          gradYear: formData.gradYear,
          email: formData.email,
          sourcePage: window.location.pathname
        })
      });

      const data = await response.json();

      if (data.duplicate) {
        setStatus("duplicate");
      } else {
        setStatus("success");
      }
      
      setFormData({ firstName: "", lastName: "", email: "", gradYear: "1988" });
      
      // Optionally close modal after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => setStatus("idle"), 300); // reset status after closing animation
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Reset status when modal closes
        setTimeout(() => setStatus("idle"), 300);
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-rhs-navy text-white border-rhs-gold/30 [&>button]:text-white [&>button]:opacity-70 hover:[&>button]:opacity-100">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-rhs-gold tracking-wide">Join the Mailing List</DialogTitle>
          <DialogDescription className="text-gray-300 font-sans">
            Get the latest updates on the 40-year reunion straight to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        {status === "success" || status === "duplicate" ? (
          <div className="py-8 text-center animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              {status === "duplicate" ? "You’re already on the list!" : "You’re on the list!"}
            </h3>
            <p className="text-gray-300">
              {status === "duplicate" ? "You’re all set." : "Dallas updates coming soon."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-200">First Name *</label>
                <input
                  id="firstName"
                  required
                  type="text"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-gold text-white placeholder:text-gray-400"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  data-testid="input-firstname"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-200">Last Name *</label>
                <input
                  id="lastName"
                  required
                  type="text"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-gold text-white placeholder:text-gray-400"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  data-testid="input-lastname"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address *</label>
              <input
                id="email"
                required
                type="email"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-gold text-white placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gradYear" className="text-sm font-medium text-gray-200">Graduation Year *</label>
              <select
                id="gradYear"
                required
                className="w-full px-3 py-2 bg-rhs-navy border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rhs-gold text-white [&>option]:bg-rhs-navy"
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                data-testid="input-gradyear"
              >
                <option value="" disabled>Select Year</option>
                {Array.from({ length: 2020 - 1975 + 1 }, (_, i) => 1975 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {status === "error" && (
              <div className="text-red-200 text-sm font-medium bg-red-900/30 p-3 rounded border border-red-500/30 animate-in shake">
                Something went wrong — please try again.
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-none font-bold uppercase tracking-wider transition-colors"
                disabled={isSubmitting}
                data-testid="button-cancel-mailing-list"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-rhs-red hover:bg-rhs-red/90 text-white rounded-none font-bold uppercase tracking-wider transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                disabled={isSubmitting}
                data-testid="button-submit-mailing-list"
              >
                {isSubmitting ? "Sending..." : "Join Mailing List"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
