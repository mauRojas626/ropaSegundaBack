const Consulta = require("../models/Consulta")

const CreateConsulta = async (req, res, next) => {
    try{
        let consulta = req.body
        let question = new Consulta(consulta)
        consulta = await question.save()

        res.json({response: consulta.insertId, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const EditConsulta = async (req, res, next) => {
    try{
        let consulta = req.body
        let question = new Consulta(consulta)
        consulta = await question.edit(consulta.idConsulta)

        res.json({response: consulta, status: 200})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = { CreateConsulta, EditConsulta }