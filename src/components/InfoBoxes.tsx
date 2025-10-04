import React from 'react';
import { useScrollAnimation } from '../utils/aos';

const infoCards = [
  {
    title: 'KAYNAK TAVSİYESİ',
    description: 'Kitabevimizin olmasının getirdiği her seviyeye uygun bilgi birikimimiz ve koçlarımız size kaynak önerirken hep benliğini iletişimde olacaklar.',
    bgImage: '/kaynakTavsiyesipng.png'
  },
  {
    title: 'DERS ÇALIŞMAK',
    description: 'Size hazırlanacak olan ders çalışma programları ile isteseniz de kaytarma odaklı olamayacaksınız.',
    bgImage: '/dersCalismakpng.png'
  },
  {
    title: 'MOTİVASYON',
    description: 'Motivasyon temeli pamuk ipliğine bağlıdır, asıl motorunuz disiplin! Motivasyon için siz disiplinle uğraşmadan şüpheniz olmasın :)',
    bgImage: '/motivasyonpng.png'
  },
  {
    title: 'PROGRAM NİTELİĞİ',
    description: 'Programlarınızın tamamı 3-6 ay aralığında olmanız gereken noktaya hizmet edecek şekilde haftalık olarak anbean hazırlanıp herhangi bir aksilikte anında reaksiyon alınır.',
    bgImage: '/programNiteligipng.png'
  },
  {
    title: 'KOÇLARIMIZ NASIL?',
    description: 'Koçlarımızın tamamı eğitim hayatları boyunca olumlu olumsuz tecrübelerini aktarmak için can atıyorlar.',
    bgImage: '/koclarimizNasilpng.png'
  },
  {
    title: 'PEKİ KOÇLA ÇALIŞMAYA BAŞLADIKTAN SONRASI?',
    description: 'İlk görüşmede 1. sınıftan 12. sınıfa kadarki süreciniz değerlendirilir, sonrasında seviyeniz belirlenip kaynak tavsiyeleri ile süreç başlar.',
    bgImage: '/peki...png.png'
  },
  {
    title: 'GÖRÜŞMELER NASIL GERÇEKLEŞİYOR?',
    description: 'Haftada 1 olacak şekilde Google Meets platformu üzerinden sınav süreciniz koçlarınız ile değerlendirilir ve 7/24 WhatsApp desteği ile koç her daim yanınızda.',
    bgImage: '/gorusmelerNasilpng.png'
  },
  {
    title: 'KOÇUMLA ANLAŞAMAZSAM?',
    description: 'Sınav sürecinde her senaryonun bizim tarafımızdan senin lehine olması için düşünülmesi, dönemimizdeki başlıca etken.',
    bgImage: '/kocumlaAnlasamazsampng.png'
  },
  {
    title: 'İLK ETAPTAKİ PROGRAM HAZIRLAMA SÜRECİ',
    description: 'Koçunla ilk görüşmenden sonra koçunun talebine göre 3-6 aylık bir program hazırlanır ve programların en sağlıklı şekilde hazırlanması sağlanır.',
    bgImage: '/ilkEtaptakipng.png'
  }
];

export default function InfoBoxes() {
  const gridRef = useScrollAnimation('fade-up');

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg aspect-square group"
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 group-hover:brightness-125 overflow-hidden"
                style={{ backgroundImage: `url('${card.bgImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFBF00]/80 via-[#CC9900]/70 to-black/80" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-3 leading-tight text-center w-full" style={{ fontFamily: 'cursive' }}>
                    {card.title}
                  </h3>
                </div>
                
                <div>
                  <p className="text-lg leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {card.description}
                  </p>
                </div>
              </div>
              
              {/* Subtle Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}