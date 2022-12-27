const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");
const indisponibilidadesColumns = require("../util/columns/indisponibilidades");

module.exports = {
    getAll: async function (req, res, next) {
        try {
            const documents = await usersModel.find()
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getSearch: async function (req, res, next) {
        console.log("search")
        try {
            const documents = await usersModel.aggregate([
                { $match: { deleted: false } },
                {
                    $addFields: {
                        nombre_completo: { $concat: ["$nombre", " ", "$apellido"] }

                    }
                },
                {
                    $match: {
                        $and: [
                            { "nombre_completo": { $regex: req.query["nombre"] || "", $options: "i" } },
                            { deleted: false }
                        ]
                    }
                }
            ])
            res.json(documents)
            console.log()
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getNames: async function (req, res, next) {
        try {
            const documents = await usersModel.find({}, { nombre: 1, apellido: 1 })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    getOne: async function (req, res, next) {
        try {
            const documents = await usersModel.findById(req.params.id)
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    login: async function (req, res, next) {
        try {
            const user = await usersModel.findOne({ email: req.body.email })
            if (!user) {
                return res.json({ error: true, message: "Email incorrecto" })
            }
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ userId: user._id }, req.app.get("secretKey"), { expiresIn: "10h" })
                return res.json({ error: false, message: "Se inició sesión", token: token, user: user })
            } else {
                return res.json({ error: true, message: "Contraseña incorrecta" })
            }
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    register: async function (req, res, next) {
        //console.log(req.file)
        try {
            const user = new usersModel({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                area: req.body.area,
                numero_orden: req.body.numero_orden,
                active: req.body.active,
                deleted: req.body.deleted,
                policy: req.body.policy,
                parteColumns: parteColumns.parteColumns,
                remitoColumns: remitoColumns.remitoColumns,
                certificadoColumns: certificadoColumns.certificadoColumns
            })
            const document = await user.save()
            console.log("se creó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    whoami: async function (req, res, next) {
        let id
        let exp
        let token = req.headers.authorization.split(" ")[1]
        console.log("token", token)
        jwt.verify(token, CONFIG.SECRET_KEY, function (error, decoded) {
            if (error) {
                res.status(500).json({ message: error.message })
                console.log("el token no era válido")
            } else {
                console.log("lo decodificó", decoded)
                exp = decoded.exp
                id = decoded.userId
                console.log("La ID es", id)
            }
        })
        try {
            const user = await usersModel.find({ _id: id })
            res.json({ exp: exp, ...user })
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    edit: async function (req, res, next) {
        //console.log(req.params.id)
        try {
            const user = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                area: req.body.area,
                role: req.body.role,
                numero_orden: req.body.numero_orden,
                active: req.body.active,
                deleted: req.body.deleted,
                indisponibilidadesColumns: req.body.indisponibilidadesColumns,
                password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined,
                search: req.body.search,
            }
            const document = await usersModel.findByIdAndUpdate(req.params.id, user, { new: true })
            //console.log("se actualizó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },


    update: async function (req, res, next) {
        //console.log(req.params.id)
        try {
            const user = {
                indisponibilidadesColumns: indisponibilidadesColumns.indisponibilidadesColumns,
                delete_permanent: false,
                search: {},
            }
            const document = await usersModel.updateMany({}, user)
            console.log("se actualizó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    delete: async function (req, res, next) {
        try {
            const documents = await usersModel.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true })
            res.json(documents)
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },

    image: async function (req, res, next) {
        console.log("entro")
        console.log(req.params.id)
        console.log(req.file)
        try {
            const contract = {
                image: req.file.path
            }
            const document = await usersModel.findByIdAndUpdate(req.params.id, contract, { new: true })
            console.log("se actualizó", document)
            res.status(201).json(document);
        } catch (e) {
            console.log(e)
            e.status = 400
            next(e)
        }
    },
}
