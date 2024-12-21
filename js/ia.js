// IA.js - Clase que maneja las interacciones con la IA

export default class IA {
  constructor() {
    this.temasPermitidos = [
      "finanzas",
      "presupuesto",
      "ahorros",
      "servicios públicos",
      "crédito",
      "inversiones",
      "deuda",
      "hipoteca",
      "gastos",
      "ingresos",
      "dinero",
      "bancos",
      "cuentas",
      "tarjetas",
      "pagar",
      "préstamos",
      "saldo",
      "ahorrar",
      "capital",
      "consumo",
      "impuestos",
      "planificación",
      "seguros",
      "liquidez",
      "gestión financiera",
      "pagos",
      "fondos",
      "economizar",
      "costos",
      "transferencias",
      "dinero electrónico",
      "intereses",
      "cotizaciones",
      "divisas",
      "seguridad financiera",
      "fondos de emergencia",
      "educación financiera",
      "renta",
      "bonos",
      "acciones",
      "patrimonio",
      "mercados financieros",
      "créditos hipotecarios",
      "préstamos personales",
      "inversión a plazo fijo",
      "ahorros para retiro",
      "retorno de inversión",
      "planificación fiscal",
      "capitalización",
      "inversionistas",
      "monedas",
      "criptomonedas",
      "riesgos financieros",
      "tarjetas de débito",
      "tarjetas de crédito",
      "saldo disponible",
      "ahorro mensual",
      "flujo de efectivo",
      "objetivos financieros",
      "reserva de emergencia",
      "estrategias de ahorro",
      "plan de ahorro",
      "análisis de gastos",
      "rentabilidad",
      "tasas de interés",
      "gestión de deudas",
      "estado financiero",
      "eficiencia económica",
      "seguimiento de presupuesto",
      "educación económica",
      "ahorro en familia",
      "finanzas personales",
      "cálculo financiero",
      "planificación de patrimonio",
      "reducción de gastos",
    ];

    this.mensajesFueraDeContexto = [
      "Hmm, eso no está dentro de mis habilidades. ¿Por qué no preguntas algo sobre finanzas? 😊",
      "Lo siento, no puedo ayudarte con eso. Por favor, pregunta sobre servicios o presupuesto.",
      "Este tema está fuera de mi alcance. Intenta con algo relacionado a finanzas o ahorros. ¡Estoy aquí para ayudarte en eso! 😘",
    ];

    this.respuestasPersonalizadas = {
      nequi:
        "Aunque no pueda acceder a tus datos personales, te recomiendo explorar secciones importantes de Nequi, como 'Enviar' para transferir dinero fácilmente, 'Recargar' para recargar tu saldo y 'Ahorrar' para alcanzar tus metas. ¡Todo a un toque de distancia! 😊",
      enviar:
        "En Nequi, la función 'Enviar' te permite transferir dinero con solo un toque. ¡Es rápido y súper sencillo! ✨",
      recargar:
        "La función 'Recargar' en Nequi es perfecta para cargar saldo a tu cuenta o teléfono de manera fácil y rápida. ¡No te quedes sin saldo! 🔋",
      ahorrar:
        "¿Sabías que con la función 'Ahorrar' de Nequi puedes crear metas de ahorro y cumplirlas más rápido? ¡Un paso hacia tus sueños! 🏆",
    };
  }

  // Función para validar si el tema está permitido
  validarTema(textIngresado) {
    const textoNormalizado = textIngresado.toLowerCase().trim(); // Normalizar texto
    return this.temasPermitidos.some((tema) =>
      textoNormalizado.includes(tema.toLowerCase())
    );
  }

  // Función para obtener un mensaje aleatorio fuera de contexto
  obtenerMensajeFueraDeContexto() {
    const index = Math.floor(
      Math.random() * this.mensajesFueraDeContexto.length
    );
    return this.mensajesFueraDeContexto[index];
  }

  // Función para verificar si hay una palabra clave específica para respuesta personalizada
  verificarRespuestaPersonalizada(textIngresado) {
    const textoNormalizado = textIngresado.toLowerCase().trim();
    const palabraClave = Object.keys(this.respuestasPersonalizadas).find(
      (clave) => textoNormalizado.includes(clave.toLowerCase())
    );

    return palabraClave ? this.respuestasPersonalizadas[palabraClave] : null;
  }

  // Función para llamar a la API Gemini
  llamarGemini(textIngresado) {
    const API_KEY = "AIzaSyBCvWe2r9OkL1Jc6XesDyyGWnVlKFFTuM4";
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Verificar si el mensaje requiere una respuesta personalizada
    const respuestaPersonalizada =
      this.verificarRespuestaPersonalizada(textIngresado);
    if (respuestaPersonalizada) {
      return Promise.resolve(respuestaPersonalizada);
    }

    // Validar el tema antes de hacer la petición
    if (!this.validarTema(textIngresado)) {
      return Promise.resolve(this.obtenerMensajeFueraDeContexto());
    }

    return fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: textIngresado }],
          },
        ],
      }),
    })
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        return respuesta.json();
      })
      .then((datos) => {
        const textoGenerado = datos.candidates[0].content.parts[0].text;

        // Limitar el texto a 200 caracteres
        const respuestaCorta =
          textoGenerado.length > 200
            ? textoGenerado.slice(0, 200) + "..."
            : textoGenerado;

        return respuestaCorta;
      })
      .catch((error) => {
        console.error("Error al llamar a la API de Gemini:", error);
        return "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo más tarde.";
      });
  }

  // Función para interactuar con el usuario (puedes llamarla desde main.js)
  interactuarConUsuario(textIngresado) {
    return this.llamarGemini(textIngresado).then((respuesta) => {
      return respuesta;
    });
  }
}
