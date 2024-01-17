require('dotenv').config();

//Importar librerias
const {Translate} = require('@google-cloud/translate').v2;
const vision = require('@google-cloud/vision');
const fs = require('fs');


//Asignar la cuenta de servicio, a la variable de entorno
process.env.GOOGLE_APPLICATION_CREDENTIALS = './cuentasmart.json'//path.join(__dirname, '/cuentasmart.json');

async function getColors(fileName){
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    // Performs property detection on the local file
    const [result] = await client.imageProperties(fileName);
    const colors = result.imagePropertiesAnnotation.dominantColors.colors;    
    //colors.forEach(color => console.log('color: ',color));
    return colors[0].color;
}



async function getText(fileName){
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.documentTextDetection(fileName);
    return result.fullTextAnnotation.text;   
}

async function getObjects(fileName){
    const client = new vision.ImageAnnotatorClient();
    const request = {
        image: {content: fs.readFileSync(fileName)},
    };

    const [result] = await client.objectLocalization(request);
    objects = result.localizedObjectAnnotations;    
    return objects.map(objeto => objeto.name);
}

async function translateText(text) {  
    // Creates a client de Translate
    const translate = new Translate()
    const target = 'es';

    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations.map(translation => translation);   
    
    //let cadenaObjetos = arrObjetos.join();    
    //let sinAcentos = generic.quitarAcentos(cadenaObjetos);
    //return sinAcentos.toLowerCase();

  }

  module.exports = {
    translateText,
    getObjects,
    getText,
    getColors
  }