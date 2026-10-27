# Mercury CRM - WhatsApp Web Bridge (Extensión de Navegador)

Esta extensión conecta tu **WhatsApp Web** (`https://web.whatsapp.com`) directamente con **Mercury CRM**, sin importar si el CRM corre en tu ordenador o está alojado en la nube (Vercel, GitHub, etc.).

---

## 🚀 Cómo instalar la extensión en Google Chrome o Microsoft Edge (en 30 segundos)

1. Abre tu navegador (Google Chrome o Microsoft Edge).
2. En la barra de direcciones escribe:
   - En Chrome: `chrome://extensions`
   - En Edge: `edge://extensions`
3. Activa el interruptor **"Modo de desarrollador"** (en la esquina superior derecha en Chrome o panel izquierdo en Edge).
4. Haz clic en el botón **"Cargar extensión sin empaquetar"** (o *"Cargar descomprimida"*).
5. Selecciona esta carpeta: `c:\Proyectos\cmr\extension`.
6. ¡Listo! La extensión aparecerá instalada con el nombre **"Mercury CRM - WhatsApp Web Bridge"**.

---

## ⚙️ Configuración (1 sola vez)

1. Haz clic en el ícono de extensiones (el rompecabezas) en tu navegador y selecciona **Mercury CRM**.
2. Ingresa la URL de tu CRM:
   - Si lo usas online: `https://tu-crm.vercel.app`
   - Si lo pruebas localmente: `http://localhost:3000`
3. Token de API: `mercury_wa_sec_2026` (o el que definas en tus variables de entorno).
4. Clic en **Guardar Configuración**.

---

## 💬 Cómo usarlo con tus clientes

1. Entra a **https://web.whatsapp.com** como lo haces siempre.
2. Verás un botón flotante con el logo **"M"** de Mercury CRM en la esquina inferior derecha.
3. Haz clic en el chat de cualquier cliente:
   - **Si el cliente ya existe en el CRM:** Se abrirá la tarjeta con su nombre, empresa, etapa de negociación y presupuesto estimado.
   - **Si el cliente no existe:** Podrás crear el prospecto con 1 clic con el botón `+ Crear Lead en Mercury CAD`.
   - **Para leer y guardar la conversación:** Haz clic en `📥 Sincronizar Conversación`. Los últimos mensajes se enviarán y registrarán automáticamente en el historial del cliente dentro del CRM.
