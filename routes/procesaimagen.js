var express = require('express');
var proceso = require('../controllers/procesaimagen');
var api = express.Router();

var multipart = require('connect-multiparty');
var multipartyPath = multipart({ uploadDir: './uploads/procesaimagenes'} );



api.get('/', proceso.getProperties)
    .post('/',multipartyPath,proceso.getProperties);

//Ejemplo
// api
// .get("/", whatsAppController.VerifyToken)
// .post("/", whatsAppController.ReceivedMessage)
// .get("/ping", whatsAppController.Ping)


module.exports = api;