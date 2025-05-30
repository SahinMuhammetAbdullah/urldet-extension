chrome.storage.sync.get(["extensionEnabled"], function (result) {
    if (!(result.extensionEnabled ?? true)) {
        console.log("Eklenti pasif durumda, analiz yapılmayacak.");
        return;
    }

    const searchLinks = document.querySelectorAll('#search a[href^="http"]');

    const excludedSelectors = [
        '.kp-blk', // Google bilgi paneli bloğu (knowledge panel block)
        '.knowledge-panel', // Sağ tarafta çıkan detaylı bilgi paneli
        '.mgAbYb.OSrXXb.RES9jf.IFnjPb', // Google'ın öne çıkan snippet bileşeni
        '.ZxS7Db', // Arama sonucunda çıkan kart yapısı (örneğin haber kutuları)
        '.Ea5p3b', // Reklam kutuları
        '.rGhul', // Google arama sonuçlarındaki hızlı cevap kutusu
        '.UFQ0Gb.SLPe5b', // Üstteki hızlı link seçenekleri ya da "Araçlar" bölümü
        '.action-menu', // Seçenek menüsü (örneğin üç nokta menüsü)
        '.V0MxL', // Arama sonucu üstündeki bağlantı türü filtreleri (Tümü, Görseller vb.)
        '.commercial-unit-desktop-top', // Sayfanın üst kısmında yer alan reklamlar
        '.kb0PBd.LnCrMe', // Sayfanın yan kısmındaki bazı özel bileşenler
        '.rIRoqf', // Kullanıcı tarafından özelleştirilmiş sonuçlar veya öneriler
        '[aria-label*="Çeviri"]', // "Çeviri" ibaresi içeren bileşenler
        '[aria-label*="Translate"]', // "Translate" içeren öğeler (İngilizce çeviri kutuları)
        'a[href*="translate.google"]', // translate.google.com bağlantıları
        '.uhHOwf', // Google özel bilgi kartları (örneğin tarih, saat, konum bilgisi)
        '.XNo5Ab', // Sıkça sorulan sorular (FAQ) kutuları
        '.ez24Df', // Google'ın önerilen sorgular bileşeni
        '.jfk-button', // Google’ın klasik buton bileşeni (örneğin "Daha fazla göster")
        '.VfPpkd-Bz112c' // Material Design ile yapılmış modern Google butonları
    ]; 

    searchLinks.forEach(link => {
        if (excludedSelectors.some(sel => link.closest(sel))) return;

        // Önceki ikonları temizle
        const existingIcons = link.querySelectorAll('img[data-extension-icon]');
        existingIcons.forEach(icon => icon.remove());

        const url = link.href;

        chrome.runtime.sendMessage({ action: "analyzeUrl", url: url }, function (response) {
            if (chrome.runtime.lastError) {
                console.error("Mesaj hatası:", chrome.runtime.lastError.message);
                return;
            }

            // İkon tipi belirle
            let iconName = null;
            let titleText = "";

            if (response?.is_malicious === true) {
                const type = response.malware_type?.toLowerCase();
                const validTypes = ["phishing", "spam", "malware", "defacement"];

                if (validTypes.includes(type)) {
                    iconName = `${type}.png`;
                    titleText = `Zararlı bağlantı: ${type}`;
                } else {
                    console.warn("Bilinmeyen zarar türü:", type);
                    return;
                }
            } else if (response?.is_malicious === false) {
                iconName = "being.png";
                titleText = "Güvenli bağlantı";
            } else {
                return; // analiz başarısız, ikon ekleme
            }

            // İkon oluştur ve ekle
            const icon = document.createElement("img");
            icon.src = chrome.runtime.getURL(`icons/${iconName}`);
            icon.setAttribute("data-extension-icon", "true");

            icon.style.cssText = `
                width: 16px;
                height: 16px;
                margin-right: 5px;
                vertical-align: middle;
                display: inline-block;
            `;
            icon.title = titleText;

            link.insertBefore(icon, link.firstChild);
            link.insertAdjacentText('afterbegin', ' ');
        });
    });
});
