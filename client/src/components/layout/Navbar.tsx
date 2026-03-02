import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import rhsLogo from "@assets/rhslogo_1772235631217.jpeg";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Details", href: "/#details" },
    { name: "Schedule", href: "/#schedule" },
    { name: "Memories", href: "/memory-wall" },
    { name: "Photos", href: "/photo-gallery" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={rhsLogo} 
              alt="Ramstein High School Logo" 
              className="w-12 h-12 rounded-full object-cover varsity-shadow border-2 border-foreground transition-transform group-hover:scale-105 bg-white"
            />
            <div className="hidden sm:block">
              <span className="block font-display text-primary text-xl leading-none">Ramstein</span>
              <span className="block font-serif text-sm font-bold text-foreground">Class of '88</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-foreground hover:text-primary transition-colors uppercase tracking-widest relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
            <Button className="bg-secondary text-white hover:bg-secondary/90 varsity-shadow font-bold uppercase tracking-wider rounded-none border-2 border-transparent">
              RSVP Soon
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary p-2"
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b shadow-lg absolute w-full left-0 animate-in slide-in-from-top-4">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-bold text-foreground hover:text-primary hover:bg-muted rounded-md uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
                data-testid={`link-mobile-${link.name.toLowerCase()}`}
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full bg-secondary text-white hover:bg-secondary/90 varsity-shadow font-bold uppercase tracking-wider rounded-none">
              RSVP Soon
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}