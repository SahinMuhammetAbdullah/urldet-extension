chrome.storage.sync.get(["extensionEnabled"], function (result) {
    if (!(result.extensionEnabled ?? true)) {
        console.log("URLDet: Eklenti pasif, analiz yapılmayacak.");
        return;
    }

    // --- 1. MODERN CSS (Aynı kalıyor) ---
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --urldet-tooltip-bg: #333; }
        
        .urldet-tooltip-container {
            position: absolute;
            background: var(--urldet-tooltip-bg);
            color: #fff;
            padding: 12px 14px;
            border-radius: 8px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 1.3rem;
            z-index: 2147483647;
            pointer-events: none;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.15);
            opacity: 0;
            transform: translateY(10px) scale(0.95);
            transition: opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            line-height: 1.4;
            min-width: 160px; 
        }

        .urldet-tooltip-container.active {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .urldet-tooltip-container::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 14px;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            border-color: var(--urldet-tooltip-bg) transparent transparent transparent;
        }

        .urldet-tooltip-title { 
            font-weight: 700; 
            display: block; 
            margin-bottom: 2px; 
            font-size: 1.3rem;
        }
        
        .urldet-tooltip-sub { 
            font-size: 0.8rem; 
            opacity: 0.9; 
            font-weight: 400; 
            display: block; 
            margin-bottom: 8px; 
        }
        
        .urldet-progress-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .urldet-progress-bg {
            flex-grow: 1;
            height: 6px;
            background-color: rgba(255,255,255,0.2);
            border-radius: 3px;
            overflow: hidden;
        }

        .urldet-progress-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .urldet-percentage {
            font-size: 0.8rem;
            font-weight: 800;
            color: rgba(255,255,255, 0.95);
            min-width: 35px;
            text-align: right;
        }
    `;
    document.head.appendChild(style);
    // -----------------------------------------------------
    // --- 2. RENK YAPILANDIRMASI ---
    // Her tür için özel arka plan (bg) ve progress bar (bar) renkleri
    const colorMap = {
        safe: { bg: "rgba(76, 175, 80, 0.95)", bar: "#C8E6C9" },       // Yeşil (Görseldeki Being)
        malware: { bg: "rgba(211, 47, 47, 0.95)", bar: "#FFCDD2" },    // Kırmızı (Görseldeki Malware)
        phishing: { bg: "rgba(239, 108, 0, 0.95)", bar: "#FFE0B2" },   // Turuncu (Görseldeki Phishing)
        defacement: { bg: "rgba(173, 20, 87, 0.95)", bar: "#F8BBD0" }, // Mor/Magenta (Görseldeki Defacement)
        spam: { bg: "rgba(249, 168, 37, 0.95)", bar: "#FFF9C4" },      // Koyu Sarı (Görseldeki Spam) - Beyaz yazı okunsun diye koyulaştırıldı
        unknown: { bg: "rgba(97, 97, 97, 0.95)", bar: "#E0E0E0" }      // Gri (Bilinmeyen)
    };

    const searchLinks = document.querySelectorAll('#search a[href^="http"]');

    // --- ENGELLENEN SEÇİCİLER VE AÇIKLAMALARI ---
    const excludedSelectors = [
        // -- Google Bilgi Kartları ve Panelleri --
        '.kp-blk',                      // Bilgi Paneli ana bloğu (Knowledge Panel)
        '.knowledge-panel',             // Bilgi paneli genel sınıfı
        '.mgAbYb.OSrXXb.RES9jf.IFnjPb', // Özel bilgi kartı bileşenleri
        '.ZxS7Db',                      // Görsel ağırlıklı bilgi kartları
        '.Ea5p3b',                      // Harita veya yer bilgisi kartları
        '.rGhul',                       // Bazı öne çıkan snippet (featured snippet) başlıkları
        '.UFQ0Gb.SLPe5b',               // Bilgi kartı içindeki alt bileşenler

        // -- Arayüz Elemanları ve Menüler --
        '.action-menu',                 // Sonucun yanındaki üç nokta menüsü
        '.V0MxL',                       // Menü açılır pencereleri
        '.jfk-button',                  // Google'ın standart butonları
        '.VfPpkd-Bz112c',               // Yeni Material Design buton yapıları

        // -- Reklamlar --
        '.commercial-unit-desktop-top', // Sayfa üstü alışveriş reklamları
        '.kb0PBd.LnCrMe',               // Sponsorlu ürün kartları
        '.rIRoqf',                      // Reklam etiketleri veya konteynerleri

        // -- Çeviri Araçları --
        '[aria-label*="Çeviri"]',       // "Bu sayfayı çevir" linkleri (TR)
        '[aria-label*="Translate"]',    // "Translate this page" linkleri (EN)
        'a[href*="translate.google"]',  // Doğrudan translate linkleri
        'eFM0qc BCF2pd',

        // -- Diğer Google Özellikleri --
        '.uhHOwf',                      // "Kullanıcılar şunu da sordu" (People also ask) bölümü
        '.XNo5Ab',                      // Video karuselleri veya küçük resimler
        '.ez24Df',                      // Alakalı aramalar veya etiketler
        'eFM0qc',                       // Zengin kartlar (Rich Cards)
        'BCF2pd'                        // Kitap, Film gibi özel içerik kartları
    ];

    searchLinks.forEach(link => {
        if (excludedSelectors.some(sel => link.closest(sel))) return;
        if (link.querySelector('img[data-extension-icon]')) return;

        const url = link.href;

        chrome.runtime.sendMessage({ action: "analyzeUrl", url: url }, function (response) {
            if (chrome.runtime.lastError || !response || response.error) return;

            let iconName = null;
            let tooltipHtml = "";
            let tooltipColor = "";

            // --- SKOR HESAPLAMA (GÜNCELLENDİ) ---
            // Python backend'den gelen float değerleri (0.98 gibi) yüzdeye çeviriyoruz.
            let safetyScore = 0;

            if (response.is_malicious === true && response.malicious_probability !== undefined) {
                // Zararlı ise "malicious_probability" değerini kullan
                safetyScore = (response.malicious_probability * 100).toFixed(1);
            }
            else if (response.is_malicious === false && response.benign_probability !== undefined) {
                // Güvenli ise "benign_probability" değerini kullan
                safetyScore = (response.benign_probability * 100).toFixed(1);
            }
            else {
                // Veri gelmezse fallback (Yedek) değerler
                safetyScore = response.is_malicious ? 95.0 : 99.0;
            }

            if (response.is_malicious === true) {
                const type = response.malware_type?.toLowerCase() || "unknown";
                const validTypes = ["phishing", "spam", "malware", "defacement"];

                iconName = validTypes.includes(type) ? `${type}.png` : "malware.png";
                // Color Map'ten rengi çek (Yoksa varsayılan malware kırmızısını kullan)
                const theme = colorMap[type] || colorMap["malware"];
                tooltipColor = theme.bg;
                barColor = theme.bar;

                const riskTitle = chrome.i18n.getMessage("tooltip_risk_title") || "Risk Detected";
                const typeLabel = chrome.i18n.getMessage("tooltip_type_label") || "Type:";
                const localizedType = chrome.i18n.getMessage("maliciousLink", type) || type.toUpperCase();

                tooltipHtml = `
                    <span class="urldet-tooltip-title">⚠️ ${riskTitle}</span>
                    <span class="urldet-tooltip-sub">${typeLabel} ${localizedType}</span>
                    
                    <div class="urldet-progress-wrapper">
                        <div class="urldet-progress-bg">
                            <div class="urldet-progress-fill" style="width: ${safetyScore}%; background-color: ${barColor};"></div>
                        </div>
                        <span class="urldet-percentage">%${safetyScore}</span>
                    </div>
                `;

            } else if (response.is_malicious === false) {
                // --- GÜVENLİ ---
                iconName = "being.png";

                // Color Map'ten güvenli rengi çek
                const theme = colorMap["safe"];
                tooltipColor = theme.bg;
                barColor = theme.bar;

                const safeTitle = chrome.i18n.getMessage("tooltip_safe_title") || "Safe Connection";
                const safeDesc = chrome.i18n.getMessage("tooltip_safe_desc") || "No threats found";

                tooltipHtml = `
                    <span class="urldet-tooltip-title">🛡️ ${safeTitle}</span>
                    <span class="urldet-tooltip-sub">${safeDesc}</span>
                    
                    <div class="urldet-progress-wrapper">
                        <div class="urldet-progress-bg">
                            <div class="urldet-progress-fill" style="width: ${safetyScore}%; background-color: ${barColor};"></div>
                        </div>
                        <span class="urldet-percentage">%${safetyScore}</span>
                    </div>
                `;
            } else {
                return;
            }

            // --- İKON VE TOOLTIP EVENTLERİ (Aynı kalıyor) ---
            const icon = document.createElement("img");
            icon.src = chrome.runtime.getURL(`icons/${iconName}`);
            icon.setAttribute("data-extension-icon", "true");
            icon.setAttribute("data-html", tooltipHtml);
            icon.setAttribute("data-color", tooltipColor);
            icon.style.cssText = `width: 26px; height: 26px; margin-right: 6px; vertical-align: middle; display: inline-block; cursor: help;`;

            icon.addEventListener("mouseenter", (e) => {
                document.querySelectorAll(".urldet-tooltip-container").forEach(el => el.remove());

                const targetIcon = e.target;
                const htmlContent = targetIcon.getAttribute("data-html");
                const colorCode = targetIcon.getAttribute("data-color");

                const tooltip = document.createElement("div");
                tooltip.className = "urldet-tooltip-container";
                tooltip.innerHTML = htmlContent;
                tooltip.style.setProperty('--urldet-tooltip-bg', colorCode);

                document.body.appendChild(tooltip);

                const rect = targetIcon.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                const leftPos = rect.left + (rect.width / 2) - 20;
                const topPos = rect.top + window.scrollY - tooltipRect.height - 10;

                tooltip.style.left = `${leftPos}px`;
                tooltip.style.top = `${topPos}px`;

                requestAnimationFrame(() => {
                    tooltip.classList.add("active");
                });
            });

            icon.addEventListener("mouseleave", () => {
                const tooltips = document.querySelectorAll(".urldet-tooltip-container");
                tooltips.forEach(t => {
                    t.classList.remove("active");
                    setTimeout(() => t.remove(), 200);
                });
            });

            link.prepend(icon, ' ');
        });
    });
});