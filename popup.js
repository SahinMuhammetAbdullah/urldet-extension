document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggleScript");
  const status = document.getElementById("status");
  const darkModeToggle = document.getElementById("darkMode");
  const reloadButton = document.getElementById("reloadPage");

  function updateStatusText(enabled) {
    status.textContent = enabled ? "Eklenti aktif" : "Eklenti pasif";
    status.style.color = enabled ? "green" : "red";
    toggle.className = "toggle-button " + (enabled ? "enabled" : "disabled");
    toggle.textContent = enabled ? "Eklenti Aktif" : "Eklenti Pasif";
  }

  function updateDarkModeButton(isDark) {
    darkModeToggle.textContent = isDark ? "Koyu Tema Açık" : "Koyu Tema Kapalı";
    document.body.classList.toggle("dark", isDark);
    // .mode-button sınıfı zaten temaya göre renklendirildi, ekstra sınıfa gerek yok
  }

  // Depolanan değerleri yükle
  chrome.storage.sync.get(["extensionEnabled", "darkMode"], function (result) {
    const enabled = result.extensionEnabled ?? true;
    updateStatusText(enabled);

    const isDark = result.darkMode ?? false;
    updateDarkModeButton(isDark);
  });

  // Eklenti durumunu değiştir
  toggle.addEventListener("click", function () {
    chrome.storage.sync.get("extensionEnabled", function (result) {
      const enabled = !(result.extensionEnabled ?? true);
      chrome.storage.sync.set({ extensionEnabled: enabled }, function () {
        updateStatusText(enabled);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs[0]?.id) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ["content.js"]
            });
          }
        });
      });
    });
  });

  // Tema durumunu değiştir
  darkModeToggle.addEventListener("click", function () {
    chrome.storage.sync.get("darkMode", function (result) {
      const isDark = !(result.darkMode ?? false);
      chrome.storage.sync.set({ darkMode: isDark }, function () {
        updateDarkModeButton(isDark);
      });
    });
  });

  // Sayfayı yenile
  reloadButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
    });
  });
});