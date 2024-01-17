const rgb2hex = require('rgb2hex');
const namedColors = require('color-name-list');


//#region Funciones locales
function hexARgb(hex) {
  // Normalizar el código hex (eliminar el signo # si está presente)
  const hexNormalizado = hex.replace(/^#/, '');

  // Extraer componentes R, G y B
  const r = parseInt(hexNormalizado.substring(0, 2), 16);
  const g = parseInt(hexNormalizado.substring(2, 4), 16);
  const b = parseInt(hexNormalizado.substring(4, 6), 16);

  // Devolver el resultado en formato RGB
  //return `rgb(${r}, ${g}, ${b})`;
  return [r,g,b];
}

//#endregion


function obtenerNombreColorDesdeRGB(rgb, hex) {
  //console.log('*******Llega: ',rgb, hex)

  // Función para calcular la distancia euclidiana entre dos colores
  function distanciaEuclidiana(color1, color2) {
    const diferencia = color1.map((value, index) => value - color2[index]);
    const distancia = Math.sqrt(diferencia.reduce((acc, val) => acc + val ** 2, 0));
    return distancia;
  }

  // Buscar el nombre del color más cercano en la lista
  let colorMasCercano;
  let distanciaMinima = Number.MAX_SAFE_INTEGER;

//console.log('Total Colores: ',namedColors.length)

  for (const color of namedColors) {
    let rgbCompare = hexARgb(color.hex);
    //console.log('rgbCompare: ',rgbCompare)
    const distancia = distanciaEuclidiana(rgb, rgbCompare);
    if (distancia < distanciaMinima) {
      //console.log('Encontrado: ',distancia , distanciaMinima, rgb, rgbCompare,color)
      distanciaMinima = distancia;
      colorMasCercano = color.name;
    }
  }

  return colorMasCercano;
}

function rgbToHex(r,g,b){
  const hexa = rgb2hex(`rgb(${r},${g},${b})`);
  return hexa.hex;
}


function NombreColor(hex){
  const hexNormalizado = hex.replace(/^#/, '');  
  const color = namedColors.find(color => color.hex === hexNormalizado);
  if(color == null || color === undefined)
    return null;  

  //console.log('nombre color: ',someColor.name); // => white
  return color.name;
}

function encontrarValoresEnCadena(cadena, listaValores) {
  const expresionRegular = new RegExp(listaValores.join('|'), 'gi');
  const coincidencias = cadena.match(expresionRegular);

  return coincidencias || [];
}

function quitarAcentos(cadena) {
    // Reemplazar caracteres acentuados con sus equivalentes sin acento
    const mapaAcentos = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      ü: 'u',
      ñ: 'n',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
      Ü: 'U',
      Ñ: 'N'
    };
  
    return cadena.replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, (letra) => mapaAcentos[letra] || letra);
  }
  
  /*
  // Ejemplo de uso
  const cadenaConAcentos = "Café y Mañana";
  const cadenaSinAcentos = quitarAcentos(cadenaConAcentos);
  
  console.log(cadenaSinAcentos); // Salida: "Cafe y Manana"
  
  */

  module.exports = {
	quitarAcentos,
  rgbToHex,
  encontrarValoresEnCadena,
  NombreColor,
  obtenerNombreColorDesdeRGB
}