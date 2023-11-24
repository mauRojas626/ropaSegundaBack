const nodemailer = require('nodemailer');

async function sendEmail(email, tipo = 0) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ropa2damanoapp@gmail.com',
          pass: 'qwvu ptnr nhjz krxo',
        },
    })
    const message1 = tipo == 0 ? 'Se ha realizado la compra de una prenda suya.' : tipo == 1 ? 'Se ha rechazado su RUC ya que no coincide con sus datos personales': tipo === 2 ? 'Se ha aceptado su RUC.' : 'Se ha reportado una compra suya'
    const message2 = tipo == 0 ? 'Por favor, ingrese a la aplicación para validar el pago.' : tipo == 1 ? 'Por favor, ingrese a la aplicación para cambiar su RUC.': tipo === 2 ? 'Ya puede empezar a realizar ventas en la aplicación.' : 'Se está revisando su caso. Cuando se resuelva, se le notificará a su correo.'
    const subjet = tipo == 0 ? 'Prenda comprada' : tipo == 1 ? 'RUC rechazado': tipo === 2 ? 'RUC aceptado' : 'Compra reportada'
    const emailOptions = {
        from: 'ropa2damanoapp@gmail.com',
        to: email,
        subject: subjet,
        html: `
        <p>Estimado usuario</p>
        <br></br>
        <p>${message1}</p>
        <br></br>
        <p>${message2}</p>
        <br></br>
        <p>Saludos</p>
        `,
    }

    try {
        // Send the email
        const info = await transporter.sendMail(emailOptions)
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendEmail
}