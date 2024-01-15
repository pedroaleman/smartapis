var express = require('express');
var proceso = require('../controllers/procesaimagen');
var api = express.Router();

api.get('/', proceso.getProperties);

//Ejemplo
// api
// .get("/", whatsAppController.VerifyToken)
// .post("/", whatsAppController.ReceivedMessage)
// .get("/ping", whatsAppController.Ping)


module.exports = api;