import React from 'react';
import { BookOpen, Users, Trophy, Target, Clock, Award, Brain, Star } from 'lucide-react';

const infoBoxes = [
  {
    icon: BookOpen,
    title: 'Kişiselleştirilmiş Eğitim',
    description: 'Size özel hazırlanan programlarla hedefinize ulaşın',
    image: 'https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Users,
    title: 'Uzman Koçlar',
    description: 'Alanında deneyimli koçlardan birebir destek alın',
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Trophy,
    title: 'Başarı Garantisi',
    description: 'Hedeflediğiniz üniversiteye yerleşmenizi sağlıyoruz',
    image: 'https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Target,
    title: 'Hedef Odaklı Çalışma',
    description: 'Hedefinize yönelik stratejik çalışma planları',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Clock,
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız, sorularınızı cevaplayıp',
    image: 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Award,
    title: 'Deneyimli Ekip',
    description: 'YKS konusunda uzman ve deneyimli kadromuz',
    image: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Brain,
    title: 'Akıllı Analiz',
    description: 'Performansınızı analiz edip gelişim önerilerinde bulunuyoruz',
    image: 'https://images.pexels.com/photos/4050325/pexels-photo-4050325.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: Star,
    title: 'Mükemmel Sonuçlar',
    description: 'Öğrencilerimizin %95\'i hedeflediği üniversiteye yerleşiyor',
    image: 'https://images.pexels.com/photos/5940707/pexels-photo-5940707.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    icon: BookOpen,
    title: 'Kapsamlı Müfredat',
    description: 'Tüm YKS konularını kapsayan detaylı eğitim programı',
    image: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function InfoBoxes() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoBoxes.map((box, index) => {
            const Icon = box.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg aspect-square"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url('${box.image}')` }}
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
                       style={{ backgroundImage: `url('${box.image}')` }} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="w-5 h-5 text-honeyYellow" />
                    <h3 className="font-bold text-lg">{box.title}</h3>
                  </div>
                  <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    {box.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}