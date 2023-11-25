const db = require("../config/db")
const Comprador = require("../models/Comprador");

class Vendedor  {
    constructor(seller) {
        this.qrPlin = seller.qrPlin
        this.qrYape = seller.qrYape
        this.delivery = seller.delivery
        this.agencia = seller.agencia
        this.ruc = seller.ruc
        this.aprobado = seller.aprobado
    }

    async save(id){
        let sql = `INSERT INTO Vendedor(qrPlin, qrYape, delivery, agente, ruc, aprobado, idUsuario) VALUES( ?, ?, ?, ?, ?, 0, ?);`
        const res = await db.query(sql, [this.qrPlin, this.qrYape, this.delivery, this.agencia, this.ruc, id])
        return res; 
    }

    async edit(id){
        let sql = `UPDATE Vendedor SET qrPlin = ?, qrYape = ?, delivery = ?, agente = ?, RUC = ?, aprobado = ? WHERE(idUsuario = ?);`
        const res = await db.query(sql, [this.qrPlin, this.qrYape, this.delivery, this.agencia, this.ruc, this.aprobado, id])
        return res; 
    }

    static findAll() {
        let sql = "SELECT * FROM Usuario a INNER JOIN Comprador b ON a.idUsuario = b.idUsuario INNER JOIN Vendedor c ON c.idUsuario = a.idUsuario;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Usuario a INNER JOIN Comprador b ON a.idUsuario = b.idUsuario INNER JOIN Vendedor c ON c.idUsuario = a.idUsuario WHERE a.idUsuario = ?;`
        return db.query(sql, [id])
    }

    static findByIdVendedor(id) {
        let sql = `SELECT * FROM Vendedor  WHERE idUsuario = ?;`
        return db.query(sql, [id])
    }

}

module.exports = Vendedor