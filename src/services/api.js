import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
});

// 🔥 ENVIA USER AUTOMATICO
api.interceptors.request.use(config => {

const usuario = JSON.parse(sessionStorage.getItem("usuario"))

if(usuario){
config.headers.userid = usuario._id
}

return config
})

export default api;
