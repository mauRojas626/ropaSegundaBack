const db = require("../config/db")

class Medida {
    constructor(medida) {
        this.id = medida.id
        this.busto = medida.busto
        this.cadera = medida.cadera
        this.largoTotal = medida.largoTotal
        this.largoManga = medida.largoManga
        this.hombros = medida.hombros
        this.cintura = medida.cintura
    }

    async save(){
        let sql = `INSERT INTO Medida(busto, cadera, cintura, largoTotal, largoManga, hombros) VALUES( ?, ?, ?, ?, ?, ?);`
        const res = await db.query(sql, [this.busto, this.cadera, this.cintura, this.largoTotal, this.largoManga, this.hombros])
        return res;
    }

    async edit(id){
        let sql = `UPDATE Medida SET busto = ?, cadera = ?, cintura = ?, largoTotal = ?, largoManga = ?, hombros = ? WHERE(idMedida = ?);`
        const res = await db.query(sql, [this.busto, this.cadera, this.cintura, this.largoTotal, this.largoManga, this.hombros, id])
        return res;
    }

    static findAll() {
        let sql = "SELECT * FROM Medida;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Medida WHERE idMedida = ?;`
        return db.query(sql, [id])
    }

    static delete(id) {
        let sql = `DELETE FROM Medida WHERE idMedida = ?;`
        return db.query(sql, [id])
    }

}

module.exports = Medida