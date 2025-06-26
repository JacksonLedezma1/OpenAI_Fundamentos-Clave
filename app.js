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
  // Fix: select the send button inside .chatInput
  const sendBtn = document.querySelector('.chatInput button');
  const chatMessages = document.querySelector('.chatMessages');
  const sideBarButtons = document.querySelectorAll('.sideBar__button');
  const pastBtn = sideBarButtons[0];
  const newConvBtn = sideBarButtons[1];

  // Robust error handling for missing DOM elements
  if (!input || !sendBtn || !chatMessages || !pastBtn || !newConvBtn) {
    console.error('Error: One or more required DOM elements are missing:', {
      input, sendBtn, chatMessages, pastBtn, newConvBtn
    });
    return;
  }

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
    let mensajeHTML;
    let contadorHTML = '';
    // Si el mensaje contiene el contador (Pregunta #N), sepáralo
    if (autor === 'AI' && /\(Pregunta #\d+\)/.test(contenido)) {
      const match = contenido.match(/([\s\S]*?)\n*\(Pregunta #(\d+)\)\s*$/);
      if (match) {
        mensajeHTML = marked.parse(match[1].trim());
        contadorHTML = `<span class="message__contador">Pregunta #${match[2]}</span>`;
      } else {
        mensajeHTML = marked.parse(contenido);
      }
    } else if (autor === 'AI') {
      mensajeHTML = marked.parse(contenido);
    } else {
      mensajeHTML = contenido.replace(/\n/g, '<br>');
    }
    div.innerHTML = `
      <div class="upperChat">
        <img class="upperChat__userImage${autor !== 'User' ? ' upperChat__userImage--ai' : ''}"
          src="${autor === 'User' ? './assets/icons/messages/user-svgrepo-com.svg' : './assets/icons/sideBar/share-circle-svgrepo-com.svg'}" alt="" />
        <span class="upperChat__userName">${autor} says:</span>
      </div>
      <div class="message">${mensajeHTML}${contadorHTML}</div>
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
    // Mostrar mensaje de "pensando..."
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'aiChat aiChat--thinking';
    thinkingDiv.innerHTML = `
      <div class="upperChat">
        <img class="upperChat__userImage upperChat__userImage--ai"
          src="./assets/icons/sideBar/share-circle-svgrepo-com.svg" alt="" />
        <span class="upperChat__userName">AI is thinking...</span>
      </div>
      <div class="message"><span id="ai-typing">Escribiendo respuesta...</span></div>
    `;
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simular puntos suspensivos animados
    let dots = 0;
    const typingSpan = thinkingDiv.querySelector('#ai-typing');
    const typingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      typingSpan.textContent = 'Escribiendo respuesta' + '.'.repeat(dots);
    }, 500);

    obtenerRespuestaAPI(texto, function(respuesta) {
      clearInterval(typingInterval);
      if (thinkingDiv.parentNode) thinkingDiv.parentNode.removeChild(thinkingDiv);
      if (!respuesta || respuesta.trim() === '') {
        agregarMensajeAlDOM('AI', 'No se recibió respuesta de la IA. Intenta de nuevo o revisa la consola para más detalles.');
      } else {
        agregarMensaje('AI', respuesta + `\n\n(Pregunta #${num})`);
        agregarMensajeAlDOM('AI', respuesta + `\n\n(Pregunta #${num})`);
      }
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
  newConvBtn.addEventListener('click', function() {
    localStorage.removeItem('historialChat');
    chatMessages.innerHTML = '<div style="color:#888;text-align:center;margin:2em 0;">¡Empieza una nueva conversación!</div>';
  });
});

