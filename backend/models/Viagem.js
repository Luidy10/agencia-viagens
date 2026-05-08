const mongoose = require("mongoose");

const ViagemSchema = new mongoose.Schema({
  nome: String,
  email: String,
  destino: String,
  dataIda: String,
  dataVolta: String,
  pessoas: Number,

  // 🔥 NOVO
  assentos: [
    {
      numero: String,
      tipo: String,
      precoExtra: Number
    }
  ],

  horarioIda: String,
  horarioVolta: String,

  precoTotal: Number,

  status: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Viagem", ViagemSchema);