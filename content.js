chrome.storage.sync.get(["extensionEnabled"], function (result) {
    if (!(result.extensionEnabled ?? true)) {
        console.log("Eklenti pasif durumda, analiz yapılmayacak.");
        return;
    }

    const searchLinks = document.querySelectorAll('#search a[href^="http"]');

    const excludedSelectors = [
        '.kp-blk',
        '.knowledge-panel',
        '.mgAbYb.OSrXXb.RES9jf.IFnjPb',
        '.ZxS7Db',
        '.Ea5p3b',
        '.rGhul',
        '.UFQ0Gb.SLPe5b',
        '.action-menu',
        '.V0MxL',
        '.commercial-unit-desktop-top',
        '.kb0PBd.LnCrMe',
        '.rIRoqf',
        '[aria-label*="Çeviri"]',
        '[aria-label*="Translate"]',
        'a[href*="translate.google"]',
        '.uhHOwf',
        '.XNo5Ab',
        '.ez24Df',
        '.jfk-button',
        '.VfPpkd-Bz112c'
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
