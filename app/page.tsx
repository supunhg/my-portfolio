import { Header } from "@/components/Header";
import { HeroStage } from "@/components/HeroStage";
import { Philosophy } from "@/components/Philosophy";
import { PillarLab } from "@/components/PillarLab";
import { PillarForensics } from "@/components/PillarForensics";
import { PillarCreative } from "@/components/PillarCreative";
import { SpecSheet } from "@/components/SpecSheet";
import { ContactDossier } from "@/components/ContactDossier";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8f7f4] text-[#141619]">
      <Header />
      <HeroStage />
      <Philosophy />
      <PillarLab />
      <PillarForensics />
      <PillarCreative />
      <SpecSheet />
      <ContactDossier />
      <Footer />
    </main>
  );
}
