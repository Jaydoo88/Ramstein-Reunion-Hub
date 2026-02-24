import { Hero } from "@/components/sections/Hero";
import { Countdown } from "@/components/sections/Countdown";
import { EventInfo } from "@/components/sections/EventInfo";
import { Schedule } from "@/components/sections/Schedule";
import { Teasers } from "@/components/sections/Teasers";
import { Committee } from "@/components/sections/Committee";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
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