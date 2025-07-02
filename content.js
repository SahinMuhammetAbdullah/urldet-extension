chrome.storage.sync.get(["extensionEnabled"], function (result) {
    if (!(result.extensionEnabled ?? true)) {
        console.log("URLDet: Eklenti pasif, analiz yapılmayacak.");
        return;
    }

    const searchLinks = document.querySelectorAll('#search a[href^="http"]');

    const excludedSelectors = [
        '.kp-blk', '.knowledge-panel', '.mgAbYb.OSrXXb.RES9jf.IFnjPb',
        '.ZxS7Db', '.Ea5p3b', '.rGhul', '.UFQ0Gb.SLPe5b', '.action-menu',
        '.V0MxL', '.commercial-unit-desktop-top', '.kb0PBd.LnCrMe', '.rIRoqf',
        '[aria-label*="Çeviri"]', '[aria-label*="Translate"]',
        'a[href*="translate.google"]', '.uhHOwf', '.XNo5Ab', '.ez24Df',
        '.jfk-button', '.VfPpkd-Bz112c'
    ];

    searchLinks.forEach(link => {
        // Engellenen bir elementin içindeyse atla
        if (excludedSelectors.some(sel => link.closest(sel))) return;
        // Zaten ikon eklenmişse atla
        if (link.querySelector('img[data-extension-icon]')) return;

        const url = link.href;

        chrome.runtime.sendMessage({ action: "analyzeUrl", url: url }, function (response) {
            if (chrome.runtime.lastError) {
                console.error("Mesaj hatası:", chrome.runtime.lastError.message);
                return;
            }
            if (!response || response.error) {
                console.error("Analiz başarısız:", response?.message);
                return;
            }

            let iconName = null;
            let titleText = "";

            if (response.is_malicious === true) {
                const type = response.malware_type?.toLowerCase() || "unknown";
                const validTypes = ["phishing", "spam", "malware", "defacement"];
                iconName = validTypes.includes(type) ? `${type}.png` : "malware.png"; // Bilinmeyen türler için genel malware ikonu
                // Yerelleştirilmiş metni al
                titleText = chrome.i18n.getMessage("maliciousLink", type);
            } else if (response.is_malicious === false) {
                iconName = "being.png";
                // Yerelleştirilmiş metni al
                titleText = chrome.i18n.getMessage("safeLink");
            } else {
                return; // Sonuç belirsizse ikon ekleme
            }

            const icon = document.createElement("img");
            icon.src = chrome.runtime.getURL(`icons/${iconName}`);
            icon.setAttribute("data-extension-icon", "true");
            icon.style.cssText = `width: 16px; height: 16px; margin-right: 5px; vertical-align: middle; display: inline-block;`;
            icon.title = titleText;

            link.prepend(icon, ' ');
        });
    });
});