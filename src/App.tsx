import { useReveal } from './hooks/useReveal';
import { Barber } from './components/Barber';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Marquee } from './components/Marquee';
import { Nav } from './components/Nav';
import { Services } from './components/Services';
import { Visit } from './components/Visit';
import { Work } from './components/Work';

export default function App() {
  useReveal();

  return (
    <div className="min-h-screen bg-bone" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Intro />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Services />
        <Barber />
        <Visit />
      </main>
      <Footer />
    </div>
  );
}
