const db = require("../config/db")

class DetalleVenta {
    constructor(id, idPrenda, idVenta) {
        this.id = id
        this.idPrenda = idPrenda
        this.idVenta = idVenta
    }

    async save(){
        let sql = `INSERT INTO DetalleVenta (idPrenda, idVenta) VALUES( ?, ?);`
        const res = await db.query(sql, [this.idPrenda, this.idVenta])
        return res;
    }

    async edit(id) {
        let sql = `UPDATE DetalleVenta SET idPrenda = ?, idVenta = ? WHERE (idDetalleVenta = ?);`
        const res = await db.query(sql, [ this.idPrenda, this.idVenta, id])
        return res;
    }

    static findAll() {
        let sql = "SELECT * FROM DetalleVenta;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM DetalleVenta WHERE idVenta = ?;`
        return db.query(sql, [id])
    }

}

module.exports = DetalleVenta