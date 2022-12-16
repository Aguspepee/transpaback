const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
const bcrypt = require("bcrypt")

//USERS schema
const usersShema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    apellido: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [3, errorMessage.GENERAL.min_length]
    },
    email: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        unique: true
    },
    numero_orden: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "Inspector",
        enum: ["Administrador", "Supervisor", "Inspector", "Asistente"],
        required: [true, errorMessage.GENERAL.campo_obligatorio],
    },
    area: {
        type: String,
        default: "Inspección",
    },
    password: {
        type: String,
        required: [true, errorMessage.GENERAL.campo_obligatorio],
        minlength: [6, errorMessage.GENERAL.min_length]
    },
    active: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleted_permanent: {
        type: Boolean,
        default: false
    },
    policy: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    hidden: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
    },
    search:{
        type: mongoose.Schema.Types.Mixed,
        default:{}
    }
})
//creación model
usersShema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})
module.exports = mongoose.model("users", usersShema)