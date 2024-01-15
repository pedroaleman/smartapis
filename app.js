const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 3700
const app = express();
//const apiRoute = require("./routes/procesaimagen");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//app.use("/processimage", apiRoute);
app.use('/api/1.0', require('./routes'))

app.set('port', port); 
app.listen(app.get('port'), function(){
    console.log("Servidor SmartApis conectado en " + app.get('port'));       
});


app.use((req,res,next)=>{
    res.header('Content-Type: application/json');
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

    next();
});

module.exports = app;