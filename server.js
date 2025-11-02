import express from "express";
import fs from "fs";
import csv from "csv-parser";
import qrcode from "qrcode";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;
const convidados = new Map();

const qrPath = path.join("public/qrcodes");
if (!fs.existsSync(qrPath)) fs.mkdirSync(qrPath, { recursive: true });

// 🧾 Carrega os convidados do CSV
fs.createReadStream("Convidados_casamento.csv")
  .pipe(csv())
  .on("data", (row) => {
    const key = `${row.nome.trim()} ${row.familia.trim()}`;
    convidados.set(key, { nome: row.nome.trim(), familia: row.familia.trim(), presente: false });
  })
  .on("end", () => console.log("✅ Convidados carregados:", convidados.size));

app.use(bodyParser.json());
app.use(express.static("public"));

// 🧩 Gera os QR Codes
app.get("/gerar-qrcodes", async (req, res) => {
  for (const [key, c] of convidados) {
    const nomeArquivo = `${c.nome.replace(/\s+/g, "_")}_${c.familia.replace(/\s+/g, "_")}.png`;
    const conteudo = `${c.nome} ${c.familia}`; // formato reconhecido pelo servidor
    await qrcode.toFile(path.join(qrPath, nomeArquivo), conteudo, { errorCorrectionLevel: "H" });
  }
  res.send("✅ QR Codes gerados em /public/qrcodes/");
});

// 🧠 Check-in
app.post("/checkin", (req, res) => {
  const { nomeFamilia } = req.body;
  const c = convidados.get(nomeFamilia);
  if (!c) return res.status(404).send("Convidado não encontrado.");
  if (c.presente) return res.send(`${c.nome} ${c.familia} já registrado como presente.`);
  c.presente = true;
  res.send(`✅ Presença registrada: ${c.nome} ${c.familia}`);
});

// 📋 Retorna lista
app.get("/lista", (req, res) => {
  const lista = [];
  convidados.forEach((c, key) => lista.push({ nomeFamilia: key, ...c }));
  res.json(lista);
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
