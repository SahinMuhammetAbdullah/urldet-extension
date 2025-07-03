# URLDet - URL Güvenlik Analiz Eklentisi

![URLDet Logo](https://urldet.masahin.dev/android-icon-72x72.png)

URLDet, URL'leri gerçek zamanlı olarak analiz ederek çevrimiçi güvenliğinizi artıran bir tarayıcı eklentisidir. Doğrudan Google arama sonuçlarına entegre olarak bağlantı güvenliği hakkında anında görsel geri bildirim sağlar ve manuel URL analizi için bir yan panel sunar. Bu proje, bir bitirme projesinin çıktısıdır.

[**Web Sitesini Ziyaret Et**](https://urldet.masahin.dev) | [**Read in English (İngilizce Oku)**](./README.md)

---

## ✨ Özellikler

- **Gerçek Zamanlı Analiz:** Google arama sonucu sayfalarındaki URL'leri otomatik olarak tarar.
- **Görsel Göstergeler:** Arama sonucu bağlantılarının yanına doğrudan güvenlik ikonları (güvenli, oltalama, kötü amaçlı yazılım vb.) ekler.
- **Manuel Analiz için Yan Panel:** Herhangi bir URL'yi manuel olarak girmek ve analiz etmek için yan paneli açın.
- **Detaylı Sonuçlar:** Risk skorları ve tehdit türleri dahil olmak üzere kapsamlı bir analiz dökümü alın.
- **Çoklu Dil Desteği:** Arayüz hem Türkçe hem de İngilizce olarak mevcuttur.
- **Açık ve Koyu Tema:** Günün her saati için konforlu bir görüntüleme deneyimi.

## 🛠️ Kullanılan Teknolojiler

- **Frontend (Web Sitesi):** [React](https://reactjs.org/)
- **Frontend (Eklenti):** HTML, CSS, Vanilla JavaScript
- **Backend (API):** [Flask](https://flask.palletsprojects.com/)
- **Analiz Motoru:** Makine Öğrenmesi modelleri (Random Forest, Deep Q-Network)

## 🚀 Geliştirme Ortamını Kurma

Projeyi yerel makinenizde geliştirme amacıyla çalıştırmak için bu basit adımları takip edebilirsiniz.

### Ön Gereksinimler

- [Node.js](https://nodejs.org/) ve npm
- Çalışan bir URLDet Flask API örneği.

### Kurulum (Geliştirme için)

1. **Repoyu klonlayın:**
   ```sh
   git clone https://github.com/SahinMuhammetAbdullah/urldet-extension.git
   ```
2. **Proje dizinine gidin:**
   ```sh
   cd urldet-extension
   ```
3. **Eklentiyi Chrome'a yükleyin:**
   - Chrome'u açın ve `chrome://urldet-extensions` adresine gidin.
   - Sağ üst köşedeki "Geliştirici modu"nu etkinleştirin.
   - "Paketlenmemiş öğe yükle" butonuna tıklayın ve klonladığınız proje klasörünü seçin.

## 🤝 Katkıda Bulunma

Katkılarınız, açık kaynak topluluğunu öğrenmek, ilham vermek ve yaratmak için harika bir yer haline getiren şeydir. Yaptığınız her katkı için **minnettarız**.

Davranış kurallarımız ve pull request gönderme süreci hakkında detaylı bilgi için lütfen [`CONTRIBUTING.md`](./.github/CONTRIBUTING.md) dosyasına bakın.

## 📜 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📧 İletişim

Muhammet Abdullah Şahin - [GitHub Profili](https://github.com/SahinMuhammetAbdullah)

Proje Linki: [https://github.com/SahinMuhammetAbdullah/urldet-extension](https://github.com/SahinMuhammetAbdullah/urldet-extension)