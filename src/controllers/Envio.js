const Prenda = require("../models/Prenda");
const DetalleVenta = require("../models/DetalleVenta");
const Venta = require("../models/Venta");
const Foto = require("../models/Foto");
const Medida = require("../models/Medida");
const Envio = require("../models/Envio");
const s3 = require("../config/s3");
const Usuario = require("../models/Usuario");

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
        await s3.uploadFile(fotos.data, fotos.name)
        let sell = new Venta(venta)
        sell.comprobantePago = fotos.name
        venta = await sell.validate(sell.id)
        res.status(200).json(venta)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const GetAllEnvios = async (req, res, next) => {
    try {
        let [envios, x] = await Envio.findById(req.params.id);

        let [sell, _] = await Venta.findByIdComprador(req.params.id);
        const ventas = await Promise.all(sell.map(async (venta) => {
            let [detalle, _] = await DetalleVenta.findById(venta.idVenta)
            detalle = detalle[0]
            let [vendedor, z] = await Usuario.findById(venta.idVendedor)
            vendedor = vendedor[0]
            let envio = null
            if(venta.idEnvio != null){
                [envio, _] = await Envio.findById(venta.idEnvio)
                envio = envio[0]
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
                idVendedor: vendedor
            }
        }))

        res.json({response: ventas, status: 200});
    } catch (error){
        console.log(error)
        next(error)
    }
};

module.exports = { GetVenta, GetAllEnvios, CreateVenta, EditVenta, ValidatePago, CreateEnvio };