require('dotenv').config();
const generic = require('../shared/generic');

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client de Translate
const translate = new Translate()
//const text = 'The text to translate, e.g. Hello, world!';
const target = 'es';


// Establece la variable de entorno GOOGLE_APPLICATION_CREDENTIALS con la ruta al archivo JSON de la cuenta de servicio.
// Reemplaza '/ruta/a/tu/credencial.json' con la ruta real de tu archivo JSON de credenciales.
process.env.GOOGLE_APPLICATION_CREDENTIALS = './cuentasmart.json'//path.join(__dirname, '/cuentasmart.json');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const fs = require('fs');
const client = new vision.ImageAnnotatorClient();
const fileName = './images/SorentoFrente.jpg';
//const fileName = './images/300653.png';

const { OpenAIAPI } = require('openai');
//const apiKey = process.env.OPENAI_API_KEY  //Es la api de chat gpt

async function translateText(text) {
    //console.log('entra a traducir: ',text)
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    const arrObjetos = translations.map(translation => translation);
    let cadenaObjetos = arrObjetos.join();
    // console.log('Translations:'),translations;
    // translations.forEach((translation, i) => {
    //   console.log(`${text[i]} => (${target}) ${translation}`);
    // });

    //console.log('Haber: ', cadenaObjetos)

    
    let sinAcentos = generic.quitarAcentos(cadenaObjetos);

    return sinAcentos.toLowerCase();
  }

async function getProperties(req, res){
    //let lst = [];

    try {
        // const [result] = await client.textDetection(fileName);
        // const detections = result.textAnnotations;
        // //console.log('Text:',detections[0].description);
        // console.log('Text:');        
        // detections.forEach(text => {
        //     //console.log(text)
        //     let obj = { tipo: 'Text',result: text };
        //     lst.push(obj);
        // });

        const request = {
            image: {content: fs.readFileSync(fileName)},
          };

          const [result] = await client.objectLocalization(request);
          const objects = result.localizedObjectAnnotations;
          const arrObjetos = objects.map(objeto => objeto.name);
          let cadenaObjetos = arrObjetos.join();
          let traduccion = await translateText(cadenaObjetos);

        //   objects.forEach(object => {
        //     console.log(`Name: ${object.name}`);
        //     console.log(`Confidence: ${object.score}`);
        //     const vertices = object.boundingPoly.normalizedVertices;
        //     vertices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
        //   });

//*******SI FUNCIONA, PERO ES EL QUE SACA ETIQUETAS, NO LO OCUPO YO */
/*
        // Performs label detection on the image file
        const [resultLabels] = await client.labelDetection(fileName);
        const labels = resultLabels.labelAnnotations;        
        console.log('Labels: ');

        const annotations = labels.map(annotation => annotation.description);
        let cadena = annotations.join();
        console.log('annotations: cadena: ',cadena)
        translateText(cadena);   
*/

          if(traduccion.includes('matricula') || traduccion.includes('placa') ){
            //Obtener el texto
            console.log('Detectar texto: ')

            // Read a local image as a text document
            const [result] = await client.documentTextDetection(fileName);
            const fullTextAnnotation = result.fullTextAnnotation;
            //console.log(`Full text: ${fullTextAnnotation.text}`);
            //let re = /[A-Z]{3}-\d{3,4}-\w/;
            let res = fullTextAnnotation.text.match(/[A-Z]{3}-\d{3,4}-\w/gim);
            if(res != null){
                placa = res[0];
            }
            
            //console.log(res);
            console.log('Placa: ',placa)


            //REGULAR:  [A-Z]{3}-\d{3,4}-\w

            /*fullTextAnnotation.pages.forEach(page => {
             page.blocks.forEach(block => {
                console.log(`Block confidence: ${block.confidence}`);
                block.paragraphs.forEach(paragraph => {
                console.log(`Paragraph confidence: ${paragraph.confidence}`);
                paragraph.words.forEach(word => {
                    const wordText = word.symbols.map(s => s.text).join('');
                    console.log(`Word text: ${wordText}`);
                    console.log(`Word confidence: ${word.confidence}`);
                    word.symbols.forEach(symbol => {
                    console.log(`Symbol text: ${symbol.text}`);
                    console.log(`Symbol confidence: ${symbol.confidence}`);
                    });
                });
                });
            }); 
        });*/



          }

        res.status(200).send({success: true, message: traduccion, result: null});
    } 
    catch (error) {
        console.log('Error Api Visión de Google: ', error)
        res.status(500).send({success: false, message: error, result: null});
    } 
}

module.exports = {
	getProperties
}