const express = require('express');
const router = require('./routes/Usuario');
const routerComprador = require('./routes/Comprador');
const routerVendedor = require('./routes/Vendedor');
const routerPrenda = require('./routes/Prenda');
const routerVenta = require('./routes/Venta');
const routerProvincia = require('./routes/Provincia');
const routerConsulta = require('./routes/Consulta');
const routerPhoto = require('./routes/Foto');
const fileUpload = require('express-fileupload');
const cors = require('cors');

require("dotenv").config();

const app = express();
//settings
app.use(express.json());

app.use(fileUpload())
app.use(cors({
    origin: ['http://localhost:3000','http://mrbucket-tesis.s3-website-us-east-1.amazonaws.com']
}));

app.use("/clothes", routerPrenda)
app.use("/users", router)
app.use("/buyers", routerComprador)
app.use("/sellers", routerVendedor)
app.use("/sell", routerVenta)
app.use("/cities", routerProvincia)
app.use("/question", routerConsulta)
app.use("/photos", routerPhoto)
app.use(express.static('images'))

const PORT = process.env.PORT || 8080;  
app.listen(8080, () => {
    console.log(`Server on port ${PORT}`)
});