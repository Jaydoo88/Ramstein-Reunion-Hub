import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { Countdown } from "@/components/sections/Countdown";
import { EventInfo } from "@/components/sections/EventInfo";
import { Schedule } from "@/components/sections/Schedule";
import { Teasers } from "@/components/sections/Teasers";
import { Committee } from "@/components/sections/Committee";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  useEffect(() => {
    // Check if there is a hash in the URL when the component mounts
    if (window.location.hash) {
      const id = window.location.hash.substring(1); // remove the '#'
      // Use a short timeout to ensure the DOM is fully rendered before scrolling
      setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Hero />
      <Countdown />
      <EventInfo />
      <Schedule />
      <Teasers />
      <Committee />
      <FAQ />
    </>
  );
}