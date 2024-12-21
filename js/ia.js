alert("Tas en la pagina de la IA");

function llamarGemini(prompt) {
  const API_KEY = "AIzaSyBCvWe2r9OkL1Jc6XesDyyGWnVlKFFTuM4";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY${API_KEY}`;

  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
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

      console.log(textoGenerado);
      return textoGenerado;
    })
    .catch((error) => {
      console.error("Error al llamar a la API de Gemini:", error);
    });
}

llamarGemini(`Analiza los siguientes salarios y responde con el nombre del departamento qué más gasto en nómina genera a la empresa:

Departamento de Ventas:

Agente de Ventas Junior: $2,500,000
Agente de Ventas Mid-Level: $4,000,000
Representante de Ventas Senior: $6,000,000
Gerente de Ventas: $8,500,000
Director Comercial: $15,000,000

Departamento de Recursos Humanos:

Analista de RH Junior: $3,000,000
Especialista en Reclutamiento: $4,500,000
Analista de RH Senior: $6,000,000
Gerente de Recursos Humanos: $9,000,000
Director de Talento Humano: $12,000,000

Departamento de Marketing:

Asistente de Marketing: $2,800,000
Especialista en Marketing Digital: $4,500,000
Estratega de Marketing Senior: $7,000,000
Gerente de Marketing: $9,500,000
Director de Marketing: $13,000,000

Departamento de Soporte Técnico:

Soporte Técnico Nivel 1: $2,500,000
Soporte Técnico Nivel 2: $4,000,000
Especialista en Soporte Senior: $6,000,000
Líder de Soporte Técnico: $8,000,000
Gerente de Soporte: $10,000,000`).then((respuesta) => {
  if (respuesta) {
  }
});
