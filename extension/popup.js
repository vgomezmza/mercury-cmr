document.addEventListener("DOMContentLoaded", () => {
  const crmUrlInput = document.getElementById("crmUrl");
  const crmApiKeyInput = document.getElementById("crmApiKey");
  const saveBtn = document.getElementById("saveBtn");
  const statusDiv = document.getElementById("status");

  // Load saved settings
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(["crmUrl", "crmApiKey"], (res) => {
      crmUrlInput.value = res.crmUrl || "http://localhost:3000";
      crmApiKeyInput.value = res.crmApiKey || "mercury_wa_sec_2026";
    });
  } else {
    crmUrlInput.value = localStorage.getItem("crmUrl") || "http://localhost:3000";
    crmApiKeyInput.value = localStorage.getItem("crmApiKey") || "mercury_wa_sec_2026";
  }

  saveBtn.addEventListener("click", () => {
    const crmUrl = crmUrlInput.value.trim() || "http://localhost:3000";
    const crmApiKey = crmApiKeyInput.value.trim() || "mercury_wa_sec_2026";

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ crmUrl, crmApiKey }, () => {
        statusDiv.className = "status success";
        setTimeout(() => {
          statusDiv.className = "status";
        }, 2500);
      });
    } else {
      localStorage.setItem("crmUrl", crmUrl);
      localStorage.setItem("crmApiKey", crmApiKey);
      statusDiv.className = "status success";
      setTimeout(() => {
        statusDiv.className = "status";
      }, 2500);
    }
  });
});
