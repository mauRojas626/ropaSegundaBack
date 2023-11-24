const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');
const email = require("../config/correo");

const GetUser = async (req, res) => {
    try {
        let idUser = req.params.id;
        let [user, _] = await Usuario.findById(idUser);
        res.status(200).json({user});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const CreateUser = async (req, res, next) => {
    try{
        let user = req.body
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.clave, salt, async function(err, hash) {
                user = new Usuario(user.nombre, user.apellido, user.correo, hash);
                [user, _] = await user.save();
                
            });
        });
        res.json({ response: user.insertId, status: 200 })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const EditUser = async (req, res, next) => {
    try{
        let {id, nombre, apellido, correo, clave, telefono, bloqueado, reportado} = req.body
        let user = new Usuario(nombre, apellido, correo, clave, telefono, bloqueado, reportado);
        const newuser = await user.edit(id);
        res.status(200).json(newuser)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const GetAllUsers = async (req, res, next) => {
    try {
        const [users, _] = await Usuario.findAll();
        res.status(200).json({users});
    } catch (error){
        console.log(error)
        next(error)
    }
};

 

module.exports = { GetUser, GetAllUsers, CreateUser, EditUser };