const Provincia = require("../models/Provincia");
const Departamento = require("../models/Departamento");

const GetAllCities = async (req, res, next) => {
    try {
        const [cities, _] = await Provincia.findAll();
        const [department, x] = await Departamento.findAll();

        res.status(200).json({response: {provincia: cities, departamento: department}, status: 200});
    } catch (error){
        console.log(error)
        next(error)
    }
};

module.exports = { GetAllCities };