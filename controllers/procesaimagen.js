require('dotenv').config();


// Establece la variable de entorno GOOGLE_APPLICATION_CREDENTIALS con la ruta al archivo JSON de la cuenta de servicio.
// Reemplaza '/ruta/a/tu/credencial.json' con la ruta real de tu archivo JSON de credenciales.
process.env.GOOGLE_APPLICATION_CREDENTIALS = './cuentasmart.json'//path.join(__dirname, '/cuentasmart.json');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const fileName = './images/SorentoFrente.jpg';

const { OpenAIAPI } = require('openai');
//const apiKey = process.env.OPENAI_API_KEY  //Es la api de chat gpt

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

        // Performs label detection on the image file
        const [resultLabels] = await client.labelDetection(fileName);
        const labels = resultLabels.labelAnnotations;
        console.log('Labels:');

        const annotations = labels.map(annotation => annotation.description);
        //console.log('annotations: ',annotations)

        annotations.forEach((etiqueta, index) => {
            //console.log('etiqueta: ',etiqueta)
            //console.log(annotations[index], ' : ', translation.text);

            const prompt = `Actua como un traductor profesional de ingles a español. ¿Que significa ${etiqueta}?`;
            const myAssistant  = async (prompt) => {
                try {
                  const openai = new OpenAI({
                    apiKey: process.env.OPEN_AI_API_KEY,
                  });

                  openai.complete({
                    engine: 'text-davinci-003', // Puedes ajustar el motor según tus necesidades
                    prompt: prompt,
                    max_tokens: 150, // Puedes ajustar la longitud máxima de la respuesta
                    })
                .then(response => {
                    const answer = response.data.choices[0].text.trim();
                    console.log('Respuesta:', answer);
                })
                .catch(error => console.error('Error al llamar a la API de OpenAI:', error));


                 return true;
                } catch (err) {
                  console.error("Error in chat bot =====>", err);
                }
              };


         /*    const prompt = `Actua como un traductor profesional de ingles a español. ¿Que significa ${etiqueta}?`;
            const openai = new OpenAIAPI({ key: apiKey });

            openai.complete({
                engine: 'text-davinci-003', // Puedes ajustar el motor según tus necesidades
                prompt: prompt,
                max_tokens: 150, // Puedes ajustar la longitud máxima de la respuesta
                })
            .then(response => {
                const answer = response.data.choices[0].text.trim();
                console.log('Respuesta:', answer);
            })
            .catch(error => console.error('Error al llamar a la API de OpenAI:', error)); */


        });

      

        /*
            // Traduce las etiquetas al español.
            translate(annotations, { to: 'es' })
            .then((translations) => {
            console.log('Etiquetas en español:');
            translations.forEach((translation, index) => {
                console.log(annotations[index], ' : ', translation.text);
            });
            })
            .catch((err) => {
            console.error('Error al traducir:', err);
            });
        */

        // labels.forEach(label => {            
        //     //console.log(label.description)
        //     let obj = { tipo: 'Labels',result: label.description };
        //     lst.push(obj);
        // });

        // process.on('unhandledRejection', err => {
        //     console.error(err.message);
        //     process.exitCode = 1;
        // });

        //console.log(lst)

        res.status(200).send({success: true, message: annotations});
    } catch (error) {
        console.log('Error Api Visión de Google: ', error)
        res.status(500).send({success: false, message: error});
    } 

   
}

module.exports = {
	getProperties
}