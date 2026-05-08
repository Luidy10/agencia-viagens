const mongoose = require("mongoose");

const DestinoSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  preco: Number,
  imagem: String,
  aeroporto: String,

  // 🆕 NOVOS CAMPOS
  hotelIncluso: {
    type: Boolean,
    default: false
  },
  
  cafeDaManhaIncluso: {
    type: Boolean,
    default: false
  },
  
  itensInclusos: {
    type: [String],
    default: []
  },
  
  duracaoDias: {
    type: Number,
    default: 1
  },
  
  categoria: {
    type: String,
    enum: ["nacional", "internacional", "praia", "montanha", "cidade", "aventura", "romantico"],
    default: "nacional"
  },
  
  avaliacao: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Destino", DestinoSchema);