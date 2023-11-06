const db = require("../config/db")
class Provincia {
    constructor(provincia) {
        this.id = provincia.id
        this.idDepartamento = provincia.idDepartamento
        this.nombre = provincia.nombre
    }

    static findAll() {
        let sql = `SELECT * FROM Provincia;`
        return db.query(sql)
    }

    static findById(id) {
        let sql = `SELECT a.*, b.nombre as departamento FROM Provincia a inner join Departamento b on a.idDepartamento = b.idDepartamento WHERE a.idProvincia = ?;`
        return db.query(sql, [id])
    }
}

module.exports = Provincia