const db = require("../config/db")

class Foto {
    constructor(id, nombre, idPrenda) {
        this.id = id
        this.nombre = nombre
        this.idPrenda = idPrenda
    }

    async save(){
        let sql = `INSERT INTO Foto(nombre, idPrenda) VALUES( ?, ?);`
        const res = await db.query(sql, [this.nombre, this.idPrenda])
        return res;
    }

    async edit(id){
        let sql = `UPDATE Foto SET nombre = ?, idPrenda = ? WHERE(idFoto = ?);`
        const res = await db.query(sql, [this.nombre, this.idPrenda, id])
        return res;
    }

    static findAll() {
        let sql = "SELECT * FROM Prenda;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Foto WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static delete(id) {
        let sql = `DELETE FROM Foto WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static deleteByName(name) {
        let sql = `DELETE FROM Foto WHERE nombre = ?;`
        return db.query(sql, [name])
    }
    

}

module.exports = Foto