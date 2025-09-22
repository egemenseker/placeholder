import React from 'react';
import { useScrollAnimation } from '../utils/aos';

const infoCards = [
  {
    title: 'KAYNAK TAVSİYESİ',
    description: 'Kitabevimizin olmasının getirdiği her seviyeye uygun bilgi birikimimiz ve koçlarımız size kaynak önerirken hep benliğini iletişimde olacaklar.',
    bgImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'DERS ÇALIŞMAK',
    description: 'Size hazırlanacak olan ders çalışma programları ile isteseniz de kaytarma odaklı olamayacaksınız.',
    bgImage: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'MOTİVASYON',
    description: 'Motivasyon temeli pamuk ipliğine bağlıdır, asıl motorunuz disiplin! Motivasyon için siz disiplinle uğraşmadan şüpheniz olmasın :)',
    bgImage: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'PROGRAM NİTELİĞİ',
    description: 'Programlarınızın tamamı 3-6 ay aralığında olmanız gereken noktaya hizmet edecek şekilde haftalık olarak anbean hazırlanıp herhangi bir aksilikte anında reaksiyon alınır.',
    bgImage: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'KOÇLARIMIZ NASIL?',
    description: 'Koçlarımızın tamamı eğitim hayatları boyunca olumlu olumsuz tecrübelerini aktarmak için can atıyorlar.',
    bgImage: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'PEKİ KOÇLA ÇALIŞMAYA BAŞLADIKTAN SONRASI?',
    description: 'İlk görüşmede 1. sınıftan 12. sınıfa kadarki süreciniz değerlendirilir, sonrasında seviyeniz belirlenip kaynak tavsiyeleri ile süreç başlar.',
    bgImage: 'https://images.pexels.com/photos/4050299/pexels-photo-4050299.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'GÖRÜŞMELER NASIL GERÇEKLEŞİYOR?',
    description: 'Haftada 1 olacak şekilde Google Meets platformu üzerinden sınav süreciniz koçlarınız ile değerlendirilir ve 7/24 WhatsApp desteği ile koç her daim yanınızda.',
    bgImage: 'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'KOÇUMLA ANLAŞAMAZSAM?',
    description: 'Sınav sürecinde her senaryonun bizim tarafımızdan senin lehine olması için düşünülmesi, dönemimizdeki başlıca etken.',
    bgImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    title: 'İLK ETAPTAKİ PROGRAM HAZIRLAMA SÜRECİ',
    description: 'Koçunla ilk görüşmenden sonra koçunun talebine göre 3-6 aylık bir program hazırlanır ve programların en sağlıklı şekilde hazırlanması sağlanır.',
    bgImage: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400'
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
              className="relative overflow-hidden rounded-lg shadow-lg aspect-square group cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${card.bgImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 via-orange-600/70 to-black/80" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div>
                  <h3 className="text-lg font-bold mb-3 leading-tight" style={{ fontFamily: 'cursive' }}>
                    {card.title}
                  </h3>
                </div>
                
                <div>
                  <p className="text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
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