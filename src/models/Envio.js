const db = require("../config/db")

class Envio {
    constructor(send) {
        this.id = send.id
        this.precioEnvio = send.precioEnvio
        this.fechaEntrega = send.fechaEntrega
        this.direccion = send.direccion
        this.tipoEntrega = send.tipoEntrega
        this.comprobanteCliente = send.comprobanteCliente
        this.idProvincia = send.idProvincia
        this.telefono = send.telefono
    }

    async save(){
        let sql = `INSERT INTO Envio(precioEnvio, fechaEntrega, direccion, tipoEntrega, comprobanteCliente, idProvincia, telefono) VALUES( null, null, ?, ?, null, ?, ?);`
        const res = await db.query(sql, [this.direccion, this.tipoEntrega, this.idProvincia, this.telefono])
        return res; 
    }

    async edit(id){
        let sql = `UPDATE Envio SET precioEnvio = ?, fechaEntrega = ?, direccion = ?, tipoEntrega = ?, comprobanteCliente = ?, idProvincia = ?, telefono = ? WHERE(idEnvio = ?);` 
        const res = await db.query(sql, [this.precioEnvio, this.fechaEntrega, this.direccion, this.tipoEntrega, this.comprobanteCliente, this.idProvincia, this.telefono, id])

        return res; 
    }

    static findAll() {
        let sql = "SELECT * FROM Envio;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Envio WHERE idEnvio = ?;`
        return db.query(sql, [id])
    }

    static editEnvio(id, fotoName){
        let sql = `UPDATE Envio SET fechaPago = CURDATE(), comprobanteCliente = ? WHERE(idEnvio = ?);`
        return db.query(sql, [fotoName, id])
    }

    static enviar(id, fechaEntrega){
        let sql = `UPDATE Envio SET fechaEntrega = ? WHERE(idEnvio = ?);`
        return db.query(sql, [fechaEntrega, id])
        
    }

}

module.exports = Envio