import Hero from "@/components/sections/Hero";
import StatsCounters from "@/components/sections/StatsCounters";
import WhyChoose from "@/components/sections/WhyChoose";
import SuccessStories from "@/components/sections/SuccessStories";

export default function Index() {
  return (
    <main>
      <Hero />
      <StatsCounters />
      <WhyChoose />
      <SuccessStories />
    </main>
  );
}
