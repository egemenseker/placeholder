import React, { useState } from 'react';
import TrialSessionForm from './TrialSessionForm';
import CoachCarousel from './CoachCarousel';
import InfoBoxes from './InfoBoxes';
import { useScrollAnimation } from '../utils/aos';

export default function Homepage() {
  const [showTrialForm, setShowTrialForm] = useState(false);
  const heroRef = useScrollAnimation('fade-up');
  const carouselRef = useScrollAnimation('fade-in');
  const infoRef = useScrollAnimation('fade-up');

  return (
    <div className="min-h-screen bg-lightCream">
      {/* Hero Section - Trial Session */}
      <section ref={heroRef} className="relative bg-gradient-to-r from-warmAmber to-honeyYellow py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/koclarimizNasilpng.png')" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            YKS Hedefinize <span className="text-lightCream">Arı Koçluk</span> ile Ulaşın
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Arı Koçluk'un uzman koçlarıyla kişiselleştirilmiş eğitim programları ve birebir destek ile 
            hayalinizdeki üniversiteye yerleşin.
          </p>
          <button
            onClick={() => setShowTrialForm(true)}
            className="bg-lightCream hover:bg-creamWhite text-softBlack px-8 py-4 rounded-lg text-lg font-semibold transform transition-all duration-300 hover:scale-105 shadow-lg"
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

      <TrialSessionForm isOpen={showTrialForm} onClose={() => setShowTrialForm(false)} />
    </div>
  );
}