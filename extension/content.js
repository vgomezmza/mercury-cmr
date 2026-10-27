// Mercury CRM - WhatsApp Web Bridge Content Script
(function () {
  console.log("Mercury CRM WhatsApp Web Bridge activo.");

  let crmBaseUrl = "http://localhost:3000";
  let apiKey = "mercury_wa_sec_2026";
  let currentLeadData = null;
  let activeContactName = "";
  let activeContactPhone = "";

  // Load config from extension storage
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(["crmUrl", "crmApiKey"], (res) => {
      if (res.crmUrl) crmBaseUrl = res.crmUrl.replace(/\/$/, "");
      if (res.crmApiKey) apiKey = res.crmApiKey;
    });
  }

  // Inject floating UI widget
  function injectWidget() {
    if (document.getElementById("mercury-wa-widget")) return;

    const widget = document.createElement("div");
    widget.id = "mercury-wa-widget";
    widget.innerHTML = `
      <div id="mercury-wa-panel">
        <div class="mercury-header">
          <div class="mercury-title">
            <span>⚡ Mercury CRM</span>
          </div>
          <span id="mercury-badge-status" class="mercury-badge">En Línea</span>
        </div>

        <div id="mercury-lead-container">
          <div class="mercury-status-text">
            Abre una conversación para vincular con Mercury CRM.
          </div>
        </div>

        <button id="mercury-sync-btn" class="mercury-btn mercury-btn-primary" style="display: none;">
          <span>📥 Sincronizar Conversación</span>
        </button>

        <button id="mercury-open-crm-btn" class="mercury-btn mercury-btn-outline">
          <span>Abrir Mercury CRM</span>
        </button>
      </div>

      <div id="mercury-wa-toggle" title="Mercury CRM">
        <span>M</span>
      </div>
    `;

    document.body.appendChild(widget);

    // Toggle button behavior
    const toggle = document.getElementById("mercury-wa-toggle");
    const panel = document.getElementById("mercury-wa-panel");
    toggle.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    // Open CRM in new tab
    document.getElementById("mercury-open-crm-btn").addEventListener("click", () => {
      window.open(crmBaseUrl, "_blank");
    });

    // Sync button
    document.getElementById("mercury-sync-btn").addEventListener("click", () => {
      syncCurrentChat();
    });
  }

  // Detect active chat info from WhatsApp Web DOM
  function inspectActiveChat() {
    const mainHeader = document.querySelector("header");
    if (!mainHeader) return;

    // Contact name / number usually lives in a span with dir="auto" inside the header
    const titleSpan = mainHeader.querySelector('span[dir="auto"]');
    if (!titleSpan) return;

    const contactTitle = titleSpan.innerText.trim();
    if (!contactTitle || contactTitle === activeContactName) return;

    activeContactName = contactTitle;
    activeContactPhone = contactTitle.replace(/[^0-9+]/g, "");

    queryLeadFromCRM(activeContactPhone, activeContactName);
  }

  // Query CRM API to check if lead exists
  async function queryLeadFromCRM(phone, name) {
    const container = document.getElementById("mercury-lead-container");
    const syncBtn = document.getElementById("mercury-sync-btn");
    if (!container) return;

    container.innerHTML = `
      <div class="mercury-status-text" style="color: #94a3b8;">
        Buscando ficha de ${name} en Mercury CRM...
      </div>
    `;

    try {
      const url = `${crmBaseUrl}/api/whatsapp/lead?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&apiKey=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.found && data.lead) {
        currentLeadData = data.lead;
        if (syncBtn) syncBtn.style.display = "flex";

        container.innerHTML = `
          <div class="mercury-lead-card">
            <div class="mercury-lead-name">${data.lead.nombre}</div>
            <div class="mercury-lead-company">${data.lead.empresa || "Empresa no especificada"}</div>
            <div class="mercury-lead-meta">
              <span style="color: #60a5fa; font-weight: 700;">${data.lead.estado.replace("_", " ")}</span>
              <span style="color: #34d399; font-weight: 800;">$${data.lead.valorEstimado.toLocaleString()} ${data.lead.moneda}</span>
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 6px;">
              Resp: <strong>${data.lead.asignadoANombre}</strong>
            </div>
          </div>
        `;
      } else {
        currentLeadData = null;
        if (syncBtn) syncBtn.style.display = "flex";

        container.innerHTML = `
          <div class="mercury-lead-card" style="border-color: rgba(245, 158, 11, 0.4);">
            <div class="mercury-lead-name" style="color: #fbbf24;">Contacto no registrado</div>
            <div class="mercury-lead-company">${name}</div>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
              Este número no figura en la cartera de Mercury CRM.
            </p>
            <button id="mercury-create-lead-btn" class="mercury-btn mercury-btn-primary" style="margin-top: 10px; font-size: 11px;">
              + Crear Lead en Mercury CAD
            </button>
          </div>
        `;

        const createBtn = document.getElementById("mercury-create-lead-btn");
        if (createBtn) {
          createBtn.addEventListener("click", () => {
            window.open(`${crmBaseUrl}?newLead=true&nombre=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`, "_blank");
          });
        }
      }
    } catch (e) {
      console.warn("No se pudo conectar con la API de Mercury CRM:", e);
      container.innerHTML = `
        <div class="mercury-status-text" style="color: #f87171;">
          No se pudo conectar con el CRM (${crmBaseUrl}). Verifica que esté en línea y el token sea correcto.
        </div>
      `;
      if (syncBtn) syncBtn.style.display = "none";
    }
  }

  // Extract messages from WhatsApp Web DOM and send to CRM API
  async function syncCurrentChat() {
    const syncBtn = document.getElementById("mercury-sync-btn");
    if (syncBtn) syncBtn.innerText = "⏳ Sincronizando...";

    const messageElements = document.querySelectorAll('div[data-pre-plain-text]');
    const messages = [];

    messageElements.forEach((el) => {
      const meta = el.getAttribute("data-pre-plain-text") || "";
      const text = el.innerText || "";
      // Check if message is from client or user
      const isFromMe = el.closest(".message-out") !== null;
      messages.push({
        sender: isFromMe ? "agente" : "cliente",
        text: text.trim(),
        meta: meta.trim(),
        timestamp: new Date().toISOString(),
      });
    });

    try {
      const res = await fetch(`${crmBaseUrl}/api/whatsapp/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          phone: activeContactPhone || activeContactName,
          contactName: activeContactName,
          messages: messages.slice(-15), // Last 15 messages
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${messages.length} mensaje(s) sincronizados con Mercury CRM`);
      } else {
        showToast(`⚠️ Error: ${data.error || "No se pudo sincronizar"}`);
      }
    } catch (e) {
      showToast("❌ Error al contactar el servidor de Mercury CRM");
    } finally {
      if (syncBtn) syncBtn.innerText = "📥 Sincronizar Conversación";
    }
  }

  function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "mercury-toast";
    toast.innerText = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  // Periodic inspector to detect chat switches
  setInterval(inspectActiveChat, 1500);

  // Initialize UI once DOM is ready
  window.addEventListener("load", () => {
    setTimeout(injectWidget, 2500);
  });
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(injectWidget, 2000);
  }
})();
