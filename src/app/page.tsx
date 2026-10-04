import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { About } from "@/components/landing/about";
import { MenuSection } from "@/components/landing/menu-section";
import { Promo } from "@/components/landing/promo";
import { Gallery } from "@/components/landing/gallery";
import { Testimonials } from "@/components/landing/testimonials";
import { Location } from "@/components/landing/location";
import { Footer } from "@/components/landing/footer";
import { FloatingWhatsApp } from "@/components/landing/floating-wa";
import { CartBar } from "@/components/landing/cart-bar";
import { SmoothScroll } from "@/components/landing/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-cream text-foreground">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <About />
          <MenuSection />
          <Promo />
          <Gallery />
          <Testimonials />
          <Location />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <CartBar />
      </div>
    </SmoothScroll>
  );
}
