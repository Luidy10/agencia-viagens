const mongoose = require("mongoose")

const UsuarioSchema = new mongoose.Schema({

nome:String,

email:String,

senha:String,

admin:{
type:Boolean,
default:false
},

foto:{
type:String,
default:""
}

})

module.exports = mongoose.model("Usuario",UsuarioSchema)