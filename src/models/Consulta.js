const db = require("../config/db")
class Consulta {
    constructor(consulta) {
        this.id = consulta.id
        this.pregunta = consulta.Pregunta
        this.respuesta = consulta.respuesta
        this.idPrenda = consulta.idPrenda
    }

    async save(){
        let sql = `INSERT INTO Consulta(Pregunta, Respuesta, idPrenda) VALUES( ?, ?, ?);`
        const res = await db.query(sql, [this.pregunta, this.respuesta, this.idPrenda])
        return res;
    }

    async edit(id){
        let sql = `UPDATE Consulta SET Pregunta = ?, Respuesta = ?, idPrenda = ? WHERE(idConsulta = ?);`
        const res = await db.query(sql, [this.pregunta, this.respuesta, this.idPrenda, id])
        return res;
    }

    static findById(id) {
        let sql = `SELECT * FROM Consulta WHERE idPrenda = ?;`
        return db.query(sql, [id])
    }

    static findByIdVendedor(id) {
        let sql = `select idConsulta, Pregunta, p.*, (select nombre from Foto f where f.idPrenda = p.idPrenda limit 1) as foto from Vendedor v inner join Prenda p on idUsuario = idVendedor inner join Consulta c on p.idPrenda = c.idPrenda where idUsuario = ? and Respuesta is null;`
        return db.query(sql, [id])
    }
}

module.exports = Consulta