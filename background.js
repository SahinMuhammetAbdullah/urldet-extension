// content.js veya sidepanel.js'den gelen analiz isteklerini dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 1. ANALİZ İSTEĞİ İŞLEME
    if (request.action === "analyzeUrl") {
        fetch("https://urldet.masahin.dev/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: request.url })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            return response.json();
        })
        .then(data => sendResponse(data))
        .catch(error => {
            console.error("API isteği hatası:", error);
            sendResponse({ error: true, message: error.message });
        });
        return true; // Async yanıt için her zaman 'true' döndür
    }

    // 2. SIDE PANEL AÇMA İSTEĞİ İŞLEME
    if (request.action === "openSidePanel") {
        // Hatanın kaynağı burasıydı. `sender.tab` her zaman mevcut değildir.
        // Bunun yerine, aktif olan sekmeyi sorgulamalıyız.
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                // Mevcut sekmede Side Panel'i aç/kapat
                chrome.sidePanel.open({ tabId: tabId });
            }
        });
    }
});