const db = require("../config/db")
class Queja {
    constructor(queja) {
        this.id = queja.id
        this.tipo = queja.tipo
        this.fecha = queja.fecha
        this.idUsuario = queja.idUsuario
        this.comentario = queja.comentario
        this.evidencia = queja.evidencia
    }

    async save(){
        let sql = `INSERT INTO Queja(tipo, fecha, idUsuario, comentario, evidencia) VALUES( ?, CURDATE(), ?, ?, ?);`
        const res = await db.query(sql, [this.tipo, this.idUsuario, this.comentario, this.evidencia])
        return res;
    }

    static delete(id) {
        let sql = `DELETE FROM Queja WHERE idQueja = ?;`
        return db.query(sql, [id])
    }

    static findById(id) {
        let sql = "Select * from Queja where idQueja = ?;"
        const res = db.query(sql, [id]);
        return res
    }
}

module.exports = Queja