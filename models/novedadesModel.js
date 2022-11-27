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
    orden: {
      type: String,
      default: "-"
    },
    ubicac_tecnica: {
      type: String,
      default: null,
    },
    fecha: {
      type: Date,
      default: null,
    },
    punto_de_medida: {
      type: String,
      default: null,
    },
    documento_med: {
      type: String,
      default: null,
    },
    equipo: {
      type: String,
      default: null,
    },
    posicion_medida: {
      type: String,
      default: null,
    },
    denominacion: {
      type: String,
      default: null,
    },
    grupo_codigos: {
      type: String,
      default: null,
    },
    codigo_valorac: {
      type: String,
      default: null,
    },
    codif_txt_cod: {
      type: String,
      default: null,
    },
    valor_medido: {
      type: Number,
      /* default: function (){
      return(this.Valor_medido? parseFloat(this.Valor_medido?.replace(/,/g, '')):0)
      } */
    },    
    unidad_caracterist: {
      type: String,
      /* default: function (){
      return(this.Valor_medido? parseFloat(this.Valor_medido?.replace(/,/g, '')):0)
      } */
    },
    codigo_interno:{
      type: String,
      default: function (){
      return(this.equipo? this.equipo.split("-")[1]:"")
      } 

    }
   
  });

//creación model
module.exports = mongoose.model("novedades", novedadesSchema)