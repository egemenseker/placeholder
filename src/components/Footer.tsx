import React from 'react';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-softBlack text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Arı Koçluk Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-xl font-bold">Arı Koçluk</span>
            </div>
            <p className="text-lightCream text-lg italic">
              "Sadece senin yolundan geçmiş koçla çalış."
            </p>
          </div>

          {/* Center Section - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sunduğumuz Hizmetler */}
            <div>
              <h3 className="text-warmAmber font-semibold mb-4">Sunduğumuz Hizmetler</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-lightCream hover:text-warmAmber transition-colors">
                    Koçluk
                  </a>
                </li>
              </ul>
            </div>

            {/* Arı Koçluk */}
            <div>
              <h3 className="text-warmAmber font-semibold mb-4">Arı Koçluk</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-lightCream hover:text-warmAmber transition-colors">
                    Aboneliğimi Yönet
                  </a>
                </li>
                <li>
                  <a href="#" className="text-lightCream hover:text-warmAmber transition-colors">
                    Bize Ulaşın
                  </a>
                </li>
              </ul>
            </div>

            {/* Sözleşme ve Koşullar */}
            <div>
              <h3 className="text-warmAmber font-semibold mb-4">Sözleşme ve Koşullar</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-lightCream hover:text-warmAmber transition-colors">
                    Mesafeli Satış Sözleşmesi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-lightCream hover:text-warmAmber transition-colors">
                    İptal İade Koşulları
                  </a>
                </li>
                <li>
                  <a href="#" className="text-lightCream hover:text-warmAmber transition-colors">
                    Gizlilik Sözleşmesi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-warmAmber font-semibold text-lg">Arı Koçluk'u Takip Edin</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/serkanpakfiliz.yks?igsh=MXVwM3luZjdoZ3Z1cg%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lightCream hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lightCream hover:text-red-500 transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a 
                href="https://wa.me/+905432069594" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lightCream hover:text-green-400 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@serkanpakfiliz.yks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lightCream hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Payment Logos */}
          <div className="flex justify-center items-center space-x-6 mb-4">
            <div className="text-lightCream text-sm font-medium">Güvenli Ödeme:</div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded px-2 py-1">
                <span className="text-blue-600 font-bold text-sm">iyzico</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-red-600 font-bold text-sm">Mastercard</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-blue-600 font-bold text-sm">Visa</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-blue-600 font-bold text-sm">Amex</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-red-600 font-bold text-sm">Troy</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-lightCream text-sm">
            © 2025 Arı Koçluk. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
}