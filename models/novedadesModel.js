const mongoose = require("../bin/mongodb")

mongoose.Number.cast(v => {
    if (typeof(v)==='string'){
      return (v.includes(",") ? parseFloat(v.replace(/,/g, '')) : Number(v))
    }else{
      return (Number(v))
    }
    
  });

//creación schema
const novedadesSchema = mongoose.Schema({
    Orden: {
      type: String,
      default: "-"
      //required: [true, errorMessage.GENERAL.campo_obligatorio],
      //minlength: [8, errorMessage.GENERAL.min_length],
    },
    Ubicac_tecnica: {
      type: String,
      default: null,
    },
    Punto_de_medida: {
      type: String,
      default: null,
    },
    Documento_med: {
      type: String,
      default: null,
    },
    Equipo: {
      type: String,
      default: null,
    },
    Denominacion: {
      type: String,
      default: null,
    },
    Posicion_medida: {
      type: String,
      default: null,
    },
    Fecha: {
      type: String,
      default: null,
    },
    Grupo_codigos: {
      type: String,
      default: null,
    },
    Codigo_valorac: {
      type: String,
      default: null,
    },
    Codif_txt_cod: {
      type: String,
      default: null,
    },
    Texto: {
      type: String,
      default: null,
    },
    Valor_medido: {
      type: Number,
      /* default: function (){
      return(this.Valor_medido? parseFloat(this.Valor_medido?.replace(/,/g, '')):0)
      } */
    },
    Codigo_Interno: {
      type: String,
      default: function () {
        let codigo_interno = this.Equipo ? this.Equipo.split("-", 2)[1] : null
        return codigo_interno;
      },
    },
    Fecha_Mes: {
      type: Number,
      default: function () {
        return Number(this.Fecha.split("/")[0]);
      },
    },
    Fecha_Año: {
      type: Number,
      default: function () {
        return Number(this.Fecha.split("/")[2]);
      },
    },
    Piquete: {
      type: String,
      default: function () {
  
        return (this.Equipo.includes("Piquete") ? Number(this.Equipo.split("-")[3].slice(1, 5)) : undefined);
      },
    },
  });

//creación model
module.exports = mongoose.model("novedades", novedadesSchema)