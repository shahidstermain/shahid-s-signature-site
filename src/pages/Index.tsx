import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Credentials } from "@/components/sections/Credentials";
import { Writing } from "@/components/sections/Writing";
import { Now } from "@/components/sections/Now";
import { Connect } from "@/components/sections/Connect";
import { Seo } from "@/components/seo/Seo";
import { siteConfig } from "@/lib/site-config";
import { buildPersonJsonLd, buildWebsiteJsonLd } from "@/lib/structured-data";

const jsonLd = [buildWebsiteJsonLd(), buildPersonJsonLd()];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Seo
        description={siteConfig.description}
        jsonLd={jsonLd}
        keywords={siteConfig.keywords}
        path="/"
      />
      <BackgroundGlow />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Philosophy />
        <Skills />
        <Work />
        <Credentials />
        <Writing />
        <Now />
        <Connect />
      </main>
      <Footer />
    </div>
  );
};

export default Index;