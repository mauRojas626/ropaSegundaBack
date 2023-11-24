const Prenda = require("../models/Prenda");
const Foto = require("../models/Foto");
const Medida = require("../models/Medida");
const s3 = require("../config/s3");
const { getPrenda } = require("../services/Prenda");

const GetPrenda = async (req, res) => {
    try {
        let idPrenda = req.params.id;
        let [prenda, _] = await Prenda.findById(idPrenda);
        let respuesta = new Comprador(prenda[0])
        res.status(200).json({respuesta});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const CreatePrenda = async (req, res, next) => {
    try{
        let prenda = JSON.parse(req.body.clothes)
        let clothes = new Prenda(prenda);
        let medida = new Medida(prenda.idMedida)
        medida = await medida.save();
        clothes.idMedida = medida[0].insertId;
        let [clothes1, _] = await clothes.save();
        prenda.idPrenda = clothes1.insertId
        let fotos = req.files.files
        if(fotos[0] != undefined){
            fotos.map((foto, index) => {
                s3.uploadFile(foto, foto.name)
                let photo = new Foto(0, foto.name, prenda.idPrenda)
                photo.save()
            })
        }
        else{
            s3.uploadFile(fotos, fotos.name)
            let photo = new Foto(0, fotos.name, prenda.idPrenda)
            photo.save()
        }
        
        res.json({ status: 200, response: prenda.idPrenda })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const EditPrenda = async (req, res, next) => {
    try{
        let prenda = JSON.parse(req.body.clothes)
        let clothes = new Prenda(prenda);
        let medida = new Medida(prenda.idMedida)    
        medida = await medida.edit(prenda.idMedida.idMedida);
        clothes = await clothes.edit(prenda.idPrenda)
        if(req.files){
            let fotos = req.files.files
            if(fotos[0] != undefined){
                fotos.map((foto, index) => {
                    s3.uploadFile(foto, foto.name)
                    let photo = new Foto(0, foto.name, prenda.idPrenda)
                   
                    photo.save()
                })
            }
            else{
                s3.uploadFile(fotos, fotos.name)
                let photo = new Foto(0, fotos.name, prenda.idPrenda)
                photo.save()
            }
        }
        if(prenda.deletedFiles){
            prenda.deletedFiles.map(async (foto) => {
                //await s3.deletePhoto(foto)
                await Foto.deleteByName(foto)
            })
        }
        
        
        res.json({response: clothes, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const GetAllPrendas = async (req, res, next) => {
    try {
        let [clothes, _] = await Prenda.findAll();
        const ropa = await getPrenda(clothes);
        res.json({response: ropa, status: 200});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const DeletePrenda = async (req, res, next) => {
    try{
        let idPrenda = req.params.id;
        let [prenda, x] = await Prenda.findById(idPrenda);
        prenda = prenda[0]
        let [fotos, _] = await Foto.findById(idPrenda);
        fotos.map(async (foto) => {
            await s3.deletePhoto(foto.nombre)
        })
        await Foto.delete(idPrenda)
        await Prenda.delete(idPrenda)
        await Medida.delete(prenda.idMedida)
        
        res.status(200).json({response: "Prenda eliminada", status: 200});
    }catch(error){
        console.log(error)
        next(error)
    }
}

const blockPrenda = async (req, res, next) => {
    try{
        let idPrenda = req.params.id;
        let [prenda, x] = await Prenda.findById(idPrenda);
        prenda = prenda[0]
        if(prenda.comprado == 1){
            res.status(200).json({response: "Prenda ya fue comprada", status: 220});
        } else {
            await Prenda.updateComprado(idPrenda)
            res.status(200).json({response: "Prenda bloqueada", status: 200});
        }
    }catch(error){
        console.log(error)
        next(error)
    }
}

const unBlockPrenda = async (req, res, next) => {
    try{
        let idPrenda = req.params.id
        await Prenda.updateAbandonado(idPrenda)
        res.status(200).json({response: "Prenda bloqueada", status: 200});
    }catch(error){
        console.log(error)
        next(error)
    }
}

module.exports = { GetPrenda, GetAllPrendas, CreatePrenda, EditPrenda, DeletePrenda, blockPrenda, unBlockPrenda };