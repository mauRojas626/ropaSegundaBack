const Usuario = require("../models/Usuario");
const Comprador = require("../models/Comprador");
const Vendedor = require("../models/Vendedor");

const GetVendedor = async (req, res) => {
    try {
        let idUser = req.params.id;
        let [user, _] = await Vendedor.findById(idUser);
        let respuesta = new Comprador(user[0])
        res.status(200).json({respuesta});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const CreateVendedor = async (req, res, next) => {
    try{
        let vendedor = req.body
        let user = new Usuario(comprador.nombre, comprador.apellido, comprador.correo, comprador.clave, null, 0, 0);
        [user, _] = await user.save();
        vendedor.idUsuario = user.insertId
        let buyer = new Comprador(vendedor)
        [user, _] = await buyer.save(user.insertId);
        let seller = new Vendedor(vendedor)
        [user, _] = await seller.save(user.insertId)
        res.status(200).json(user.insertId)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const EditVendedor = async (req, res, next) => {
    try{
        let vendedor = req.body
        let seller = new Vendedor(vendedor)
        vendedor = seller.edit(vendedor.idUsuario)
        res.status(200).json(vendedor)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const GetAllVendedores = async (req, res, next) => {
    try {
        const [users, _] = await Vendedor.findAll();
        res.status(200).json({users});
    } catch (error){
        console.log(error)
        next(error)
    }
};

module.exports = { GetVendedor, GetAllVendedores, CreateVendedor, EditVendedor };