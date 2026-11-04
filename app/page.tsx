"use client";

import { useEffect, useState } from "react";
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
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      const infraEl = document.getElementById("infrastructure");
      const forensicsEl = document.getElementById("forensics");
      const creativeEl = document.getElementById("creative");
      const contactEl = document.getElementById("contact");

      const infraTop = infraEl?.offsetTop ?? 9999;
      const forensicsTop = forensicsEl?.offsetTop ?? 9999;
      const creativeTop = creativeEl?.offsetTop ?? 9999;
      const contactTop = contactEl?.offsetTop ?? 9999;

      const trigger = scrollY + windowH * 0.45;

      if (trigger >= contactTop) {
        setActiveSection("contact");
      } else if (trigger >= creativeTop) {
        setActiveSection("creative");
      } else if (trigger >= forensicsTop) {
        setActiveSection("forensics");
      } else if (trigger >= infraTop) {
        setActiveSection("infrastructure");
      } else {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#08090c] text-[#f3f4f6]">
      <Header />
      <HeroStage activeSection={activeSection} />
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
