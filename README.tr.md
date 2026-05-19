# URLDet - URL Güvenlik Analizi Eklentisi

![URLDet Logo](https://urldet.masahin.dev/android-icon-72x72.png)

[![MIT Lisansı](https://img.shields.io/badge/Lisans-MIT-green.svg)](LICENSE) [![Sürüm](https://img.shields.io/badge/sürüm-3.2.3-blue.svg)](https://github.com/SahinMuhammetAbdullah/urldet-extension/releases) [![Chrome Web Mağazası](https://img.shields.io/badge/Chrome%20Web%20Ma%C4%9Fazas%C4%B1-mevcut-brightgreen?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/urldet-url-g%C3%BCvenlik-anali/phjancankjcbmdjcdlipmhlnjhljakjf) [![JavaScript ile Yapıldı](https://img.shields.io/badge/JavaScript%20ile%20Yap%C4%B1ld%C4%B1-yellow?logo=javascript&logoColor=white)](https://developer.mozilla.org/tr/docs/Web/JavaScript) [![Flask API](https://img.shields.io/badge/API-Flask-black?logo=flask&logoColor=white)](https://github.com/SahinMuhammetAbdullah/urldet-api) [![PR'lar Kabul Edilir](https://img.shields.io/badge/PR'lar-Kabul%20Edilir-brightgreen.svg)](./.github/CONTRIBUTING.md)

URLDet, URL'leri gerçek zamanlı olarak analiz ederek çevrimiçi güvenliğinizi artıran bir tarayıcı eklentisidir. Doğrudan Google arama sonuçlarına entegre olarak bağlantı güvenliği hakkında anlık görsel geri bildirim sağlar ve manuel URL analizi için bir yan panel sunar. Bu proje bir mezuniyet projesinin çıktısıdır.

[**Web Sitesini Görüntüle**](https://urldet.masahin.dev/) | [**Tarayıcı Eklentisini Görüntüle**](https://chromewebstore.google.com/detail/urldet-url-g%C3%BCvenlik-anali/phjancankjcbmdjcdlipmhlnjhljakjf) | [**Read in English (İngilizce Oku)**](./README.md)

## 🔗 İlgili Depolar

| Depo | Açıklama |
|---|---|
| [**urldet-extension**](https://github.com/SahinMuhammetAbdullah/urldet-extension) | Chrome eklentisi kaynak kodu (bu depo) |
| [**urldet-web**](https://github.com/SahinMuhammetAbdullah/urldet-web) | Manuel URL analizi ve proje tanıtımı için React tabanlı web sitesi |
| [**urldet-api**](https://github.com/SahinMuhammetAbdullah/urldet-api) | ML tabanlı URL analiz motorunu çalıştıran Flask backend API'si |

## ✨ Özellikler

- **Gerçek Zamanlı Analiz:** Google arama sonuç sayfalarındaki URL'leri otomatik olarak tarar.
- **Görsel Göstergeler:** Arama sonucu bağlantılarının yanına doğrudan güvenlik simgeleri (güvenli, oltalama, kötü amaçlı yazılım vb.) ekler.
- **Manuel Analiz için Yan Panel:** Herhangi bir URL'yi manuel olarak girmek ve analiz etmek için yan paneli açın.
- **Ayrıntılı Sonuçlar:** Risk puanları ve tehdit türleri dahil olmak üzere kapsamlı bir analiz dökümü alın.
- **Çok Dil Desteği:** Arayüz hem İngilizce hem de Türkçe olarak mevcuttur.
- **Açık & Koyu Mod:** Günün her saatinde rahat bir görüntüleme deneyimi.

## 🛠️ Kullanılan Teknolojiler

- **Ön Yüz (Web Sitesi):** [React](https://reactjs.org/)
- **Ön Yüz (Eklenti):** HTML, CSS, Vanilla JavaScript
- **Arka Uç (API):** [Flask](https://flask.palletsprojects.com/)
- **Analiz Motoru:** Makine öğrenimi modelleri (Random Forest, Deep Q-Network)

## 🚀 Başlarken

Geliştirme amacıyla yerel bir kopya oluşturup çalıştırmak için şu adımları izleyin.

### Gereksinimler

- [Node.js](https://nodejs.org/) ve npm
- Çalışan bir URLDet Flask API örneği.
  - Kodlar arasında uzak sunucu API adresi mevcuttur. Yerelde API çalıştırmak için [urldet-api deposundaki](https://github.com/SahinMuhammetAbdullah/urldet-api) adımları takip ederek yerel API'yi başlatabilir, ardından koddaki API adresini kendi yerel IP adresinizle değiştirerek analizlerinizi gerçekleştirebilirsiniz.

### Kurulum (Geliştirme için)

1. **Depoyu klonlayın:**
   ```sh
   git clone https://github.com/SahinMuhammetAbdullah/urldet-extension.git
   ```
2. **Proje dizinine gidin:**
   ```sh
   cd urldet-extension
   ```
3. **Eklentiyi Chrome'a yükleyin:**
   - Chrome'u açın ve `chrome://extensions` adresine gidin.
   - Sağ üst köşedeki "Geliştirici modu"nu etkinleştirin.
   - "Paketlenmemiş öğe yükle"ye tıklayın ve klonladığınız proje klasörünü seçin.

## 🤝 Katkıda Bulunma

Katkılar, açık kaynak topluluğunu öğrenmek, ilham vermek ve yaratmak için harika bir yer haline getirir. Yapacağınız her katkı **büyük bir takdirle karşılanır**.

Davranış kurallarımız ve pull request gönderme süreci hakkında ayrıntılar için [`CONTRIBUTING.md`](./.github/CONTRIBUTING.md) dosyasına bakın.

## 📜 Lisans

Bu proje MIT Lisansı kapsamında lisanslanmıştır - ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

## 📧 İletişim

Muhammet Abdullah Şahin - [GitHub Profili](https://github.com/SahinMuhammetAbdullah)
