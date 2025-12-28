// // 🚀 Inicia ao carregar
// window.addEventListener("load", iniciarCamera);
let html5Qrcode = null;
let lendo = false;
let cameraIniciada = false;

// 🎨 Feedback visual
function mostrarFeedback(mensagem, tipo) {
  const feedback = document.getElementById("feedback");

  feedback.textContent = mensagem;
  feedback.className = "feedback " + tipo;
  feedback.classList.remove("hidden");

  setTimeout(() => {
    feedback.classList.add("hidden");
    iniciarCamera();
  }, 2000);
}

// 📤 Envia leitura ao backend
async function fetchCheckin(texto) {
  if (lendo) return;
  lendo = true;

  try {
    const response = await fetch("/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeFamilia: texto })
    });

    const msg = await response.text();

    if (response.status === 200) {
      mostrarFeedback(
        msg,
        msg.toLowerCase().includes("já") ? "aviso" : "sucesso"
      );
    } else {
      mostrarFeedback(msg, "erro");
    }
  } catch {
    mostrarFeedback("Erro ao conectar ao servidor", "erro");
  } finally {
    lendo = false;
  }
}

// 📸 Leitura do QR
function onScanSuccess(decodedText) {
  if (cameraIniciada === false) return;

  pararCamera();
  fetchCheckin(decodedText);
}

// 🎥 Inicia câmera (garantia única)
function iniciarCamera() {
  if (html5Qrcode || cameraIniciada) return;

  html5Qrcode = new Html5Qrcode("reader");
  cameraIniciada = true;

  html5Qrcode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: (vw, vh) => {
        const size = Math.min(vw, vh);
        return { width: size * 0.7, height: size * 0.7 };
      }
    },
    onScanSuccess
  ).catch(() => {
    cameraIniciada = false;
    html5Qrcode = null;
  });
}

// ⛔ Para câmera corretamente
function pararCamera() {
  if (!html5Qrcode) return;

  html5Qrcode.stop().then(() => {
    html5Qrcode.clear();
    html5Qrcode = null;
    cameraIniciada = false;
  });
}

// 🚀 Start único
window.addEventListener("load", iniciarCamera, { once: true });

