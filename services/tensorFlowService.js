const fs = require('fs');
const path = require('path');

const tf = require('@tensorflow/tfjs-node')
const mobilenet = require('@tensorflow-models/mobilenet');
const { relativeTimeRounding } = require('moment');


async function decodeImage ( imgPath ) {
    const imgSrc = fs.readFileSync(imgPath);
    const arrByte = Uint8Array.from(Buffer.from(imgSrc));
    return tf.node.decodeImage(arrByte);
  };


  async function classifyImage(imagePath) {
<<<<<<< HEAD
    console.log('Entra a clasificar...', imagePath)
    console.log("TensorFlow.js version: ", tf.version.tfjs);

=======
    //console.log('Entra a clasificar...', imagePath)
    //console.log("TensorFlow.js version: ", tf.version.tfjs);
>>>>>>> 47a02f36c2c187e50a2a6686c3a3899240229377

    try {        
        // Load the model.
        const model = await mobilenet.load();               

        const imageBuffer = await fs.readFileSync(imagePath);
        const imageArrayBuffer = new Uint8Array(imageBuffer);    
        const imageTensor = tf.node.decodeImage(imageArrayBuffer);
        const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
        
        

        const predictions = await model.classify(resizedImage);
        // console.log('Predictions: ');
        // console.log(predictions);
 
        // Limpia los recursos
        imageTensor.dispose();

        let lst = predictions.map(objeto => objeto.className);
        let cadenaObjetos = lst.join();    

        //console.log('Lista: ',cadenaObjetos)
        return cadenaObjetos;
        
    } catch (error) {
        console.log('Error: ', error)
    }
    finally {
        //Eliminar imagen
        
      }

    return null;
  
}

// async function base64Encode(file) {
//     var body = await fs.readFileSync(file);
//     return body.toString('base64');
// }




  async function classifyImage2(imagePath) {
    console.log('Entra a clasificar...', imagePath)
    console.log("TensorFlow.js version: ", tf.version.tfjs);

    
    const mobilenet = await loadMobilenetModel();
    
  
    // Lee la imagen como un tensor
  const imageBuffer = fs.readFileSync(imagePath);
  const imageArrayBuffer = new Uint8Array(imageBuffer);
  const imageTensor = tf.node.decodeImage(imageArrayBuffer);

  // Ajusta las dimensiones de la imagen según las necesidades de MobileNet
  const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const expandedImage = resizedImage.expandDims(0);

  // Normaliza los valores de píxeles al rango [0, 1]
  const normalizedImage = expandedImage.div(255.0);

  // Realiza la clasificación
  const predictions = mobilenet.predict(normalizedImage);

  // Obtiene los resultados
  const topPredictions = await getTopPredictions(predictions, 3);

  // Imprime las predicciones
  console.log('Predicciones:');
  topPredictions.forEach(prediction => {
    console.log(`${prediction.className}: ${prediction.probability.toFixed(4)}`);
  });

  // Limpia los recursos
  imageTensor.dispose();
  resizedImage.dispose();
  expandedImage.dispose();
  normalizedImage.dispose();
  predictions.dispose();

   
  }

  // Función para obtener las principales predicciones
async function getTopPredictions(predictions, topK) {
    const values = await predictions.data();
    const indices = values.map((value, index) => ({ value, index }));
    indices.sort((a, b) => b.value - a.value);
    const topIndices = indices.slice(0, topK);
    const topPredictions = topIndices.map(index => ({
      className: getClassName(index.index),
      probability: values[index.index],
    }));
    return topPredictions;
  }
  
  // Función para obtener el nombre de la clase a partir del índice
  function getClassName(index) {
    // Puedes cargar las etiquetas desde un archivo o una fuente externa según tus necesidades
    const labels = require('@tensorflow-models/mobilenet/dist/imagenet_classes');
    return labels[index];
  }


module.exports = {
    classifyImage
}
