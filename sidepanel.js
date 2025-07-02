document.addEventListener("DOMContentLoaded", () => {
    // --- Elementleri Seçme ---
    const urlInput = document.getElementById("urlInput");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const loadingDiv = document.getElementById("loading");
    const errorDiv = document.getElementById("error");
    const resultDiv = document.getElementById("result");
    const visitWebsiteBtn = document.getElementById("visitWebsiteBtn");
    const rateExtensionBtn = document.getElementById("rateExtensionBtn");
    const darkModeBtn = document.getElementById("darkModeBtn");

    // --- Metinleri Yerelleştirme ve UI Güncelleme ---
    const localize = () => {
        document.querySelectorAll('[data-i18n-text]').forEach(el => {
            const messageKey = el.getAttribute('data-i18n-text');
            const message = chrome.i18n.getMessage(messageKey);
            if (message) {
                el.innerText = message;
            }
        });
        urlInput.placeholder = chrome.i18n.getMessage("inputPlaceholder");
    };

    const updateDarkModeUI = (isDark) => {
        document.body.classList.toggle("dark", isDark);
    };

    const reloadActiveTab = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Sadece http/https ile başlayan, yani gerçek web sayfalarını yenile
            if (tabs[0] && tabs[0].id && tabs[0].url && tabs[0].url.startsWith("http")) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    };

    // --- Başlangıç Ayarları ---
    // Sayfa yüklendiğinde depolanan tema bilgisini al ve UI'yı güncelle
    chrome.storage.sync.get(["darkMode"], (result) => {
        localize();
        updateDarkModeUI(result.darkMode ?? false);
    });

    // --- Analiz Mantığı ---
    const handleAnalyze = () => {
        const url = urlInput.value.trim();

        // Basit validasyon
        if (!url) {
            showError(chrome.i18n.getMessage("errorInvalidURL"));
            return;
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            showError(chrome.i18n.getMessage("errorURLFormat"));
            return;
        }

        // UI'ı sıfırla ve yükleme animasyonunu göster
        showLoading(true);
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';

        // background.js'e analiz için mesaj gönder
        chrome.runtime.sendMessage({ action: "analyzeUrl", url: url }, (response) => {
            showLoading(false);

            if (!response || response.error) {
                showError(`${chrome.i18n.getMessage("errorPrefix")} ${response?.message || 'Unknown error'}`);
                return;
            }
            displayResult(response);
        });
    };

    // --- Olay Dinleyicileri ---
    analyzeBtn.addEventListener("click", handleAnalyze);
    urlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleAnalyze();
        }
    });

    darkModeBtn.addEventListener("click", () => {
        chrome.storage.sync.get("darkMode", (result) => {
            const newStatus = !(result.darkMode ?? false);
            chrome.storage.sync.set({ darkMode: newStatus }, () => {
                updateDarkModeUI(newStatus);
                // Tema değişikliği content script'i de etkileyebileceği için sayfayı yenilemek iyi bir pratik
                reloadActiveTab();
            });
        });
    });

    visitWebsiteBtn.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://urldet.masahin.dev" });
    });

    rateExtensionBtn.addEventListener("click", () => {
        // Mağaza linkinizi buraya ekleyin
        const storeUrl = "https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID";
        chrome.tabs.create({ url: storeUrl });
    });

    // --- Yardımcı UI Fonksiyonları ---
    const showLoading = (isLoading) => {
        loadingDiv.style.display = isLoading ? 'block' : 'none';
        analyzeBtn.disabled = isLoading;
    };

    const showError = (message) => {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    const displayResult = (data) => {
        resultDiv.style.display = 'block';
        resultDiv.className = `result ${data.is_malicious ? 'malicious' : 'safe'}`;

        const riskLevel = data.malicious_probability > 0.8 ? 'Yüksek' :
            data.malicious_probability > 0.6 ? 'Orta' :
                data.malicious_probability > 0.4 ? 'Düşük' : 'Minimal';

        // --- EN ÖNEMLİ DEĞİŞİKLİK BURADA ---
        // Risk seviyesi metninin rengini, arka planın güvenli mi yoksa tehlikeli mi olduğuna göre belirle.
        let riskTextColor;
        if (data.is_malicious) {
            // Tehlikeli (kırmızı/turuncu) arka plan üzerinde açık renk daha iyi okunur.
            riskTextColor = '#FFFFFF'; // Beyaz
        } else {
            // Güvenli (yeşil) arka plan üzerinde koyu renk daha iyi okunur.
            riskTextColor = '#145A32'; // Koyu Yeşil (veya #333 de olabilir)
        }

        // Sonuçları HTML olarak oluştur
        resultDiv.innerHTML = `
            <div class="result-header">
                <span class="result-icon">${data.is_malicious ? '⚠️' : '✅'}</span>
                <div>
                    <h3>${data.is_malicious ? chrome.i18n.getMessage("resultMalicious") : chrome.i18n.getMessage("resultSafe")}</h3>
                </div>
            </div>
            <div class="result-details">
                <div class="detail-card">
                    <h4>🛡️ ${chrome.i18n.getMessage("resultStatus")}</h4>
                    <p>
                        <strong>${chrome.i18n.getMessage("resultStatus")}:</strong> 
                        ${data.is_malicious ? chrome.i18n.getMessage("resultMalicious") : chrome.i18n.getMessage("resultSafe")}
                    </p>
                    <p>
                        <strong>${chrome.i18n.getMessage("resultRiskLevel")}:</strong> 
                        <span style="color: ${riskTextColor}; font-weight: bold;">${riskLevel}</span>
                    </p>
                </div>
                <div class="detail-card">
                    <h4>📊 ${chrome.i18n.getMessage("resultProbabilities")}</h4>
                    <p><strong>${chrome.i18n.getMessage("resultSafeProb")}:</strong> %${(data.benign_probability * 100).toFixed(1)}</p>
                    <p><strong>${chrome.i18n.getMessage("resultMaliciousProb")}:</strong> %${(data.malicious_probability * 100).toFixed(1)}</p>
                </div>
                ${data.is_malicious ? `
                <div class="detail-card">
                    <h4>🎯 ${chrome.i18n.getMessage("resultThreatCategory")}</h4>
                    <p><strong>${chrome.i18n.getMessage("resultType")}:</strong> ${data.malware_type || 'N/A'}</p>
                </div>
                <div class="detail-card" style="background: rgba(255, 255, 255, 0.2);">
                    <h4>⚠️ ${chrome.i18n.getMessage("resultSafetyWarningTitle")}</h4>
                    <p>${chrome.i18n.getMessage("resultSafetyWarningText")}</p>
                </div>` : ''}
            </div>
        `;
    };
});