const db = require("../config/db")
class Comentario {
    constructor(comentario) {
        this.id = comentario.id
        this.texto = comentario.texto
        this.calificacion = comentario.calificacion
        this.utilidad = comentario.utilidad
        this.fecha = comentario.fecha
        this.idVendedor = comentario.idVendedor
    }

    async save(){
        let sql = `INSERT INTO Comentario(texto, calificacion, utilidad, fecha, idVendedor) VALUES( ?, ?, ?, CURDATE(), ?);`
        const res = await db.query(sql, [this.texto, this.calificacion, this.utilidad, this.idVendedor])
        return res;
    }

    async edit(id){
        let sql = `UPDATE Comentario SET texto = ?, calificacion = ?, utilidad = ?, fecha = ?, idVendedor = ? WHERE(idComentario = ?);`
        const res = await db.query(sql, [this.texto, this.calificacion, this.utilidad, this.fecha, this.idVendedor, id])
        return res;
    }

    static findById(id) {
        let sql = `SELECT * FROM Comentario WHERE idVendedor = ?;`
        return db.query(sql, [id])
    }
}

module.exports = Comentario