const db = require("../config/db")
const Usuario = require("../models/Usuario");

class Comprador extends Usuario {
    constructor(buyer) {
        super(buyer.nombre, buyer.apellido, buyer.correo, buyer.clave, buyer.telefono, buyer.bloqueado, buyer.reportado)
        this.direccion = buyer.direccion
        this.genero = buyer.genero
        this.dni = buyer.dni
        this.id = buyer.idUsuario
    }

    async save(id){
        let sql = `INSERT INTO Comprador(direccion, genero, dni, idUsuario, idProvincia, idMedida) VALUES( ?, ?, ?, ?, null, null);`
        const res = await db.query(sql, [this.direccion, this.genero, this.dni, id])
        return res; 
    }

    async edit(id){
        let sql = `UPDATE Usuario SET nombre = ?, apellido = ?, correo = ?, telefono = ?, clave = ?, bloqueado = ?, reportado = ? WHERE(idUsuario = ?);`
        let res = await db.query(sql, [this.nombre, this.apellido, this.correo, this.telefono, this.clave, this.bloqueado, this.reportado, id])
        sql = `UPDATE Comprador SET direccion = ?, genero = ?, dni = ?, idProvincia = ?, idMedida = ? WHERE(idUsuario = ?);`
        res = await db.query(sql, [this.direccion, this.genero, this.dni, this.idProvincia, this.idMedida, id])
        return res; 
    }

    static findAll() {
        let sql = "SELECT * FROM Usuario a INNER JOIN Comprador b ON a.idUsuario = b.idUsuario;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Usuario a INNER JOIN Comprador b ON a.idUsuario = b.idUsuario WHERE a.idUsuario = ?;`
        return db.query(sql, [id])
    }

    static validateRuc(aprobado, id) {
        let sql = `UPDATE Vendedor SET aprobado = ? WHERE idUsuario = ?;`
        return db.query(sql, [aprobado, id])
    }

    static reportar(id, num) {
        let sql = `UPDATE Usuario SET reportado = ? WHERE idUsuario = ?;`
        return db.query(sql, [num, id])
    }

    static bloquear(id){
        let sql = `UPDATE Usuario SET bloqueado = 1 WHERE idUsuario = ?;`
        return db.query(sql, [id])
    }

}

module.exports = Comprador