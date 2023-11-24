const db = require("../config/db")

class Venta {
    constructor(sell) {
        this.id = sell.idVenta
        this.estado = sell.estado
        this.fechaCompra = sell.fechaCompra
        this.total = sell.total
        this.comprobanteCliente = sell.comprobanteCliente
        this.comprobantePago = sell.comprobantePago
        this.fechaConfirmacionPago = sell.fechaConfirmacionPago
        this.idEnvio = sell.idEnvio
        this.idComprador = sell.idComprador
        this.idVendedor = sell.idVendedor
        this.fechaConfirmacionPago = sell.fechaConfirmacionPago
        this.idPrenda = sell.idPrenda
    }

    async save(){
        let sql = `INSERT INTO Venta (estado, total, fechaCompra, comprobanteCliente, comprobantePago, idEnvio, idComprador, idVendedor, fechaConfirmacionPago) VALUES( 0, ?, CURDATE(), ?, null, null, ?, ?, null);`
        const res = await db.query(sql, [this.total, this.comprobanteCliente, this.idComprador, this.idVendedor])
        return res;
    }

    async edit(id){
        let sql = `UPDATE Venta SET estado = ?, total = ?, fechaPago = ?, comprobanteCliente = ?, comprobantePago = ?, idEnvio = ? WHERE(idVenta = ?);`
        const res = await db.query(sql, [this.estado, this.total, this.fechaPago, this.comprobanteCliente, this.comprobantePago, this.idEnvio, id])
        return res;
    }

    static updateEnvio(id, idEnvio){
        let sql = `UPDATE Venta SET idEnvio = ?, estado = 2 WHERE(idVenta = ?);`
        return db.query(sql, [idEnvio, id])
    }

    static payEnvio(id){
        let sql = `UPDATE Venta SET estado = 4 WHERE(idEnvio = ?);`
        return db.query(sql, [id])
    }

    static validateEnvio(id){
        let sql = `UPDATE Venta SET estado = 5 WHERE(idEnvio = ?);`
        return db.query(sql, [id])
    }

    static cotizarEnvio(id){
        let sql = `UPDATE Venta SET estado = 3 WHERE(idEnvio = ?);`
        return db.query(sql, [id])
    }

    static enviar(id){
        let sql = `UPDATE Venta SET estado = 6 WHERE(idEnvio = ?);`
        return db.query(sql, [id])
    }

    async validate(id){
        let sql = `UPDATE Venta SET estado = 1, fechaConfirmacionPago = CURDATE(), comprobantePago = ? WHERE(idVenta = ?);`
        const res = await db.query(sql, [this.comprobantePago, id])
        return res;
    }

    static findAll() {
        let sql = "SELECT * FROM Venta;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Venta WHERE idVenta = ?;`
        return db.query(sql, [id])
    }

    static findByIdComprador(id) {
        let sql = `SELECT * FROM Venta WHERE idComprador = ?  OR idVendedor = ?;`
        return db.query(sql, [id, id])
    }

    static calificarVendedor(id, idVendedor, comentario, calificacion){
        let sql = `UPDATE Venta SET estado = 7 WHERE(idEnvio = ?);`
        db.query(sql, [id])
        sql = `INSERT INTO Comentario (texto, calificacion, utilidad, fecha, idVendedor) VALUES (?, ?, 1, CURDATE(), ?);`
        return db.query(sql, [comentario, calificacion, idVendedor])
    }

    static block(id, queja){
        let sql = `UPDATE Venta SET estado = 8, idQueja = ? WHERE(idVenta = ?);`
        return db.query(sql, [queja, id])
    }

    static findByIdEnvio(id) {
        let sql = `SELECT * FROM Venta WHERE idEnvio = ?;`
        return db.query(sql, [id])
    }

    static findByEstado(estado) {
        let sql = `SELECT * FROM Venta WHERE estado = ?;`
        return db.query(sql, [estado])
    }

    static resolverQueja(id){
        let sql = `UPDATE Venta SET estado = 9 WHERE(idQueja = ?);`
        return db.query(sql, [id])
    }
}

module.exports = Venta