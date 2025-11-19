import React, { useState } from 'react';
import { Instagram, Youtube, MessageCircle, X } from 'lucide-react';

export default function Footer() {
  const [selectedDocument, setSelectedDocument] = useState<'teslimat' | 'mesafeli' | 'gizlilik' | null>(null);

  const documents = {
    teslimat: {
      title: 'Teslimat ve İade Şartları',
      content: `TÜKETİCİ HAKLARI - CAYMA - İPTAL İADE KOŞULLARI

Kullanmakta olduğunuz web sitesi üzerinden elektronik ortamda sipariş verdiğiniz takdirde, size sunulan ön bilgilendirme formunu ve mesafeli satış sözleşmesini kabul etmiş sayılırsınız.

Alıcılar, satın aldıkları ürünün satış ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği (RG:27.11.2014/29188) hükümleri ile yürürlükteki diğer yasalara tabidir.

Ürün sevkiyat masrafı olan kargo ücretleri satıcı tarafından ödenecektir.

- Koçluk hizmetinde iptal halinde kullanılmayan günlerin ücreti iade edilir.
- Deneme Kulübü paketlerinde cayma hakkı 14 gündür. Cayma hakkı süresi içinde, kullanılmamış denemelerin iadesi halinde bedel iade edilir.
- Cayma süresi geçtikten sonra iade yapılamaz.

Satın alınan ürünün satılmasının imkansızlaşması durumunda, satıcı bu durumu öğrendiğinden itibaren 3 gün içinde yazılı olarak alıcıya bu durumu bildirmek zorundadır. 14 gün içinde de toplam bedel Alıcı'ya iade edilmek zorundadır.

SATIN ALINAN ÜRÜN BEDELİ ÖDENMEZ İSE:
Alıcı, satın aldığı ürün bedelini ödemez veya banka kayıtlarında iptal ederse, Satıcının ürünü teslim yükümlülüğü sona erer.

KREDİ KARTININ YETKİSİZ KULLANIMI İLE YAPILAN ALIŞVERİŞLER:
Ürün teslim edildikten sonra, alıcının ödeme yaptığı kredi kartının yetkisiz kişiler tarafından haksız olarak kullanıldığı tespit edilirse ve satılan ürün bedeli ilgili banka veya finans kuruluşu tarafından Satıcı'ya ödenmez ise, Alıcı, sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI'ya ait olacak şekilde SATICI'ya iade etmek zorundadır.

CAYMA HAKKI:
ALICI; satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI'ya bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir.

SATICININ İLETİŞİM BİLGİLERİ:
ŞİRKET ADI: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk)
ADRES: Seyyid Ömer Mah. Silivrikapı Cad. Birlik Ap. A No: 54B Fatih / İstanbul
EPOSTA: info@arikocluk.com
TEL: +90 543 206 95 94`
    },
    mesafeli: {
      title: 'Mesafeli Satış Sözleşmesi',
      content: `MESAFELİ SATIŞ SÖZLEŞMESİ

1. SATICI BİLGİLERİ
Ad Soyad: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk)
ADRES: Seyyid Ömer Mah. Silivrikapı Cad. Birlik Ap. A No: 54B Fatih / İstanbul
Telefon: 0543 206 95 94
Eposta: info@arikocluk.com
Vergi Dairesi: Fatih
Vergi No: 7190340425

2. KONU
İşbu Sözleşme, ALICI'nın, SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.

3. ÖDEME ŞEKLİ
- Koçluk hizmeti ödemeleri aylık abonelik şeklinde İyzico altyapısı üzerinden online alınır.
- Deneme Kulübü paketleri tek seferlik peşin ödeme ile satın alınır.

4. CAYMA HAKKI
Ürünlerimiz dijital ürün olduğu için teslim edildikten sonra iade gerçekleştirilememektedir.
Koçluk ve danışmanlık alımlarında ise danışan ilk görüşmeden 1 gün önceye kadar iade isteyebilir. Daha sonra iade yoktur.

- Koçluk hizmetinde: ALICI dilediği zaman iptal talebinde bulunabilir. Kullanılan günlere tekabül eden tutar mahsup edilerek kalan kısım iade edilir.
- Deneme Kulübü paketlerinde: ALICI, 14 gün içinde cayma hakkına sahiptir. Kullanılmamış denemelerin eksiksiz ve hasarsız iade edilmesi gerekir.

5. YETKİLİ MAHKEME
6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 68. Maddesi gereği:
- Değeri 2.000,00 TL'nin altında olan uyuşmazlıklarda ilçe tüketici hakem heyetlerine,
- Değeri 3.000,00 TL'nin altında bulunan uyuşmazlıklarda il tüketici hakem heyetlerine başvuru yapılmaktadır.`
    },
    gizlilik: {
      title: 'Gizlilik Sözleşmesi',
      content: `ARI KOÇLUK - GİZLİLİK POLİTİKASI VE KİŞİSEL VERİLERİN İŞLENMESİ

Veri Sorumlusu: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk)
Telefon: +90 0543 206 95 94
E-Mail: info@arikocluk.com

KİŞİSEL VERİLERİN İŞLENME AMAÇLARI:
• Kimlik tespiti ve bilgilerin doğruluğunun teyidi
• Ödeme hizmetlerinin doğru şekilde gerçekleşmesi
• İletişim ve destek hizmeti sunmak
• Reklam ve pazarlama
• Bilgi sistemlerinin güvenliğinin sağlanması
• Talep ve şikayetlerin takibi
• Finans, muhasebe ve faturalandırma işlemleri

KİŞİSEL VERİLERİN AKTARILMASI:
Kişisel verileriniz, beraber çalıştığımız reklam ajanslarına, koçlara veya öğrencilere tanıtım amacıyla, ödeme hizmet sağlayıcılara aktarılabilir. Arı Koçluk'un kart bilgilerinize erişimi yoktur.

TEKNİK VE ORGANİZASYONEL TEDBİRLER:
Arı Koçluk, kişisel verilerinizi korumak amacıyla makul teknik ve organizasyonel tedbirleri almaktadır. Çalışanlar eğitilmekte, gerekli siber güvenlik önlemleri alınmaktadır.

İLGİLİ KİŞİNİN HAKLARI (KVKK m.11):
• Kişisel veri işlenip işlenmediğini öğrenme
• Kişisel verilerin işlenme amacını öğrenme
• Kişisel verilerin aktarıldığı üçüncü kişileri bilme
• Kişisel verilerin düzeltilmesini isteme
• Kişisel verilerin silinmesini isteme
• Zararın giderilmesini talep etme

Talep ve şikayetlerinizi info@arikocluk.com adresine iletebilirsiniz.`
    }
  };

  return (
    <footer className="bg-softBlack text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              "En verimli sabahlar sert programlarla başlar!"
            </p>
          </div>

          {/* Center Section - 3 Columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sunduğumuz Hizmetler */}
            <div>
              <h3 className="text-warmAmber font-semibold mb-4 text-base whitespace-nowrap">Sunduğumuz Hizmetler</h3>
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
              <h3 className="text-warmAmber font-semibold mb-4 text-base whitespace-nowrap">Arı Koçluk</h3>
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
              <h3 className="text-warmAmber font-semibold mb-4 text-base whitespace-nowrap">Sözleşme ve Koşullar</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setSelectedDocument('teslimat')} className="text-lightCream hover:text-warmAmber transition-colors text-left">
                    Teslimat ve İade Şartları
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedDocument('mesafeli')} className="text-lightCream hover:text-warmAmber transition-colors text-left">
                    Mesafeli Satış Sözleşmesi
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedDocument('gizlilik')} className="text-lightCream hover:text-warmAmber transition-colors text-left">
                    Gizlilik Sözleşmesi
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-start space-y-4">
            <h3 className="text-warmAmber font-semibold text-base whitespace-nowrap">Arı Koçluk'u Takip Edin</h3>
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
                href="https://www.youtube.com/channel/UCIsci_KrVnUwu9zrxaAkE1w" 
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
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/paymentservices.png" 
              alt="Payment Services" 
              className="h-12 object-contain"
            />
          </div>

          {/* Copyright */}
          <div className="text-center text-lightCream text-sm">
            © 2025 Arı Koçluk. Tüm hakları saklıdır.
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]" onClick={() => setSelectedDocument(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-warmAmber text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{documents[selectedDocument].title}</h2>
              <button onClick={() => setSelectedDocument(null)} className="hover:scale-110 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">{documents[selectedDocument].content}</pre>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}