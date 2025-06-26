
//  Modela los mensajes como objetos JS con propiedades autor, contenido y timestamp.


// Función fábrica para crear mensajes
function crearMensaje(autor, contenido) {
    if (!autor || !contenido) {
      throw new Error("El autor y el contenido son obligatorios.");
    }
    return {
      autor, 
      contenido, 
      timestamp: new Date().toISOString() 
    };
  }class Mensaje {
    constructor(autor, contenido) {
      if (!autor || !contenido) {
        throw new Error("El autor y el contenido son obligatorios.");
      }
      this.autor = autor;
      this.contenido = contenido;
      this.timestamp = new Date().toISOString();
    }
  
    formatear() {
      return `[${this.timestamp}] ${this.autor}: ${this.contenido}`;
    }
  }
  
  const mensajes = [];
  
  // Usando la función fábrica
  mensajes.push(crearMensaje("User", "Hola, ¿cómo estás?"));
  mensajes.push(crearMensaje("ChatGPT", "¡Bien! ¿Cómo puedo ayudarte hoy?"));
  
  const m = new Mensaje("User", "Esto es un mensaje con clase.");
  mensajes.push(m);
  
  // Mostrar todos los mensajes por consola
  mensajes.forEach(msg => {
    console.log(`${msg.timestamp} — ${msg.autor}: ${msg.contenido}`);
  });
  
  console.log(m.formatear());
  

// Crea un historial de conversaciones que sea un array de objetos mensaje.
// 1. Definir la estructura del mensaje
function crearMensaje(autor, contenido) {
    if (!autor || !contenido) {
      throw new Error("Autor y contenido son obligatorios.");
    }
    return {
      autor,
      contenido,
      timestamp: new Date().toISOString()
    };
  }
  
  // 2. Funciones para cargar y guardar el historial en localStorage
  function cargarHistorial() {
    const json = localStorage.getItem("historialChat");
    return json ? JSON.parse(json) : [];
  }
  
  function guardarHistorial(historial) {
    localStorage.setItem("historialChat", JSON.stringify(historial));
  }
  
  // 3. Agregar un nuevo mensaje al historial
  function agregarMensaje(autor, contenido) {
    const historial = cargarHistorial();
    const nuevoMensaje = crearMensaje(autor, contenido);
    historial.push(nuevoMensaje);
    guardarHistorial(historial);
    return nuevoMensaje;
  }
  
  // 4. Ejemplo de uso
  // Agregar algunos mensajes
  agregarMensaje("User", "¡Hola! ¿Cómo estás?");
  agregarMensaje("VirtualMac", "¡Muy bien! ¿En qué puedo ayudarte hoy?");
  
  // Cargar y mostrar el historial completo
  const historial = cargarHistorial();
  console.log("Historial completo:");
  historial.forEach(msg => {
    console.log(`[${msg.timestamp}] ${msg.autor}: ${msg.contenido}`);
  });
  
// --- Ejemplo de hoisting ---
console.log(hoistedFunction('¡Hola desde hoisting!'));
function hoistedFunction(mensaje) {
  return 'Hoisting dice: ' + mensaje;
}

// --- Closure para contar preguntas del usuario ---
function crearContadorPreguntas() {
  let contador = 0;
  return function() {
    contador++;
    return contador;
  };
}

const contarPregunta = crearContadorPreguntas();
// Ejemplo de uso:
// contarPregunta(); // 1
// contarPregunta(); // 2

// --- Callback al recibir respuesta de la API (simulado) ---
function obtenerRespuestaAPI(pregunta, callback) {
  // Simulación de respuesta asíncrona
  setTimeout(() => {
    const respuesta = `Respuesta a: ${pregunta}`;
    callback(respuesta);
  }, 500);
}

// Ejemplo de uso:
obtenerRespuestaAPI('¿Cuál es la capital de Francia?', function(respuesta) {
  console.log('Callback ejecutado antes de mostrar en el DOM:', respuesta);
  // Aquí iría el código para mostrar en el DOM
});

