import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI não definido nas variáveis de ambiente");

  // await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoose.connect(uri);

  console.log("✅ Conectado ao MongoDB Atlas");
}