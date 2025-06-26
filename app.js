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

// --- Callback al recibir respuesta de la API (OpenAI real) ---
async function obtenerRespuestaAPI(pregunta, callback) {
  if (typeof OPENAI_API_KEY === 'undefined') {
    callback('No se encontró la clave de API.');
    return;
  }
  const apiKey = OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const body = JSON.stringify({
    model: 'gpt-4.1',
    messages: [
      { role: 'system', content: 'Eres un asistente útil.' },
      { role: 'user', content: pregunta }
    ]
  });
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body
    });
    if (!response.ok) throw new Error('Error en la API');
    const data = await response.json();
    const respuesta = data.choices[0].message.content;
    callback(respuesta);
  } catch (e) {
    callback('Error al conectar con OpenAI.');
  }
}

// --- Lógica para el chat interactivo en el DOM ---
document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector('.chatInput__input');
  const sendBtn = document.querySelector('.chatInput button');
  const chatMessages = document.querySelector('.chatMessages');
  // Selección de los botones ya existentes en el HTML
  const sideBarButtons = document.querySelectorAll('.sideBar__button');
  const pastBtn = sideBarButtons[0];
  const newConvBtn = sideBarButtons[1];

  // Al recargar, limpiar historial
  localStorage.removeItem('historialChat');

  // Mostrar historial solo cuando se pulse el botón
  function mostrarHistorial() {
    chatMessages.innerHTML = '';
    const historial = cargarHistorial();
    if (historial.length === 0) {
      chatMessages.innerHTML = '<div style="color:#888;text-align:center;margin:2em 0;">No hay conversaciones previas.</div>';
      return;
    }
    historial.forEach(msg => {
      agregarMensajeAlDOM(msg.autor, msg.contenido);
    });
  }

  // Agrega un mensaje al DOM
  function agregarMensajeAlDOM(autor, contenido) {
    const div = document.createElement('div');
    div.className = autor === 'User' ? 'userChat' : 'aiChat';
    div.innerHTML = `
      <div class="upperChat">
        <img class="upperChat__userImage${autor !== 'User' ? ' upperChat__userImage--ai' : ''}"
          src="${autor === 'User' ? './assets/icons/messages/user-svgrepo-com.svg' : './assets/icons/sideBar/share-circle-svgrepo-com.svg'}" alt="" />
        <span class="upperChat__userName">${autor} says:</span>
      </div>
      <div class="message">${contenido}</div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Enviar mensaje
  function enviarMensaje() {
    const texto = input.value.trim();
    if (!texto) return;
    const num = contarPregunta();
    agregarMensaje('User', texto);
    agregarMensajeAlDOM('User', texto);
    input.value = '';
    obtenerRespuestaAPI(texto, function(respuesta) {
      agregarMensaje('AI', respuesta);
      agregarMensajeAlDOM('AI', respuesta + ` <span style='font-size:0.8em;color:#888;'>(Pregunta #${num})</span>`);
    });
  }

  sendBtn.addEventListener('click', enviarMensaje);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') enviarMensaje();
  });

  // Al cargar, NO mostrar historial
  chatMessages.innerHTML = '<div style="color:#888;text-align:center;margin:2em 0;">¡Empieza una nueva conversación!</div>';

  // Mostrar historial solo al pulsar el botón
  pastBtn.addEventListener('click', mostrarHistorial);

  // Nueva conversación: limpia mensajes y localStorage
  newConvBtn.addEventListener('click', function() {
    localStorage.removeItem('historialChat');
    chatMessages.innerHTML = '<div style="color:#888;text-align:center;margin:2em 0;">¡Empieza una nueva conversación!</div>';
  });
});

