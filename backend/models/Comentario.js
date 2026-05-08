const mongoose = require("mongoose")

const ComentarioSchema = new mongoose.Schema({

  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  },

  nome: String,

  foto: {
    type: String,
    default: ""
  },

  comentario: String,

  nota: Number,

  data: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Comentario", ComentarioSchema)