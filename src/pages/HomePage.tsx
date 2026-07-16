import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Introduction } from "../components/Introduction";
import { StatsStrip } from "../components/StatsStrip";
import { PhotoGallery } from "../components/PhotoGallery";
import { PeruMap } from "../components/PeruMap";
import { Anuario } from "../components/Anuario";
import { UploadPhoto } from "../components/UploadPhoto";
import { Testimonials } from "../components/Testimonials";
import { FrasesPromo } from "../components/FrasesPromo";
import { Footer } from "../components/Footer";
import { BackgroundMusic } from "../components/BackgroundMusic";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Introduction />
      <StatsStrip />
      <Anuario />
      <PhotoGallery />
      <PeruMap />
      <UploadPhoto />
      <Testimonials />
      <FrasesPromo />
      <Footer />
      <BackgroundMusic />
    </div>
  );
}
