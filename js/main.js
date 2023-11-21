let game = document.getElementById('game');
let personaje = document.getElementById('personaje');
let leftPos = 630;
let topPos = 600;
let arrayCamino;
let intervalId = null;
let vidas = 3;   
let juegoEnCurso = true;
let funciona = false;
let randomX;
let randomY;

crearMapa();

actualizarPosicionPersonaje();
actualizarVidas();
//spawnObjetos();
inicioMovimientoAutomatico(); // que se mueva desde el principio
movimientoPersonaje();


function actualizarVidas() {
  for (let i = 1; i <= 3; i++) {
    const heart = document.getElementById(`heart${i}`);
    if (i <= vidas) {
      // Mostrar corazón lleno
      heart.src = "/images/corazones/corazonPixel-entero.png";
    } else {
      // Ocultar corazón vacío
      heart.src = "/images/corazones/corazonPixel-vacio.png";
    }
  }
  perder();
}

function ganar() {
  if (leftPos === 0) {
    popupFuncion('ganar');
  }
}
function perder() {
  if (vidas === 0) {
    popupFuncion('perder');
  }
}
function crearMapa() {
  arrayCamino = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 0 , 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0]
  ];

  for (let i = 0; i < arrayCamino.length; i++) {
    for (let j = 0; j < arrayCamino[i].length; j++) {
      if (arrayCamino[i][j] === 1) {
        // Crea un nuevo elemento div para representar una parte del camino.
        let caminoDiv = document.createElement('div');
        caminoDiv.className = 'camino';
        //ajusta las posiciones 
        caminoDiv.style.top = i * 80 + 'px';
        caminoDiv.style.left = j * 100 + 'px';
        game.appendChild(caminoDiv); // Agrega el div al juego.
      }
    }
  }
}
function actualizarPosicionPersonaje() {
  ganar();
  //posición personaje
  personaje.style.left = leftPos + 'px';
  personaje.style.top = topPos + 'px';

  //comprobar que no se sale
  comprobarPersonajeDentroCamino();

  // printea posición del personaje
  document.getElementById('posicion').innerHTML = "posición = [" + leftPos + ", " + topPos + "]";
}

function inicioMovimientoAutomatico() {
  if (juegoEnCurso && vidas > 0) {
    intervalId = movimiento('up', 10);
  }
}


//FUNCION A CAMBIAR, YA NO HAY LIMITE DE MAPA
function movimiento(direction, step) {
  return setInterval(() => {
    if (direction === 'left'&& leftPos > 0) {
      leftPos -= step;
    } else if (direction === 'right') {
      leftPos += step;
    } else if (direction === 'up') {
      topPos -= step;
    } else if (direction === 'down' && topPos < 600) {
      topPos += step;
    }
    actualizarPosicionPersonaje();
  }, 50); //PONER A 50 LUEGO
}

// function generarPosicionRandomObjetos(){
//  randomX = Math.floor((Math.random() * 800));
//  randomY = Math.floor((Math.random() * 640));
// }

// function spawnObjetos(){
//   const imagenPalo = document.getElementById('imagenPalo');
//   const imagenPiedra = document.getElementById('imagenPiedra');
//   const imagenPlacasolar = document.getElementById('imagenPlacasolar');

//   imagenPalo.src= "/images/objetos/paloPixelart.png";
//   imagenPiedra.src= "/images/objetos/piedraPixelart.png";
//   imagenPlacasolar.src= "/images/objetos/placaSolar.png";

//   // Generar la posición random
//   randomX = Math.floor((Math.random() * 800));
//  randomY = Math.floor((Math.random() * 640));


//   imagenPalo.style.top = randomY;
//   imagenPalo.style.left = randomX;




// }

// Función para generar una posición aleatoria dentro del camino
function generarPosicionAleatoriaEnCamino() {
  const fila = Math.floor(Math.random() * arrayCamino.length);
  const columna = Math.floor(Math.random() * arrayCamino[0].length);
  const ObjetoPosX = columna * 100;  // Ancho de cada celda
  const ObjetoPosY = fila * 80;     // Altura de cada celda

  return { ObjetoPosX, ObjetoPosY };
}

// Función para spawnear los objetos en posiciones aleatorias dentro del camino
function spawnObjetos() {
  const imagenPalo = document.getElementById('imagenPalo');
  const imagenPiedra = document.getElementById('imagenPiedra');
  const imagenPlacasolar = document.getElementById('imagenPlacasolar');

  // Generar posiciones aleatorias dentro del camino para cada objeto
  const posicionPalo = generarPosicionAleatoriaEnCamino();
  const posicionPiedra = generarPosicionAleatoriaEnCamino();
  const posicionPlacasolar = generarPosicionAleatoriaEnCamino();

  // Asignar las posiciones a los objetos
  imagenPalo.style.left = `${posicionPalo.ObjetoPosX}px`;
  imagenPalo.style.top = `${posicionPalo.ObjetoPosY}px`;

  imagenPiedra.style.left = `${posicionPiedra.ObjetoPosX}px`;
  imagenPiedra.style.top = `${posicionPiedra.ObjetoPosY}px`;

  imagenPlacasolar.style.left = `${posicionPlacasolar.ObjetoPosX}px`;
  imagenPlacasolar.style.top = `${posicionPlacasolar.ObjetoPosY}px`;

 
}

// Función para comprobar si el personaje y los objetos están dentro del camino
// function comprobarPersonajeDentroCamino() {
//   // ... (resto de tu código)

//   // Verificar si el personaje está dentro del camino (como lo tienes actualmente)

//   // Verificar si los objetos están dentro del camino
//   const objetos = document.getElementById('objetos').children;
//   for (const objeto of objetos) {
//     const objetoLeft = parseInt(objeto.style.left);
//     const objetoTop = parseInt(objeto.style.top);

//     const objetoColumna = Math.floor(objetoLeft / 100);
//     const objetoFila = Math.floor(objetoTop / 80);

//     const objetoIsBlocked = arrayCamino[objetoFila][objetoColumna] === 0;

//     if (objetoIsBlocked) {
//       // Si algún objeto no está dentro del camino, vuelve a generar posiciones
//       spawnObjetos();
//       return;
//     }
//   }

//   // Resto del código...
// }



function movimientoPersonaje() {
  document.addEventListener('keydown', (event) => {
    if (juegoEnCurso) {
      const imagenPersonaje = document.getElementById('imagenPersonaje');

      // Detener el intervalo anterior antes de comenzar uno nuevo
      clearInterval(intervalId);

      switch (event.key) {
        case 'ArrowLeft':
          intervalId = movimiento('left', 10);
         imagenPersonaje.src = "/images/personaje/personajeIzquierda.gif";
          break;
        case 'ArrowRight':
          intervalId = movimiento('right', 10);
          imagenPersonaje.src = "/images/personaje/personajeDerecha.gif";
          break;
        case 'ArrowUp':
          intervalId = movimiento('up', 10);
          imagenPersonaje.src = "/images/personaje/personajeDetras.gif";
          break;
        case 'ArrowDown':
          intervalId = movimiento('down', 10);
          imagenPersonaje.src = "/images/personaje/personajeDelante.gif";
          break;
      }
    }
  });
}

function popupFuncion(resultado) {
  // Mostrar el pop-up
  const popup = document.getElementById('popup');
  popup.style.display = 'block';

  // Obtener el elemento de contenido del pop-up
  const popupContent = document.getElementById('popupContent');

  if (resultado === 'ganar') {
    // Mostrar el mensaje y el botón para el caso de "Ganaste"
    popupContent.innerHTML = document.getElementById('ganar').innerHTML;
  } else if (resultado === 'perder') {
    // Mostrar el mensaje y el botón para el caso de "Perdiste"
    popupContent.innerHTML = document.getElementById('perder').innerHTML;
  }

  // Agregar un evento al botón dentro del pop-up
  const botones = popupContent.querySelectorAll('button');
  botones.forEach((boton) => {
    boton.addEventListener('click', (event) => {
      const accion = event.target.getAttribute('data-action');
      if (accion === 'volver') {
        // Reiniciar el juego (recargar la página)
        location.reload();
      } else if (accion === 'reiniciar') {
        // Realizar otra acción para reiniciar si es necesario
        location.reload();
      }
    });
  });
} 


function comprobarPersonajeDentroCamino() {
  const personajeWidth = personaje.offsetWidth;
  const personajeHeight = personaje.offsetHeight;
  const leftTop = leftPos;
  const leftBottom = topPos;
  const rightTop = leftPos + personajeWidth;
  const rightBottom = topPos + personajeHeight;

  //1
  const topLeftColumn = Math.floor((leftTop - 10) / 100);
  const topLeftRow = Math.floor((leftBottom - 10) / 80);
  // //2
  const topRightColumn = Math.floor((rightTop) / 100);
  const topRightRow = Math.floor((leftBottom - 10) / 80);
  // //3
  const bottomLeftColumn = Math.floor((leftTop - 10) / 100); //lado
  const bottomLeftRow = Math.floor((rightBottom - 10) / 80); //abajo
  // //4
  const bottomRightColumn = Math.floor((rightTop - 10) / 100);
  const bottomRightRow = Math.floor((rightBottom - 10) / 80);

  //blocked si es la posición 0
  const topLeftIsBlocked = arrayCamino[topLeftRow][topLeftColumn] === 0;
  const topRightIsBlocked = arrayCamino[topRightRow][topRightColumn] === 0;
  const bottomLeftIsBlocked = arrayCamino[bottomLeftRow][bottomLeftColumn] === 0;
  const bottomRightIsBlocked = arrayCamino[bottomRightRow][bottomRightColumn] === 0;


          // Verificar si los objetos están dentro del camino
          const objetos = document.getElementById('objetos').children;
          for (const objeto of objetos) {
            const objetoLeft = parseInt(objeto.style.left);
            const objetoTop = parseInt(objeto.style.top);

            const objetoColumna = Math.floor(objetoLeft / 100);
            const objetoFila = Math.floor(objetoTop / 80);

            const objetoIsBlocked = arrayCamino[objetoFila][objetoColumna] === 0;

            if (objetoIsBlocked) {
              // Si algún objeto no está dentro del camino, vuelve a generar posiciones
              spawnObjetos();
              return;
            }
          }





  if (topLeftIsBlocked || topRightIsBlocked || bottomLeftIsBlocked || bottomRightIsBlocked) {
    clearInterval(intervalId);
    //actualiza las vidas
    vidas = vidas - 1;
    actualizarVidas();
    inicioMovimientoAutomatico();

    //restablece la posición
    leftPos = 630;
    topPos = 600;
    actualizarPosicionPersonaje();

  }

  // printea posición del personaje EN LA ARRAY
  document.getElementById('cuadrante').innerHTML =
    "cuadrante 1= [" + topLeftColumn + ", " + topLeftRow + "]    cuadrante 2= [" + topRightColumn + ", " + topRightRow + "]    cuadrante 3= [" + bottomLeftColumn + ", " + bottomLeftRow + "]    cuadrante 4= [" + bottomRightColumn + ", " + bottomRightRow + "]";
}

// function actualizarVidas() {
  
//   document.getElementById('vidas').innerHTML = "VIDAS: " + vidas ;
//   perder();
// }

// https://safeimagekit.com/   para pasar las imagenes a pixelart

// function comprobarCamino() {
//   // Calcula las coordenadas en la matriz
//   const columna = Math.floor((leftPos - 10) / 100); //math.floor redondea el número
//   const fila = Math.floor((topPos - 10) / 80);

//   // // Verifica si la posición actual en la matriz es 1 (camino válido)
//   if (arrayCamino[fila][columna] === 0) {
//     // no es una posición válida, detén el movimiento
//     clearInterval(intervalId);
//     intervalId = setInterval(() => {
//       personaje.style.top = (topPos + 10) + 'px';
//       clearInterval(intervalId);
//     },100);

//   }
//   // printea posición del personaje
//   document.getElementById('cuadrante').innerHTML = "cuadrante = [" + columna + ", " + fila + "]";
// }
// function actualizarVidas(){
//   vidas = 3;
// }

//DENTRO DE FUNCIÓN COMPROBAR CAMINO
//para saber por consola por donde se está saliendo.
// if (topLeftIsBlocked) {
//   // Personaje está saliendo por la esquina superior izquierda.
//   console.log("Personaje está saliendo por la esquina superior izquierda");
// }

// if (topRightIsBlocked) {
//   // Personaje está saliendo por la esquina superior derecha.
//   console.log("Personaje está saliendo por la esquina superior derecha");
// }

// if (bottomLeftIsBlocked) {
//   // Personaje está saliendo por la esquina inferior izquierda.
//   console.log("Personaje está saliendo por la esquina inferior izquierda");
// }

// if (bottomRightIsBlocked) {
//   // Personaje está saliendo por la esquina inferior derecha.
//   console.log("Personaje está saliendo por la esquina inferior derecha");
// }



