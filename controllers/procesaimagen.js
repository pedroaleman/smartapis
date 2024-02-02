const generic = require('../shared/generic');
const googleService = require('../services/googleApiService')
const tensorService = require('../services/tensorFlowService');


async function getProperties(req, res){
  //const fileName = './images/SorentoFrente.jpg';
  //const img = req.params['img'];

  //const fileName = './images/sorentolateral.jpg';
  //const fileName = './images/300653.png';
  //const fileName = './images/camionbasura.jpeg';

      let clase = null;

      try {
        if(req.files){
            //console.log('req.files: ', req.files)

            let imagen_path = req.files.img.path;
            let name = req.files.img.name;
            // let name = imagen_path.split('\\');
            // let image_name = name[2];
            //console.log('Archivo enviado: ', imagen_path,name)

          const arrObjetos = await googleService.getObjects(imagen_path);      
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

          //Si es una persona, no es necesario mandar la clasificación de tensor.
          if(!sinAcentos.includes('persona'))
          {
            clase = await tensorService.classifyImage(imagen_path);
            console.log('clase: ',clase)

            //Encontrar la primera clase

          }


          
          //Obtiene objeto vehiculo



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
            const color = await googleService.getColors(imagen_path);
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

            //Obtener la placa
            vehiculo.placa = await ObtienePlaca(sinAcentos,imagen_path);
        }

        //console.log('sinAcentos: ',sinAcentos)
        let obj = {success: true, message: 'Proceso Terminado',objects: sinAcentos, vehiculo: vehiculo,clase: clase};

        res.status(200).send(obj);
      }
    } catch (error) {
        console.log('Error Google Service: ', error)
        res.status(500).send({success: false, message: error, objects: null, vehiculo: null, clase: null});
    }


}


//#region Funciones locales
async function ObtienePlaca(texto,imagen_path){
    let placa = null;
    const arrPlaca = ["matricula", "placa"];
    const coincidenciasPlaca = generic.encontrarValoresEnCadena(texto, arrPlaca);
    if(coincidenciasPlaca.length > 0){
      const texto = await googleService.getText(imagen_path);          
      let res = texto.match(/[A-Z]{3}-\d{3,4}-\w/gim);
      if(res != null){
        placa = res[0];
      }
  }

    return placa;
}

//#endregion


module.exports = {
	getProperties
}