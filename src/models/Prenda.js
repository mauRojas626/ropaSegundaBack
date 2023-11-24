const db = require("../config/db")

class Prenda {
    constructor(clothes) {
        this.id = clothes.id
        this.precio = clothes.precio
        this.talla = clothes.talla
        this.color = clothes.color
        this.detalles = clothes.detalle
        this.descripcion = clothes.descripcion
        this.marca = clothes.marca
        this.sexo = clothes.sexo
        this.categoria = clothes.categoria
        this.material = clothes.material
        this.nombre = clothes.nombre
        this.fechaPublicacion = null
        this.idMedida = clothes.idMedida
        this.idVendedor = clothes.idVendedor
    }

    async save(){
        let sql = `INSERT INTO Prenda(precio, talla, color, detalle, descripcion, marca, sexo, categoria, material, nombre, fechaPublicacion, idMedida, idVendedor, Comprado) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, 0);`
        const res = await db.query(sql, [this.precio, this.talla, this.color, this.detalles, this.descripcion, this.marca, this.sexo, this.categoria, this.material, this.nombre, this.idMedida, this.idVendedor])
        return res; 
    }

    async edit(id){
        let sql = `UPDATE Prenda SET precio = ?, talla = ?, color = ?, detalle = ?, descripcion = ?, marca = ?, sexo = ?, categoria = ?, material = ?, nombre = ?, fechaPublicacion = ? WHERE(idPrenda = ?);`
        const res = await db.query(sql, [this.precio, this.talla, this.color, this.detalles, this.descripcion, this.marca, this.sexo, this.categoria, this.material, this.nombre, this.fechaPublicacion, id])

        return res; 
    }

    static findAll() {
        let sql = "SELECT * FROM Prenda where comprado = 0;"
        const res = db.query(sql);
        return res
    }

    static findAllByVendedor(id) {
        let sql = "SELECT * FROM Prenda where idVendedor = ?;"
        const res = db.query(sql, [id]);
        return res
    }

    static findById(id) {
        let sql = `SELECT * FROM Prenda WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static delete(id) {
        let sql = `DELETE FROM Prenda WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static updateComprado(id){
        let sql = `UPDATE Prenda SET Comprado = 1 WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static updateAbandonado(id){
        let sql = `UPDATE Prenda SET Comprado = 0 WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static deleteByVendedor(id) {
        let sql = `DELETE FROM Prenda WHERE idVendedor = ?;`
        return db.query(sql, [id])
    }

    static findByIdVendedor(id) {
        let sql = `SELECT * FROM Prenda WHERE idVendedor = ?;`
        return db.query(sql, [id])
    }

}

module.exports = Prenda