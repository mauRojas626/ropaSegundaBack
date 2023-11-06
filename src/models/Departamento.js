const db = require("../config/db")
class Departamento {
    constructor(departamento) {
        this.id = departamento.id
        this.nombre = departamento.nombre
    }

    static findAll() {
        let sql = `SELECT * FROM Departamento;`
        return db.query(sql)
    }
}

module.exports = Departamento