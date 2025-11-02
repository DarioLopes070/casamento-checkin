import mongoose from "mongoose";

const convidadoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  familia: { type: String, required: true },
  presente: { type: Boolean, default: false },
});

export const Convidado = mongoose.model("Convidado", convidadoSchema);
