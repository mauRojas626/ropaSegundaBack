const nodemailer = require('nodemailer');

async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ropa2damanoapp@gmail.com',
          pass: 'qwvu ptnr nhjz krxo',
        },
      })
      const emailOptions = {
        from: 'ropa2damanoapp@gmail.com',
        to: email,
        subject: 'Prenda comprada',
        html: `
        <p>Estimado usuario</p>
        <br></br>
        <p>Se ha realizado la compra de una prenda suya.</p>
        <br></br>
        <p>Por favor, ingrese a la aplicación para validar el pago.</p>
        <br></br>
        <p>Saludos</p>
        `,
    }

    try {
        // Send the email
        const info = await transporter.sendMail(emailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendEmail
}