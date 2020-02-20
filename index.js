var http = require('http')
var fs = require('fs')
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

let transport = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: 'contactresval@gmail.com',
        pass: 'resval2019'
    }
});

const bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/.well-known/acme-challenge/:content', function(req, res) {
  res.send('rhw6gCp5LG3FvR3ET8I_63GDdeuKAg7PxgjWFzVch_Q.b_GU-mAcCTS5yoRBc0sU4warW57pXI82GKxbivBLIdA')
});
app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'index.html'));
});


app.use('/', router);
// Access the parse results as request.body
app.post('/sendemail', (request, response) => {
    SendEmail(request.body);
    response.sendFile(path.join(__dirname, 'gracias.html'));
});
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

async function  SendEmail(body){
    console.log(JSON.stringify(body));
    const message = {
        from: 'contactresval@gmail.com', // Sender address
        to: 'comercial@res-val.com;info@res-val.com',         // List of recipients
        subject: 'Solicitud de informacion', // Subject line
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