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
const imagenPersonaje = document.getElementById('imagenPersonaje');
let objetosBienPosicionados = true;

crearMapa();
actualizarPosicionPersonaje();
actualizarVidas();

spawnObjeto("/images/objetos/piedra.png");
spawnObjeto("/images/objetos/paloBuenoB.png");
spawnObjeto("/images/objetos/placasolarBuenaB.png");
 
inicioMovimientoAutomatico(); // que se mueva desde el principio
movimientoPersonaje();


function actualizarVidas() {
  imagenPersonaje.src = "/images/personaje/personajeDetras.gif";
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
    [1, 1, 0, 0, 1, 1, 1, 0],
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
    if (direction === 'left' && leftPos > 0) {
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


function spawnObjeto(imagenSrc) {
  const imagenObjeto = document.createElement('img');
  imagenObjeto.src = imagenSrc;

  let posicionValida = false;

  while (!posicionValida) {
    const { objetoLeft, objetoTop } = generarPosicionAleatoria();

    if (!verificarEsquinasEnCamino(objetoLeft, objetoTop, imagenObjeto)) {
      // Si la posición es válida, salir del bucle
      posicionValida = true;

      const contenedorImagen = document.createElement('div');
      contenedorImagen.style.position = 'absolute';
      contenedorImagen.style.zIndex = 3;
      contenedorImagen.style.left = objetoLeft + 'px';
      contenedorImagen.style.top = objetoTop + 'px';
      contenedorImagen.appendChild(imagenObjeto);
      game.appendChild(contenedorImagen);
    }
  }
}

function generarPosicionAleatoria() {
  const randomX = Math.floor(Math.random() * 8);
  const randomY = Math.floor(Math.random() * 8);
  const objetoLeft = randomY * 100;
  const objetoTop = randomX * 80;
  return { objetoLeft, objetoTop };
}

function verificarEsquinasEnCamino(objetoLeft, objetoTop, imagenObjeto) {
  const objetoTopLeftRow = Math.floor(objetoTop / 80);
  const objetoTopLeftColumn = Math.floor(objetoLeft / 100);

  const objetoTopRightRow = Math.floor(objetoTop / 80);
  const objetoTopRightColumn = Math.floor((objetoLeft + imagenObjeto.offsetWidth) / 100);

  const objetoBottomLeftRow = Math.floor((objetoTop + imagenObjeto.offsetHeight) / 80);
  const objetoBottomLeftColumn = Math.floor(objetoLeft / 100);

  const objetoBottomRightRow = Math.floor((objetoTop + imagenObjeto.offsetHeight) / 80);
  const objetoBottomRightColumn = Math.floor((objetoLeft + imagenObjeto.offsetWidth) / 100);

  const esquinasBloqueadas =
    arrayCamino[objetoTopLeftRow][objetoTopLeftColumn] === 0 ||
    arrayCamino[objetoTopRightRow][objetoTopRightColumn] === 0 ||
    arrayCamino[objetoBottomLeftRow][objetoBottomLeftColumn] === 0 ||
    arrayCamino[objetoBottomRightRow][objetoBottomRightColumn] === 0;

  return esquinasBloqueadas;
}



 
function movimientoPersonaje() {
  document.addEventListener('keydown', (event) => {
    if (juegoEnCurso) {

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
  juegoEnCurso = false;
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

