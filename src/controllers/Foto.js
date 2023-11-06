const s3 = require("../config/s3");

const CreateFoto = async (req, res, next) => {
    try {
        console.log(req.files.file)
        await s3.uploadFile(req.files.file, "prueba1")
        res.status(200).json({message: 'uploadFile'});
    } catch (error){
        console.log(error)
        next(error)
    }
};

const GetFoto = async (req, res, next) => {
    try {
        const url = await s3.getPhoto(req.params.filename)
        res.status(200).json({message: url});
    } catch (error){
        console.log(error)
        next(error)
    }
};

module.exports = { CreateFoto, GetFoto };