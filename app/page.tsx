import Navbar from "@/components/Navbar";
import { BoutiqueBand, EngagementModes, Hero, Method, Services } from "@/components/Sections1";
import { Contact, Footer, Founder, Insights, WhitePaperBand } from "@/components/Sections2";

export default function Home() {
  return (
    <main className="min-h-screen bg-noir-950">
      <Navbar />
      <Hero />
      <Services />
      <BoutiqueBand />
      <Method />
      <EngagementModes />
      <WhitePaperBand />
      <Insights />
      <Founder />
      <Contact />
      <Footer />
    </main>
  );
}
