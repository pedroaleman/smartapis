const fs = require('fs');
const path = require('path');
//const tf = require('@tensorflow/tfjs-node');
const tf = require("@tensorflow/tfjs")
require('@tensorflow/tfjs-node')

// Ruta al modelo MobileNet
const mobilenetModelPath = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json';

async function loadMobilenetModel() {
    const mobilenet = await tf.loadGraphModel(mobilenetModelPath);
    return mobilenet;
  }

  async function classifyImage(imagePath) {
    console.log('Entra a clasificar...', imagePath)

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
