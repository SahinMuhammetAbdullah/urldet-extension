const links = document.querySelectorAll('a[href^="http"]');

links.forEach(link => {
    const url = link.href;

    chrome.runtime.sendMessage({ action: "analyzeUrl", url: url }, function (response) {
        if (response && response.is_malicious !== null) {
            const icon = document.createElement("img");
            icon.src = response.is_malicious ? chrome.runtime.getURL("icons/warning.png") : chrome.runtime.getURL("icons/check.png");
            icon.style.width = "16px";
            icon.style.marginLeft = "5px";
            icon.title = response.is_malicious
                ? `Zararlı! Tür: ${response.malware_type}`
                : "Zararsız";

            link.parentElement?.appendChild(icon);
        }
    });
});
