const Usuario = require("../models/Usuario");
const Comprador = require("../models/Comprador");
const bcrypt = require('bcrypt');
const Medida = require("../models/Medida");
const Vendedor = require("../models/Vendedor");
const s3 = require("../config/s3");
const Consulta = require("../models/Consulta");
const email = require("../config/correo");
const Foto = require("../models/Foto");
const Venta = require("../models/Venta");
const Queja = require("../models/Queja");
const Prenda = require("../models/Prenda");

const GetComprador = async (req, res) => {
    try {
        let idUser = req.params.id;
        let [comprador, _] = await Comprador.findById(idUser);
        let respuesta = new Comprador(comprador[0])
        res.status(200).json({respuesta});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const CreateComprador = async (req, res, next) => {
    try{
        let comprador = req.body
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(comprador.clave, salt);
        user = new Usuario(comprador.nombre, comprador.apellido, comprador.correo, hash, null, 0, 0);
        let [newUser, _] = await user.save();
        comprador.idUsuario = newUser.insertId
        let buyer = new Comprador(comprador)
        comprador = await buyer.save(newUser.insertId);
        res.json({response: newUser.insertId, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const EditComprador = async (req, res, next) => {
    try{
        let usuario = JSON.parse(req.body.user)
        let comprador = new Comprador(usuario)
        let buyer = await Comprador.findById(usuario.idUsuario)
        comprador.idProvincia = usuario.idProvincia
        
        if(usuario.idMedida != 0){
            let medida = new Medida(usuario.idMedida)
            if(usuario.idMedida.idMedida != undefined){
                medida = await medida.edit(usuario.idMedida)
            } else{
                medida = await medida.save()
            }   
            comprador.idMedida = medida[0].insertId
        }
        else{
            comprador.idMedida = null
        }
        if(usuario.idVendedor != 0){
            if(req.files != undefined){
                if(req.files.yape){
                    await s3.uploadFile(req.files.yape, "a" + req.files.yape.name)
                    usuario.idVendedor.qrYape = "a" + req.files.yape.name
                }
                    
                if(req.files.plin){
                    await s3.uploadFile(req.files.plin, req.files.plin.name)
                    usuario.idVendedor.qrPlin = req.files.plin.name
                }
            }
            let seller = await Vendedor.findByIdVendedor(usuario.idUsuario)
            seller = seller[0]
            let vendedor = new Vendedor(usuario.idVendedor)
            if(seller == undefined || seller.length == 0){
                vendedor = await vendedor.save(usuario.idUsuario)
            }
            else{
                if(seller.RUC != usuario.idVendedor.ruc){
                    vendedor.aprobado = 0
                }
                vendedor = await Vendedor.edit(usuario.idUsuario)
            }
        }   
        buyer = buyer[0]
        if(buyer == undefined){
            comprador = await comprador.save(usuario.idUsuario)
        }
        else{
            comprador = await comprador.edit(usuario.idUsuario)
        }
        
        res.status(200).json({response: comprador, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const GetAllCompradores = async (req, res, next) => {
    try {
        const [users, _] = await Comprador.findAll();
        const usuarios = await Promise.all(users.map(async (user) => {
            let [vendedor, z] = await Vendedor.findByIdVendedor(user.idUsuario)
            vendedor = vendedor[0]
            return {
                ...user,
                idVendedor: vendedor
            }
        }))
        res.status(200).json({response: usuarios, status: 200});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const ValidateUser = async (req, res, next) => {
    try{
        let user = req.body
        let [usuario, _] = await Usuario.findByCorreo(user.correo)
        if(usuario.length == 0){
            res.status(200).json({response: "Usuario no encontrado", status: 404})
        } else{
            if(bcrypt.compareSync(user.clave, usuario[0].clave)){
                let [comprador, _] = await Comprador.findById(usuario[0].idUsuario)
                comprador = comprador[0]
                if(comprador.bloqueado == 1){
                    res.status(200).json({response: "Usuario bloqueado", status: 504})
                }
                else{
                    if(comprador.idMedida == null){
                        comprador.idMedida = 0
                    } else {
                        let [medida, _] = await Medida.findById(comprador.idMedida)
                        comprador.idMedida = medida[0]
                    }

                    let vendedor = await Vendedor.findByIdVendedor(comprador.idUsuario)
                    vendedor = vendedor[0]
                    if(vendedor != undefined && vendedor.length != 0){
                        comprador.idVendedor = vendedor[0]
                        let [consulta, _] = await Consulta.findByIdVendedor(comprador.idUsuario)
                        if(consulta){
                            let consultas = await Promise.all(consulta.map(async (element) => {
                                element.foto = await s3.getPhoto(element.foto)
                                return element
                            }))
                            comprador.idVendedor.consultas = consultas
                        }
                    } else{
                        comprador.idVendedor = 0
                    }
                }
                res.status(200).json({response: comprador, status: 200})
            } else{
                res.status(200).json({response: "Contraseña incorrecta", status: 404})
            }
        }
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const ValidateRuc = async (req, res, next) => {
    try{
        let user = req.body
        if(user.idVendedor.aprobado === 1) {
            await Comprador.validateRuc(1, user.idUsuario)
            await email.sendEmail(user.correo, 2)
        }
        else{
            await Comprador.validateRuc(2, user.idUsuario)
            await email.sendEmail(user.correo, 1)
        } 
        res.status(200).json({response: "Usuario validado", status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const Bloquear = async (req, res, next) => {
    try {
        let user = req.body
        let clothes = await Prenda.findByIdVendedor(user.idUsuario)
        clothes = clothes[0]
        for(const cloth of clothes){
            await Foto.delete(cloth.idPrenda)
        }
        await Prenda.deleteByVendedor(user.idUsuario)
        await Comprador.bloquear(user.idUsuario)
        res.status(200).json({response: user, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const Reportar = async (req, res, next) => {
    try {
        let venta = JSON.parse(req.body.venta)
        let user = null
        let queja = new Queja(venta.queja)
        let fotos = req.files.files
        await s3.uploadFile(fotos, fotos.name)
        queja.evidencia = fotos.name
        let idQueja = await queja.save()
        idQueja = idQueja[0].insertId
        if(venta.estado === 0 || venta.estado === 4){
            user = venta.idComprador
        } else user = venta.idVendedor
        await Comprador.reportar(user.idUsuario, user.reportado + 1)
        if(venta.estado === 0) await Venta.block(venta.idVenta, idQueja)
        else {
            let ventas = await Venta.findByIdEnvio(venta.idEnvio.idEnvio)
            for(const element of ventas){
                await Venta.block(element.idVenta, idQueja)
            }
        }
        //email.sendEmail(user.correo, 3)
        res.status(200).json({response: "Usuario reportado", status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = { GetComprador, GetAllCompradores, CreateComprador, EditComprador, ValidateUser, ValidateRuc, Bloquear, Reportar };