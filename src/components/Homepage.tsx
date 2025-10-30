import React, { useState } from 'react';
import TrialSessionForm from './TrialSessionForm';
import CoachCarousel from './CoachCarousel';
import InfoBoxes from './InfoBoxes';
import PurchaseCallToAction from './PurchaseCallToAction';
import { useScrollAnimation } from '../utils/aos';

interface HomepageProps {
  onPurchaseClick: () => void;
}

export default function Homepage({ onPurchaseClick }: HomepageProps) {
  const [showTrialForm, setShowTrialForm] = useState(false);
  const heroRef = useScrollAnimation('fade-up');
  const carouselRef = useScrollAnimation('fade-in');
  const infoRef = useScrollAnimation('fade-up');

  return (
    <div className="min-h-screen bg-lightCream">
      {/* Hero Section - Trial Session */}
      <section ref={heroRef} className="relative py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/ChatGPT Image 4 Eki 2025 16_29_31 copy.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }
          }
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
            YKS Hedefinize <span className="text-lightCream">Arı Koçluk</span> ile Ulaşın
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}>
            Arı Koçluk'un uzman koçlarıyla kişiselleştirilmiş eğitim programları ve birebir destek ile
            hayalinizdeki üniversiteye yerleşin.
          </p>
          <button
            onClick={() => setShowTrialForm(true)}
            className="premium-button bg-lightCream hover:bg-creamWhite text-softBlack px-10 py-5 rounded-xl text-lg font-bold shadow-2xl relative z-10"
          >
            Ücretsiz Ön Görüşme Al
          </button>
        </div>
      </section>

      <div ref={carouselRef}>
        <CoachCarousel />
      </div>
      <div ref={infoRef}>
        <InfoBoxes />
      </div>

      <PurchaseCallToAction onPurchaseClick={onPurchaseClick} />

      <TrialSessionForm isOpen={showTrialForm} onClose={() => setShowTrialForm(false)} />
    </div>
  );
}