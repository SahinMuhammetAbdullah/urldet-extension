chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "analyzeUrl") {
        fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: request.url })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse(data);
        })
        .catch(error => {
            console.error("Flask sunucusuna istek atılırken hata:", error);
            sendResponse({ is_malicious: null, error: true });
        });

        // önemli: async response beklediğini tarayıcıya söyle!
        return true;
    }
});
