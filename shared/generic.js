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
	quitarAcentos
}