const db = require("../config/db")


class Usuario {
    constructor(nombre, apellido, correo, clave, telefono, bloqueado, reportado, salt) {
        this.nombre = nombre
        this.apellido = apellido
        this.correo = correo
        this.clave = clave
        this.telefono = telefono
        this.bloqueado = bloqueado
        this.reportado = reportado
        this.salt = salt
    }

    async save(){
        let sql = `INSERT INTO Usuario(nombre, apellido, correo, clave, bloqueado, reportado, salt) VALUES( ?, ?, ?, ?, '0', '0', ?
        );`
        const res = await db.query(sql, [this.nombre, this.apellido, this.correo, this.clave, this.salt])
        return res; 
    }

    async edit(id){
        let sql = `UPDATE Usuario SET nombre = ?, apellido = ?, correo = ?, telefono = ?, clave = ?, bloqueado = ?, reportado = ? WHERE(idUsuario = ?);`
        const res = await db.query(sql, [this.nombre, this.apellido, this.correo, this.telefono, this.clave, this.bloqueado, this.reportado, id])
        return res; 
    }

    static findAll() {
        let sql = "SELECT * FROM Usuario;"
        const res = db.query(sql);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Usuario WHERE idUsuario = ?`
        return db.query(sql, id)
    }
    static findByCorreo(correo) {
        let sql = `SELECT * FROM Usuario WHERE correo = ?`
        return db.query(sql, correo)
    }
}

module.exports = Usuario