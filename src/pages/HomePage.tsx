import { Hero } from "../components/Hero";
import { Introduction } from "../components/Introduction";
import { PhotoGallery } from "../components/PhotoGallery";
import { UploadPhoto } from "../components/UploadPhoto";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { BackgroundMusic } from "../components/BackgroundMusic";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Introduction />
      <PhotoGallery />
      <UploadPhoto />
      <Testimonials />
      <Footer />
      <BackgroundMusic />
    </div>
  );
}
