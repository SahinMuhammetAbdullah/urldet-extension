document.addEventListener("DOMContentLoaded", function () {
  // --- Elementler ---
  const toggleScriptBtn = document.getElementById("toggleScript");
  const statusP = document.getElementById("status");
  const openSidePanelBtn = document.getElementById("openSidePanelBtn");
  const darkModeBtn = document.getElementById("darkModeBtn");
  const visitWebsiteBtn = document.getElementById("visitWebsiteBtn");
  const rateExtensionBtn = document.getElementById("rateExtensionBtn");

  // --- Yardımcı Fonksiyonlar ---
  const localize = () => {
    document.querySelectorAll('[data-i18n-text]').forEach(el => {
      const message = chrome.i18n.getMessage(el.getAttribute('data-i18n-text'));
      if (message) el.innerText = message;
    });
  };

  const updateStatusUI = (enabled) => {
    statusP.textContent = chrome.i18n.getMessage(enabled ? "statusEnabled" : "statusDisabled");
    toggleScriptBtn.textContent = chrome.i18n.getMessage(enabled ? "enableExtension" : "disableExtension");
    toggleScriptBtn.className = "btn " + (enabled ? "enabled" : "disabled");
  };

  const updateDarkModeUI = (isDark) => {
    document.body.classList.toggle("dark", isDark);
  };

  const reloadActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.startsWith("http")) { // Sadece http/s sayfalarını yenile
        chrome.tabs.reload(tabs[0].id);
      }
    });
  };

  // --- Başlangıç ---
  chrome.storage.sync.get(["extensionEnabled", "darkMode"], (result) => {
    localize();
    updateStatusUI(result.extensionEnabled ?? true);
    updateDarkModeUI(result.darkMode ?? false);
  });

  // --- Olay Dinleyiciler ---
  toggleScriptBtn.addEventListener("click", () => {
    chrome.storage.sync.get("extensionEnabled", (result) => {
      const newStatus = !(result.extensionEnabled ?? true);
      chrome.storage.sync.set({ extensionEnabled: newStatus }, () => {
        updateStatusUI(newStatus);
        reloadActiveTab();
      });
    });
  });

  darkModeBtn.addEventListener("click", () => {
    chrome.storage.sync.get("darkMode", (result) => {
      const newStatus = !(result.darkMode ?? false);
      chrome.storage.sync.set({ darkMode: newStatus }, () => {
        updateDarkModeUI(newStatus);
        reloadActiveTab();
      });
    });
  });

  openSidePanelBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openSidePanel" });
  });

  visitWebsiteBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://urldet.masahin.dev" });
  });

  rateExtensionBtn.addEventListener("click", () => {
    // Mağaza linkinizi buraya ekleyin
    const storeUrl = "https://chrome.google.com/webstore/detail/phjancankjcbmdjcdlipmhlnjhljakjf";
    chrome.tabs.create({ url: storeUrl });
  });
});