const generic = require('../shared/generic');
const googleService = require('../services/googleApiService')
const tensorService = require('../services/tensorFlowService');
const tf = require("@tensorflow/tfjs")
require('@tensorflow/tfjs-node')

async function getProperties(req, res){
  const fileName = './images/SorentoFrente.jpg';
  //const fileName = './images/sorentolateral.jpg';
  //const fileName = './images/300653.png';
  //const fileName = './images/camionbasura.jpeg';

    try {
      tensorService.classifyImage(fileName);

      console.log("TensorFlow.js version: ", tf.version.tfjs);




      const arrObjetos = await googleService.getObjects(fileName);      
      if(arrObjetos == null){
        res.status(500).send({success: false, message: 'No fue posible procesar imagen', result: null});
        return;
      }

      let cadenaObjetos = arrObjetos.join();
      const objTraduccion = await googleService.translateText(cadenaObjetos);
      if(objTraduccion == null){
        res.status(500).send({success: false, message: 'No fue posible traducir objetos detectados', result: null});
        return;
      }

      //Quitar acentos y convertir a minísculas
      let sinAcentos = generic.quitarAcentos(objTraduccion[0]);
      sinAcentos = sinAcentos.toLowerCase();

      
      //Si es un vehiculo, validar si trae placas la imagen
      let vehiculo = {};
      const listaValores = ["coche", "vehiculo", "camion"];
      const coincidencias = generic.encontrarValoresEnCadena(sinAcentos, listaValores);
      if(coincidencias.length > 0){      
        //console.log('Es vehiculo...', sinAcentos)
        let re = /coche|vehiculo|camion/gim;
        let found = sinAcentos.match(re);
        let nombre = found == null ? null : found[0];
        vehiculo.nombre = nombre;


        //Color del vehiculo
        const color = await googleService.getColors(fileName);
        const hex = generic.rgbToHex(color.red,color.green,color.blue);

        //Es si me devuelve algo        
        const valorRGB = [color.red, color.green, color.blue];        
        const nombreColor = generic.obtenerNombreColorDesdeRGB(valorRGB,hex);
        //console.log(`El color es: ${nombreColor}`);
        

        //Este nunca encuentra el nombre no jala
        /*
        const nomColor = generic.NombreColor(hex);
        vehiculo.color = nomColor;
        */
        
        vehiculo.color = nombreColor;

        //console.log('hex: ',hex,nomColor)
        // const nombreColor = generic.NombreColor(valorRGB);
        // console.log(`El color es: ${nombreColor}`);        

        //Obtener la placa
        const arrPlaca = ["matricula", "placa"];
        const coincidenciasPlaca = generic.encontrarValoresEnCadena(sinAcentos, arrPlaca);
        if(coincidenciasPlaca.length > 0){
          const texto = await googleService.getText(fileName);          
          let res = texto.match(/[A-Z]{3}-\d{3,4}-\w/gim);
          if(res != null){
            placa = res[0];
            vehiculo.placa = placa;
          }

          //console.log('Placa: ',placa)
        }


      }

      //console.log('sinAcentos: ',sinAcentos)
      let obj = {success: true, message: 'Proceso Terminado',objects: sinAcentos, vehiculo: vehiculo};

      res.status(200).send(obj);
    } catch (error) {
        console.log('Error Google Service: ', error)
        res.status(500).send({success: false, message: error, objects: null, vehiculo: null});
    }


}



module.exports = {
	getProperties
}