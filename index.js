var http = require('http')
var fs = require('fs')
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '9f7e7d1fe0756e',
        pass: '69610a9d69140b'
    }
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res) {
    res.redirect(path.join(__dirname + '/index.html'));
})
app.use(express.static(__dirname + '/public'));
app.use('/', router);
// Access the parse results as request.body
app.post('/sendemail', (request, response) => {
    SendEmail(request.body);
    response.redirect('/');
});
app.listen(process.env.port || 4000);

async function  SendEmail(body){
    console.log(JSON.stringify(body));
    const message = {
        from: 'elonmusk@tesla.com', // Sender address
        to: 'to@email.com',         // List of recipients
        subject: 'Design Your Model S | Tesla', // Subject line
        text: `La persona con el nombre ${body.user.name} de ${body.user.ciudad} con los siguientes datos de contacto: Correo: ${body.user.email} , Telefono: ${body.user.telefono}   hace la siguiente solicitud ${body.user.message}`// Plain text body        
    };

   transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});
}