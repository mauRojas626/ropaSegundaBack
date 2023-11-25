const Prenda = require("../models/Prenda");
const DetalleVenta = require("../models/DetalleVenta");
const Venta = require("../models/Venta");
const Foto = require("../models/Foto");
const Medida = require("../models/Medida");
const Envio = require("../models/Envio");
const s3 = require("../config/s3");
const Usuario = require("../models/Usuario");
const Provincia = require("../models/Provincia");
const Comprador = require("../models/Comprador");
const Queja = require("../models/Queja");
const Vendedor = require("../models/Vendedor");

const GetVenta = async (req, res) => {
    try {
        let idVenta = req.params.id;
        let [venta, _] = await Prenda.findById(idVenta);
        let respuesta = new Venta(venta[0])
        res.status(200).json({respuesta});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const CreateVenta = async (req, res, next) => {
    try{
        let venta = JSON.parse(req.body.venta)
        let fotos = req.files.files
        await s3.uploadFile(fotos, fotos.name)
        let sell = new Venta(venta);
        sell.comprobanteCliente = fotos.name
        let [id, _] = await sell.save();
        id = id.insertId
        let detalle = new DetalleVenta(0, venta.idPrenda, id)
        await detalle.save();
        console.log(venta.idVendedor)
        let [vendedor, v] = await Vendedor.findById(venta.idVendedor)
        vendedor = vendedor[0]
        await email.sendEmail(vendedor.correo)
        await Prenda.updateComprado(venta.idPrenda)
        res.json({ status: 200, response: venta.idVenta })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const EditVenta = async (req, res, next) => {
    try{
        let venta = req.body
        let sell = new Venta(venta)
        venta = sell.edit(venta.idVenta)
        
        res.status(200).json(venta)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const ValidatePago = async (req, res, next) => {
    try{
        let venta = JSON.parse(req.body.venta)
        let fotos = req.files.files
        await s3.uploadFile(fotos, fotos.name)
        let sell = new Venta(venta)
        sell.comprobantePago = fotos.name
        venta = await sell.validate(sell.id)
        res.status(200).json(venta)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const ValidarPago2 = async (req, res, next) => {
    try{
        let venta = req.body
        await Venta.validateEnvio(venta.idEnvio.idEnvio)
        res.status(200).json(venta)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const CotizarEnvio = async (req, res, next) => {
    try{
        let venta = req.body
        venta.idEnvio.idProvincia = venta.idEnvio.idProvincia.idProvincia
        let envio = new Envio(venta.idEnvio)
        envio.idEnvio = venta.idEnvio.idEnvio
        await envio.edit(envio.idEnvio)
        await Venta.cotizarEnvio(envio.idEnvio)
        res.status(200).json(envio)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const payEnvio = async (req, res, next) => {
    try{
        let venta = JSON.parse(req.body.venta)
        let fotos = req.files.files
        await s3.uploadFile(fotos, fotos.name)
        await Envio.editEnvio(venta[0].idEnvio.idEnvio, fotos.name)
        await Venta.payEnvio(venta[0].idEnvio.idEnvio)
        res.json({ response: venta.idEnvio, status: 200 })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const CreateEnvio = async (req, res, next) => {
    try{
        let envio = req.body
        let ship = new Envio(envio)
        ship = await ship.save()
        ship = ship[0]
        envio.ventas.forEach(element => {
            Venta.updateEnvio(element, ship.insertId)
        });
        res.status(200).json({response: ship, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const GetAllQuejas = async (req, res, next) => {
    try {
        let [sell, _] = await Venta.findByEstado(8)
        const ventas = await Promise.all(sell.map(async (venta) => {
            let [detalle, _] = await DetalleVenta.findById(venta.idVenta)
            detalle = detalle[0]
            if(venta.comprobantePago != null){
                let url = await s3.getPhoto(venta.comprobantePago)
                venta.comprobantePago = url
            }
            if(venta.comprobanteCliente != null){
                let url = await s3.getPhoto(venta.comprobanteCliente)
                venta.comprobanteCliente = url
            }
            let [vendedor, z] = await Vendedor.findById(venta.idVendedor)
            vendedor = vendedor[0]
            let envio = null
            let [queja, w] = await Queja.findById(venta.idQueja)
            queja = queja[0]
            if(queja.evidencia != null){
                let url = await s3.getPhoto(queja.evidencia)
                queja.evidencia = url
            }

            let [comprador, y] = await Comprador.findById(venta.idComprador)
            comprador = comprador[0]
            if(venta.idEnvio != null){
                [envio, _] = await Envio.findById(venta.idEnvio)
                envio = envio[0]
                if(envio.comprobanteCliente != null){
                    let url = await s3.getPhoto(envio.comprobanteCliente)
                    envio.comprobanteCliente = url
                }
                let [provincia, x] = await Provincia.findById(envio.idProvincia)
                envio.idProvincia = provincia[0]
                
            } 
            let [clothes, x] = await Prenda.findById(detalle.idPrenda)
            const ropa = await Promise.all(clothes.map(async (prenda) => {
                let [photos, _] = await Foto.findById(prenda.idPrenda)
                let [medida, x] = await Medida.findById(prenda.idMedida)
                let fotos = await Promise.all(photos.map(async (foto) =>{
                    let url = await s3.getPhoto(foto.nombre)
                    return {
                        ...foto,
                        url: url
                    }
                }))
                return{
                    ...prenda,
                    fotos:fotos,
                    idMedida: medida
                }
            }));
            return{
                ...venta,
                prenda: ropa,
                idEnvio: envio,
                idVendedor: vendedor,
                idComprador: comprador,
                idQueja: queja
            }
        }))

        res.json({response: ventas, status: 200});
    } catch (error){
        console.log(error)
        next(error)
    }
}


const GetAllVentas = async (req, res, next) => {
    try {
        let [sell, _] = await Venta.findByIdComprador(req.params.id)
        const ventas = await Promise.all(sell.map(async (venta) => {
            let [detalle, _] = await DetalleVenta.findById(venta.idVenta)
            detalle = detalle[0]
            if(venta.comprobantePago != null){
                let url = await s3.getPhoto(venta.comprobantePago)
                venta.comprobantePago = url
            }
            if(venta.comprobanteCliente != null){
                let url = await s3.getPhoto(venta.comprobanteCliente)
                venta.comprobanteCliente = url
            }
            let [vendedor, z] = await Usuario.findById(venta.idVendedor)
            vendedor = vendedor[0]
            let envio = null

            let [comprador, y] = await Comprador.findById(venta.idComprador)
            comprador = comprador[0]
            if(venta.idEnvio != null){
                [envio, _] = await Envio.findById(venta.idEnvio)
                envio = envio[0]
                if(envio.comprobanteCliente != null){
                    let url = await s3.getPhoto(envio.comprobanteCliente)
                    envio.comprobanteCliente = url
                }
                let [provincia, x] = await Provincia.findById(envio.idProvincia)
                envio.idProvincia = provincia[0]
                
            } 
            let [clothes, x] = await Prenda.findById(detalle.idPrenda)
            const ropa = await Promise.all(clothes.map(async (prenda) => {
                let [photos, _] = await Foto.findById(prenda.idPrenda)
                let [medida, x] = await Medida.findById(prenda.idMedida)
                let fotos = await Promise.all(photos.map(async (foto) =>{
                    let url = await s3.getPhoto(foto.nombre)
                    return {
                        ...foto,
                        url: url
                    }
                }))
                return{
                    ...prenda,
                    fotos:fotos,
                    idMedida: medida
                }
            }));
            return{
                ...venta,
                prenda: ropa,
                idEnvio: envio,
                idVendedor: vendedor,
                idComprador: comprador
            }
        }))

        res.json({response: ventas, status: 200});
    } catch (error){
        console.log(error)
        next(error)
    }
}

const Enviar = async (req, res, next) => {
    try{
        let venta = req.body
        let envio = venta.idEnvio
        const formattedDate = `${envio.fechaEntrega} 00:00:00`;
        await Envio.enviar(envio.idEnvio, formattedDate, envio.direccion) 
        await Venta.enviar(envio.idEnvio)
        res.json({response: envio, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const CalificarVendedor = async (req, res, next) => {
    try{
        let venta = req.body
        await Venta.calificarVendedor(venta.idEnvio, venta.idVendedor.idUsuario, venta.comentario, venta.calificacion)
        res.status(200).json({response: venta, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const resolverQueja = async (req, res, next) => {
    try{
        let idQueja = req.params.id
        await Venta.resolverQueja(idQueja)
        res.status(200).json({response: idQueja, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = { GetVenta, GetAllVentas, CreateVenta, EditVenta, ValidatePago, CreateEnvio, CotizarEnvio, 
    payEnvio, ValidarPago2, Enviar, CalificarVendedor, GetAllQuejas, resolverQueja };