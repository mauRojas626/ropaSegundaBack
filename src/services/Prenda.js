const Prenda = require("../models/Prenda");
const Foto = require("../models/Foto");
const Medida = require("../models/Medida");
const Consulta = require("../models/Consulta");
const Vendedor = require("../models/Vendedor");
const Comentario = require("../models/Comentario");
const s3 = require("../config/s3");

        
const getPrenda = async (clothes) =>  {
        const ropa = await Promise.all(clothes.map(async (prenda) => {
            let [photos, _] = await Foto.findById(prenda.idPrenda)
            let [medida, x] = await Medida.findById(prenda.idMedida)
            medida = medida[0]
            let [consulta, y] = await Consulta.findById(prenda.idPrenda)
            let [vendedor, z] = await Vendedor.findById(prenda.idVendedor)
            vendedor = vendedor[0]
            let [comentarios, w] = await Comentario.findById(vendedor.idUsuario)
            vendedor.comentarios = comentarios
            prenda.idConsulta = consulta
            prenda.idVendedor = vendedor
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
        return ropa ;
    }

module.exports = {getPrenda};
