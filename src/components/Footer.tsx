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

Satın alınan ürünün satılmasının imkansızlaşması durumunda, satıcı bu durumu öğrendiğinden itibaren 3 gün içinde yazılı olarak alıcıya bu durumu bildirmek zorundadır. 14 gün içinde de toplam bedel Alıcı’ya iade edilmek zorundadır.

SATIN ALINAN ÜRÜN BEDELİ ÖDENMEZ İSE:
Alıcı, satın aldığı ürün bedelini ödeme (EduDiamond altyapısı üzerinden)z veya banka kayıtlarında iptal ederse, Satıcının ürünü teslim yükümlülüğü sona erer.

KREDİ KARTININ YETKİSİZ KULLANIMI İLE YAPILAN ALIŞVERİŞLER:
Ürün teslim edildikten sonra, alıcının ödeme (EduDiamond altyapısı üzerinden) yaptığı kredi kartının yetkisiz kişiler tarafından haksız olarak kullanıldığı tespit edilirse ve satılan ürün bedeli ilgili banka veya finans kuruluşu tarafından Satıcı'ya ödenmez ise, Alıcı, sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI’ya ait olacak şekilde SATICI’ya iade etmek zorundadır.

ÖNGÖRÜLEMEYEN SEBEPLERLE ÜRÜN SÜRESİNDE TESLİM EDİLEMEZ İSE:
Satıcı’nın öngöremeyeceği mücbir sebepler oluşursa ve ürün süresinde teslim edilemez ise, durum Alıcı’ya bildirilir. Alıcı, siparişin iptalini, ürünün benzeri ile değiştirilmesini veya engel ortadan kalkana dek teslimatın ertelenmesini talep edebilir. Alıcı siparişi iptal ederse; ödeme (EduDiamond altyapısı üzerinden)yi nakit ile yapmış ise iptalinden itibaren 14 gün içinde kendisine nakden bu ücret ödenir. Alıcı, ödeme (EduDiamond altyapısı üzerinden)yi kredi kartı ile yapmış ise ve iptal ederse, bu iptalden itibaren yine 14 gün içinde ürün bedeli bankaya iade edilir, ancak bankanın alıcının hesabına 2-3 hafta içerisinde aktarması olasıdır.

ALICININ ÜRÜNÜ KONTROL ETME YÜKÜMLÜLÜĞÜ:
Alıcı, sözleşme konusu mal/hizmeti teslim almadan önce muayene edecek; ezik, kırık, ambalajı yırtılmış vb. hasarlı ve ayıplı mal/hizmeti kargo şirketinden teslim almayacaktır. Teslim alınan mal/hizmetin hasarsız ve sağlam olduğu kabul edilecektir. ALICI, Teslimden sonra mal/hizmeti özenle korunmak zorundadır. Cayma hakkı kullanılacaksa mal/hizmet kullanılmamalıdır. Ürünle birlikte Fatura da iade edilmelidir.

CAYMA HAKKI:
ALICI; satın aldığı ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren 14 (on dört) gün içerisinde, SATICI’ya aşağıdaki iletişim bilgileri üzerinden bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkını kullanabilir.

SATICININ CAYMA HAKKI BİLDİRİMİ YAPILACAK İLETİŞİM BİLGİLERİ:
ŞİRKET ADI/UNVANI: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk markası ile hizmet vermektedir)
ADRES: Seyyid Ömer Mah. Silivrikapı Cad. Birlik Ap. A No: 54B Fatih / İstanbul
EPOSTA: info@arikocluk.com
TEL: +90 543 206 95 94

CAYMA HAKKININ SÜRESİ:
Alıcı, satın aldığı eğer bir hizmet ise, bu 14 günlük süre sözleşmenin imzalandığı tarihten itibaren başlar. Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile hizmetin ifasına başlanan hizmet sözleşmelerinde cayma hakkı kullanılamaz.
Cayma hakkının kullanımından kaynaklanan masraflar SATICI’ ya aittir.
Cayma hakkının kullanılması için 14 (ondört) günlük süre içinde SATICI' ya iadeli taahhütlü posta, faks veya eposta ile yazılı bildirimde bulunulması ve ürünün işbu sözleşmede düzenlenen "Cayma Hakkı Kullanılamayacak Ürünler" hükümleri çerçevesinde kullanılmamış olması şarttır.

CAYMA HAKKININ KULLANIMI:
3. kişiye veya ALICI’ ya teslim edilen ürünün faturası, (İade edilmek istenen ürünün faturası kurumsal ise, iade ederken kurumun düzenlemiş olduğu iade faturası ile birlikte gönderilmesi gerekmektedir. Faturası kurumlar adına düzenlenen sipariş iadeleri İADE FATURASI kesilmediği takdirde tamamlanamayacaktır.)
İade formu,
İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.

İADE KOŞULLARI:
SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 10 günlük süre içerisinde toplam bedeli ve ALICI’yı borç altına sokan belgeleri ALICI’ ya iade etmek ve 20 günlük süre içerisinde malı iade almakla yükümlüdür.
ALICI’ nın kusurundan kaynaklanan bir nedenle malın değerinde bir azalma olursa veya iade imkânsızlaşırsa ALICI kusuru oranında SATICI’ nın zararlarını tazmin etmekle yükümlüdür. Ancak cayma hakkı süresi içinde malın veya ürünün usulüne uygun kullanılması sebebiyle meydana gelen değişiklik ve bozulmalardan ALICI sorumlu değildir.
Cayma hakkının kullanılması nedeniyle SATICI tarafından düzenlenen kampanya limit tutarının altına düşülmesi halinde kampanya kapsamında faydalanılan indirim miktarı iptal edilir.
TEMERRÜT HALİ VE HUKUKİ SONUÇLARI
ALICI, ödeme (EduDiamond altyapısı üzerinden) işlemlerini kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul, beyan ve taahhüt eder. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini ALICI’dan talep edebilir ve her koşulda ALICI’nın borcundan dolayı temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından dolayı SATICI’nın uğradığı zarar ve ziyanını ödeyeceğini kabul eder.



ÖDEME VE TESLİMAT
Sitemiz üzerinden kredi kartlarınız ile, Her türlü kredi kartınıza online tek ödeme (EduDiamond altyapısı üzerinden) ya da online taksit imkânlarından yararlanabilirsiniz. Online ödeme (EduDiamond altyapısı üzerinden)lerinizde siparişiniz sonunda kredi kartınızdan tutar çekim işlemi gerçekleşecektir.
`
    },
    mesafeli: {
      title: 'Mesafeli Satış Sözleşmesi',
      content: `MESAFELİ SATIŞ SÖZLEŞMESİ
1. TARAFLAR
İşbu Sözleşme aşağıdaki taraflar arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır.



1. 'ALICI'
(sözleşmede bundan sonra "ALICI" olarak anılacaktır)
AD- SOYAD:
ADRES:



2. 'SATICI'
(sözleşmede bundan sonra "SATICI" olarak anılacaktır)
Ad Soyad: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk markası ile hizmet vermektedir)
ADRES: Seyyid Ömer Mah. Silivrikapı Cad. Birlik Ap. A No: 54B Fatih / İstanbul
Telefon: 0543 206 95 94
Eposta: info@arikocluk.com
Vergi Dairesi: Fatih
Vergi No: 7190340425
İş bu sözleşmeyi kabul etmekle ALICI, sözleşme konusu siparişi onayladığı takdirde sipariş konusu bedeli ve varsa kargo ücreti, vergi gibi belirtilen ek ücretleri ödeme (EduDiamond altyapısı üzerinden) yükümlülüğü altına gireceğini ve bu konuda bilgilendirildiğini peşinen kabul eder.

2. TANIMLAR
İşbu sözleşmenin uygulanmasında ve yorumlanmasında aşağıda yazılı terimler karşılarındaki yazılı açıklamaları ifade edeceklerdir.
BAKAN: Gümrük ve Ticaret Bakanı'nı,
BAKANLIK: Gümrük ve Ticaret Bakanlığı'nı,
KANUN: 6502 sayılı Tüketicinin Korunması Hakkında Kanun'u,
YÖNETMELİK: Mesafeli Sözleşmeler Yönetmeliği'ni (RG:27.11.2014/29188),
HİZMET: Bir ücret veya menfaat karşılığında yapılan ya da yapılması taahhüt edilen YKS Koçluğu ve Deneme Kulübü kapsamında sağlanan hizmetleri,
SATICI: Ticari veya mesleki faaliyetleri kapsamında tüketiciye mal sunan veya mal sunan adına veya hesabına hareket eden şirketi,
ALICI: Bir mal veya hizmeti ticari veya mesleki olmayan amaçlarla edinen, kullanan veya yararlanan gerçek ya da tüzel kişiyi,
SİTE: SATICI'ya ait www.arikocluk.com internet sitesini,
SİPARİŞ VEREN: Bir mal veya hizmeti SATICI'ya ait internet sitesi üzerinden talep eden gerçek ya da tüzel kişiyi,
TARAFLAR: SATICI ve ALICI'yı,
SÖZLEŞME: SATICI ve ALICI arasında akdedilen işbu sözleşmeyi,
MAL: Alışverişe konu olan taşınır eşyayı ve elektronik ortamda kullanılmak üzere hazırlanan yazılım, ses, görüntü ve benzeri gayri maddi malları ifade eder.

3. KONU
İşbu Sözleşme, ALICI'nın, SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.
Listelenen ve sitede ilan edilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir. Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.



4. SATICI BİLGİLERİ
Ad Soyad: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk markası ile hizmet vermektedir)
ADRES: Seyyid Ömer Mah. Silivrikapı Cad. Birlik Ap. A No: 54B Fatih / İstanbul
Telefon: 0543 206 95 94
Eposta: info@arikocluk.com
Vergi Dairesi: Fatih
Vergi No: 7190340425



5. ALICI BİLGİLERİ
Teslim edilecek kişi:
Teslimat Adresi:
Telefon:
Faks:
Eposta/kullanıcı adı:



6. SİPARİŞ VEREN KİŞİ BİLGİLERİ
Ad/Soyad/Unvan:
Adres:
Telefon:
Faks:
Eposta/kullanıcı adı:

7. SÖZLEŞME KONUSU ÜRÜN/ÜRÜNLER BİLGİLERİ
7.1.
Malın /Ürün/Ürünlerin/ Hizmetin temel özelliklerini (türü, miktarı, marka/modeli, rengi, adedi) SATICI'ya ait internet sitesinde yayınlanmaktadır. Satıcı tarafından kampanya düzenlenmiş ise ilgili ürünün temel özelliklerini kampanya süresince inceleyebilirsiniz. Kampanya tarihine kadar geçerlidir.
7.2.
Listelenen ve sitede ilan edilen fiyatlar satış fiyatıdır. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir. Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.
7.3.
Sözleşme konusu mal ya da hizmetin tüm vergiler dâhil satış fiyatı aşağıda gösterilmiştir.
Ürün Açıklaması Adet Birim Fiyatı Ara Toplam (KDV Dahil)
Kargo Tutarı:
Toplam :
Ödeme Şekli ve Planı:
Teslimat Adresi:
Teslim Edilecek kişi:
Fatura Adresi:
Sipariş Tarihi:
Teslimat tarihi:
Teslim şekli:
7.4.
Ürün sevkiyat masrafı olan kargo ücreti SATICI tarafından ödenecektir.

8. ÖDEME ŞEKLİ
- Koçluk hizmeti ödeme (EduDiamond altyapısı üzerinden)leri aylık abonelik şeklinde İyzico altyapısı üzerinden online alınır.
- Deneme Kulübü paketleri tek seferlik peşin ödeme (EduDiamond altyapısı üzerinden) ile satın alınır.

9. GENEL HÜKÜMLER
9.1.
ALICI, SATICI'ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme (EduDiamond altyapısı üzerinden) şekli ile teslimata ilişkin ön bilgileri okuyup, bilgi sahibi olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul, beyan ve taahhüt eder. ALICI'nın; Ön Bilgilendirmeyi elektronik ortamda teyit etmesi, mesafeli satış sözleşmesinin kurulmasından evvel, SATICI tarafından ALICI' ya verilmesi gereken adresi, siparişi verilen ürünlere ait temel özellikleri, ürünlerin vergiler dâhil fiyatını, ödeme (EduDiamond altyapısı üzerinden) ve teslimat bilgilerini de doğru ve eksiksiz olarak edindiğini kabul, beyan ve taahhüt eder.
9.2.
-ALICI, Sözleşme konusu ürünün teslimatı için işbu Sözleşme'yi elektronik ortamda teyit edeceğini, herhangi bir nedenle sözleşme konusu ürün bedelinin ödenmemesi ve/veya banka kayıtlarında iptal edilmesi halinde, SATICI'nın sözleşme konusu ürünü teslim yükümlülüğünün sona ereceğini kabul, beyan ve taahhüt eder
9.3.
ALICI, Sözleşme konusu ürünün ALICI veya ALICI'nın gösterdiği adresteki kişi ve/veya kuruluşa tesliminden sonra ALICI'ya ait kredi kartının yetkisiz kişilerce haksız kullanılması sonucunda sözleşme konusu ürün bedelinin ilgili banka veya finans kuruluşu tarafından SATICI'ya ödenmemesi halinde, ALICI Sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI'ya ait olacak şekilde SATICI'ya iade edeceğini kabul, beyan ve taahhüt eder.
9.4.
SATICI, sipariş konusu ürün veya hizmetin yerine getirilmesinin imkânsızlaşması halinde sözleşme konusu yükümlülüklerini yerine getiremezse, bu durumu, öğrendiği tarihten itibaren 3 gün içinde yazılı olarak tüketiciye bildireceğini, 14 günlük süre içinde toplam bedeli ALICI'ya iade edeceğini kabul, beyan ve taahhüt eder.
9.5.
ALICI, Sözleşme konusu ürünün teslimatı için işbu Sözleşme'yi elektronik ortamda teyit edeceğini, herhangi bir nedenle sözleşme konusu ürün bedelinin ödenmemesi ve/veya banka kayıtlarında iptal edilmesi halinde, SATICI'nın sözleşme konusu ürünü teslim yükümlülüğünün sona ereceğini kabul, beyan ve taahhüt eder.
9.6.
ALICI, Sözleşme konusu ürünün ALICI veya ALICI'nın gösterdiği adresteki kişi ve/veya kuruluşa tesliminden sonra ALICI'ya ait kredi kartının yetkisiz kişilerce haksız kullanılması sonucunda sözleşme konusu ürün bedelinin ilgili banka veya finans kuruluşu tarafından SATICI'ya ödenmemesi halinde, ALICI Sözleşme konusu ürünü 3 gün içerisinde nakliye gideri SATICI'ya ait olacak şekilde SATICI'ya iade edeceğini kabul, beyan ve taahhüt eder.
9.7.
SATICI, tarafların iradesi dışında gelişen, önceden öngörülemeyen ve tarafların borçlarını yerine getirmesini engelleyici ve/veya geciktirici hallerin oluşması gibi mücbir sebepler halleri nedeni ile sözleşme konusu ürünü süresi içinde teslim edemez ise, durumu ALICI'ya bildireceğini kabul, beyan ve taahhüt eder. ALICI da siparişin iptal edilmesini, sözleşme konusu ürünün varsa emsali ile değiştirilmesini ve/veya teslimat süresinin engelleyici durumun ortadan kalkmasına kadar ertelenmesini SATICI'dan talep etme hakkını haizdir. ALICI tarafından siparişin iptal edilmesi halinde ALICI'nın nakit ile yaptığı ödeme (EduDiamond altyapısı üzerinden)lerde, ürün tutarı 14 gün içinde kendisine nakden ve defaten ödenir. ALICI'nın kredi kartı ile yaptığı ödeme (EduDiamond altyapısı üzerinden)lerde ise, ürün tutarı, siparişin ALICI tarafından iptal edilmesinden sonra 14 gün içerisinde ilgili bankaya iade edilir. ALICI, SATICI tarafından kredi kartına iade edilen tutarın banka tarafından ALICI hesabına yansıtılmasına ilişkin ortalama sürecin 2 ile 3 haftayı bulabileceğini, bu tutarın bankaya iadesinden sonra ALICI'nın hesaplarına yansıması halinin tamamen banka işlem süreci ile ilgili olduğundan, ALICI, olası gecikmeler için SATICI'yı sorumlu tutamayacağını kabul, beyan ve taahhüt eder.
9.8.
SATICININ, ALICI tarafından siteye kayıt formunda belirtilen veya daha sonra kendisi tarafından güncellenen adresi, e-posta adresi, sabit ve mobil telefon hatları ve diğer iletişim bilgileri üzerinden mektup, e-posta, SMS, telefon görüşmesi ve diğer yollarla iletişim, pazarlama, bildirim ve diğer amaçlarla ALICI'ya ulaşma hakkı bulunmaktadır. ALICI, işbu sözleşmeyi kabul etmekle SATICI'nın kendisine yönelik yukarıda belirtilen iletişim faaliyetlerinde bulunabileceğini kabul ve beyan etmektedir.
9.9.
SATICININ, ALICI tarafından siteye kayıt formunda belirtilen veya daha sonra kendisi tarafından güncellenen adresi, e-posta adresi, sabit ve mobil telefon hatları ve diğer iletişim bilgileri üzerinden mektup, e-posta, SMS, telefon görüşmesi ve diğer yollarla iletişim, pazarlama, bildirim ve diğer amaçlarla ALICI'ya ulaşma hakkı bulunmaktadır. ALICI, işbu sözleşmeyi kabul etmekle SATICI'nın kendisine yönelik yukarıda belirtilen iletişim faaliyetlerinde bulunabileceğini kabul ve beyan etmektedir.

9.10.
ALICI, sözleşme konusu mal/hizmeti teslim almadan önce muayene edecek; ezik, kırık, ambalajı yırtılmış vb. hasarlı ve ayıplı mal/hizmeti kargo şirketinden teslim almayacaktır. Teslim alınan mal/hizmetin hasarsız ve sağlam olduğu kabul edilecektir. Teslimden sonra mal/hizmetin özenle korunması borcu, ALICI'ya aittir. Cayma hakkı kullanılacaksa mal/hizmet kullanılmamalıdır. Fatura iade edilmelidir.
9.11.
ALICI ile sipariş esnasında kullanılan kredi kartı hamilinin aynı kişi olmaması veya ürünün ALICI'ya tesliminden evvel, siparişte kullanılan kredi kartına ilişkin güvenlik açığı tespit edilmesi halinde, SATICI, kredi kartı hamiline ilişkin kimlik ve iletişim bilgilerini, siparişte kullanılan kredi kartının bir önceki aya ait ekstresini yahut kart hamilinin bankasından kredi kartının kendisine ait olduğuna ilişkin yazıyı ibraz etmesini ALICI'dan talep edebilir. ALICI'nın talebe konu bilgi/belgeleri temin etmesine kadar geçecek sürede sipariş dondurulacak olup, mezkur taleplerin 24 saat içerisinde karşılanmaması halinde ise SATICI, siparişi iptal etme hakkını haizdir.
9.12.
ALICI, SATICI'ya ait internet sitesine üye olurken verdiği kişisel ve diğer sair bilgilerin gerçeğe uygun olduğunu, SATICI'nın bu bilgilerin gerçeğe aykırılığı nedeniyle uğrayacağı tüm zararları, SATICI'nın ilk bildirimi üzerine derhal, nakden ve defaten tazmin edeceğini beyan ve taahhüt eder.
9.13.
ALICI, SATICI'ya ait internet sitesini kullanırken yasal mevzuat hükümlerine riayet etmeyi ve bunları ihlal etmemeyi baştan kabul ve taahhüt eder. Aksi takdirde, doğacak tüm hukuki ve cezai yükümlülükler tamamen ve münhasıran ALICI'yı bağlayacaktır.
9.14.
ALICI, SATICI'ya ait internet sitesini hiçbir şekilde kamu düzenini bozucu, genel ahlaka aykırı, başkalarını rahatsız ve taciz edici şekilde, yasalara aykırı bir amaç için, başkalarının maddi ve manevi haklarına tecavüz edecek şekilde kullanamaz. Ayrıca, üye başkalarının hizmetleri kullanmasını önleyici veya zorlaştırıcı faaliyet (spam, virus, truva atı, vb.) işlemlerde bulunamaz.
9.15.
SATICI'ya ait internet sitesinin üzerinden, SATICI'nın kendi kontrolünde olmayan ve/veya başkaca üçüncü kişilerin sahip olduğu ve/veya işlettiği başka web sitelerine ve/veya başka içeriklere link verilebilir. Bu linkler ALICI'ya yönlenme kolaylığı sağlamak amacıyla konmuş olup herhangi bir web sitesini veya o siteyi işleten kişiyi desteklememekte ve Link verilen web sitesinin içerdiği bilgilere yönelik herhangi bir garanti niteliği taşımamaktadır.
9.16.
İşbu sözleşme içerisinde sayılan maddelerden bir ya da birkaçını ihlal eden üye işbu ihlal nedeniyle cezai ve hukuki olarak şahsen sorumlu olup, SATICI'yı bu ihlallerin hukuki ve cezai sonuçlarından ari tutacaktır. Ayrıca; işbu ihlal nedeniyle, olayın hukuk alanına intikal ettirilmesi halinde, SATICI'nın üyeye karşı üyelik sözleşmesine uyulmamasından dolayı tazminat talebinde bulunma hakkı saklıdır.



10. CAYMA HAKKI
10.1.
Ürünlerimiz dijital ürün olduğu için teslim edildikten sonra iade gerçekleştirilememektedir.
Koçluk ve danışmanlık alımlarında ise danışan ilk görüşmeden 1 gün önceye kadar iade isteyebilir. Daha sonra iade yoktur.
Siparişlerinizin olası sebeplerle iptali durumunda; Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk markası ile hizmet vermektedir)üç iş günü içerisinde ürün bedelini hesabınıza ve/veya kredi kartınıza iade eder. Ancak, banka hesap bilgilerinizi ve/veya kredi kartı bilgilerinizi doğru ve eksiksiz olarak şirketimiz finans yetkililerine bildirmeniz gerekmektedir.

10.2.
- Koçluk hizmetinde: ALICI dilediği zaman iptal talebinde bulunabilir. Kullanılan günlere tekabül eden tutar mahsup edilerek kalan kısım iade edilir.
- Deneme Kulübü paketlerinde: ALICI, 14 gün içinde cayma hakkına sahiptir. Kullanılmamış denemelerin eksiksiz ve hasarsız iade edilmesi gerekir. Cayma süresi geçtikten sonra iade yapılmaz.
- Ayıplı veya eksik ürün gönderiminde ALICI’nın iade veya değişim hakkı vardır.

11. TEMERRÜT HALİ VE HUKUKİ SONUÇLARI
ALICI, ödeme (EduDiamond altyapısı üzerinden) işlemlerini kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul, beyan ve taahhüt eder. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini ALICI'dan talep edebilir ve her koşulda ALICI'nın borcundan dolayı temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından dolayı SATICI'nın uğradığı zarar ve ziyanını ödeyeceğini kabul, beyan ve taahhüt eder.

12. YETKİLİ MAHKEME
İşbu sözleşmeden doğan uyuşmazlıklarda şikayet ve itirazlar, aşağıdaki kanunda belirtilen parasal sınırlar dâhilinde tüketicinin yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki tüketici sorunları hakem heyetine veya tüketici mahkemesine yapılacaktır. Parasal sınıra ilişkin bilgiler aşağıdadır:
28/05/2014 tarihinden itibaren geçerli olmak üzere:
6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 68. Maddesi gereği değeri 2.000,00 (ikibin) TL'nin altında olan uyuşmazlıklarda ilçe tüketici hakem heyetlerine,
Değeri 3.000,00(üçbin)TL' nin altında bulunan uyuşmazlıklarda il tüketici hakem heyetlerine,
Büyükşehir statüsünde bulunan illerde ise değeri 2.000,00 (ikibin) TL ile 3.000,00(üçbin)TL' arasındaki uyuşmazlıklarda il tüketici hakem heyetlerine başvuru yapılmaktadır.
İşbu Sözleşme ticari amaçlarla yapılmaktadır.



YÜRÜRLÜK
ALICI, Site üzerinden verdiği siparişe ait ödeme (EduDiamond altyapısı üzerinden)yi gerçekleştirdiğinde işbu sözleşmenin tüm şartlarını kabul etmiş sayılır. SATICI, siparişin gerçekleşmesi öncesinde işbu sözleşmenin sitede ALICI tarafından okunup kabul edildiğine dair onay alacak şekilde gerekli yazılımsal düzenlemeleri yapmakla yükümlüdür.

SATICI: _________________________
ALICI: _________________________
TARİH: _________________________


`
    },
    gizlilik: {
      title: 'Gizlilik Sözleşmesi',
      content: `ARI KOÇLUK
GİZLİLİK POLİTİKASI VE KİŞİSEL VERİLERİN İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ

6698 Sayılı Kişisel Verilerin Korunması Hakkında Kanun ("KVKK") m.10 uyarınca
kişisel verilerin elde edinilmesi sırasında veri sorumlusu veya yetkilendirdiği kişi kişisel verisi işlenen ilgili kişilere tam, doğru ve eksiksiz bilgilendirme yapmalıdır. : Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk markası ile hizmet vermektedir) KVKK kapsamında veri sorumlusu sıfatını haiz olduğundan, işbu Gizlilik Politikası ve Aydınlatma Metni ("Aydınlatma Metni") ile ilgili kişilerin kişisel verileri işlenmeden önce bilgilendirilmesi amaçlanmıştır.



İLGİLİ KİŞİLERİN, HANGİ KİŞİSEL VERİLERİNİN NE AMAÇLA İŞLENDİĞİ, KANUNDAN DOĞAN HAKLARI VE DİĞER HUSUSLAR BAKIMINDAN
AYDINLATMA METNİNDE YER ALAN BİLGİLENDİRME İÇERİKLERİNİ OKUMASI VE KİŞİSEL VERİLERİNİN İŞLENMESİNE RIZA GÖSTERMEDEN ÖNCE VEYA EN GEÇ RIZA VERME ANINDA AYDINLATMA METNİNDE YER ALAN KONULARDA BİLGİ SAHİBİ OLMASI GEREKMEKTEDİR.

Veri Sorumlusunun ve Varsa Temsilcisinin Kimliği
: Recep Serkan Pakfiliz (Pakfiliz Kitabevi – Arı Koçluk markası ile hizmet vermektedir)Türkiye yasalarına göre kurulmuş bir şahıs şirkettir. Arı Koçluk www.arikocluk.com alan adlı internet sitesini ("Platform") işletmektedir.



İletişim Bilgileri
Telefon No: +90 0543 206 95 94
E-Mail: info@arikocluk.com

Kişisel Verilerin İşlenmesine İlişkin Prensipler
Arı Koçluk, kişisel verileri işlerken KVKK'da yer alan temel prensiplere uymaktadır. Arı Koçluk kişisel verileri:
Hukuka ve dürüstlük kurallarına uygun işlemekte,
Doğru verileri işlemekte ve güncel olması için makul çabayı göstermekte,
Belirli, açık ve meşru amaçlarla işlemekte,
Amaçla bağlantılı, sınırlı ve ölçülü kişisel veri işlemekte,
Kişisel verileri sınırlı süreyle muhafaza etmektedir.

Kişisel Verilerin İşlenme Amaçları
Kişisel verilerinizi aşağıdaki amaçlarla işleyebiliriz:
Kimlik tespiti ve hakkınızda açıkladığını bilgilerin doğruluğunun teyidi amacıyla;
Platform'u kullanmaya uygun olup olmadığınızı tespit amacıyla;
Ödeme hizmetlerinin doğru şekilde gerçekleşmesini sağlamak amacıyla;
İletişim ve Platform destek hizmeti sunmak amacıyla;
Reklam ve pazarlama amacıyla;
Bilgi sistemlerinin güvenliğinin sağlamak amacıyla;
Talep ve şikayetlerin takibi amacıyla;
Finans, muhasebe (EduDiamond üzerinden) ve faturalandırma işlemlerinin yürütülmesi amacıyla;
Koç adaylarını seçme ve deneme amacıyla;
Organizasyon içi eğitimlerin sağlanması amacıyla;
Platform'un üçüncü kişilere tanıtılması amacıyla;
Koç veya öğrencilerin değerlendirmelerinin yapılması amacıyla;
Analiz ve rapor oluşturmak amacıyla.

Kişisel Verilerin Kimlere, Hangi Amaçla Aktarılabileceği
Kişisel verileriniz, beraber çalıştığımız influencer, fenomen veya reklam ajanslarına pazarlama veya reklam amacıyla aktarılabilir.
Kişisel verileriniz, koçlara veya öğrencilere, tanıtım amacıyla aktarılabilir.
Kişisel verileriniz, üçüncü kişi ödeme (EduDiamond altyapısı üzerinden) hizmet sağlayıcılar tarafından ödeme (EduDiamond altyapısı üzerinden)nin doğru ve etkili şekilde gerçekleşmesi amacıyla işlenebilir. Arı Koçluk’un sizin kart bilgilerinize erişmediğini önemle hatırlatırız.
Kişisel verileriniz Arı Koçluk’un grup şirketlerine, iş ortaklarına, pay sahiplerine, yetkili kamu otoritelerine aktarılabilir.

Kişisel Veri Toplama Yöntemi ve Hukuka Uygunluk Sebepleri
Kişisel veriler tamamen veya kısmen otomatik yollarla, elektronik ortamda form doldurularak, telefon görüşmesi ile, web sitesi veya mobil uygulama üzerinden, görüntü kaydı veya video ile işlenebilir.
Kişisel veriler işlenirken, açık rıza sebebine, kanunda öngörülmesi haline, sözleşmenin kurulması veya sözleşme hazırlıkları kapsamında işlenme sebebine, hukuki yükümlülüklerin gerçekleştirilmesi sebebine, verilerin alenileştirilmesine, bir hakkın tesisi, kullanılması veya korunması haline veya veri sorumlusunun meşru menfaati sebebine dayanılabilir.
Veri sorumlusu, veri toplama yöntemi ve aracına kendisi karar verecektir. Arı Koçluk, koçların ve öğrencilerin kişisel verilerini açık rıza sebebine dayanarak toplamaktadır. Açık rıza almadığı hallerde sözleşmenin kurulması veya ifası amacıyla kişisel veriler toplanmaktadır.

Teknik ve Organizasyonel Tedbirler
Arı Koçluk, kişisel verilerinizi korumak amacıyla makul teknik ve organizasyonel tedbirleri almaktadır. Bu kapsamda, Arı Koçluk çalışanlarını veya kişisel veriye erişen yetkililerini eğitmekte, gerekli siber güvenlik önlemlerini almaktadır. Arı Koçluk, PCI DSS sertifikası olan ödeme (EduDiamond altyapısı üzerinden) kuruluşları ile çalışmaya özen göstermektedir.

İlgili Kişinin Hakları
KVKK m.11 uyarınca:
(1) Herkes, veri sorumlusuna başvurarak kendisiyle ilgili;
Kişisel veri işlenip işlenmediğini öğrenme,
Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,
Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,
Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,
Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme,
7'nci maddede öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,
(d) ve (e) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,
Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme, haklarına sahiptir.
Ayrıca ilgili kişiler vermiş oldukları rızayı her zaman geri alabilir ve kişisel verilerinin silinmesini her zaman talep edebilir.

Kişisel veri ihlali ile ilgili veya diğer her türlü kişisel verilerin korunmasına ilişkin talep ve şikayetlerinizi info@arikocluk.com mail adresine her zaman iletebilirsiniz.



`
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