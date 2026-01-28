import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Footer from '../components/Landing/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <Footer />
    </div>
  );
}
