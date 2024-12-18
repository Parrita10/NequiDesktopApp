import Account from "./account.js";
import User from "./user.js";
import Login from "./login.js";

document.addEventListener("DOMContentLoaded", () => {
  const account = new Account(); // Instancia de Account

  // Lógica para la vista de registro
  if (window.location.pathname.includes("register.html")) {
    const sendCodeButton = document.getElementById("send-code");
    const phoneNumberInput = document.getElementById("phone-number");
    const errorMessage = document.getElementById("error-message");

    sendCodeButton.addEventListener("click", () => {
      const phoneValue = phoneNumberInput.value.trim();

      // Validaciones
      if (!phoneValue) {
        errorMessage.textContent = "Debes ingresar un número de celular.";
        return;
      }

      if (
        phoneValue.length !== 10 ||
        isNaN(phoneValue) ||
        !phoneValue.startsWith("3")
      ) {
        errorMessage.textContent =
          "Número de teléfono no válido. Debe contener 10 dígitos y comenzar con 3.";
        return;
      }

      if (account.userExists(phoneValue)) {
        errorMessage.textContent = "El número de teléfono ya está registrado.";
        return;
      }

      // Crear usuario y guardarlo
      const newUser = new User(phoneValue);
      account.saveUser(newUser);

      localStorage.setItem("phoneNumber", phoneValue); // Guardar número en LocalStorage
      alert("Número guardado exitosamente.");
      //localStorage.clear();
      //alert("Todo eliminado")
      // Redirección
      window.location.href = "./code_number.html";
    });
  }

  // Lógica para la vista de código
  if (window.location.pathname.includes("code_number.html")) {
    const codeInputs = document.querySelectorAll(".code-input input");
    const numericKeys = document.querySelectorAll(".numeric-keypad .key");
    const acceptButton = document.getElementById("verify-code");
    const errorMessage = document.getElementById("error-message");

    //VALIDO QUE SI RECIBA EL NUMERO GURDADO :D
    const phoneNumber = localStorage.getItem("phoneNumber");
    const account = new Account();

    const user = account.getUser(phoneNumber);

    if (user) {
      console.log("Usuario encontrado: ", user);
    } else {
      console.log("No se encontró el usuario.");
    }
  }

  //LÓGICA PARA EL ENVIO DEL CORREO MANEJADA ESTÁ EN EL HTML.

  // Lógica para la vista de Personal info
  if (window.location.pathname.includes("personal_info.html")) {
    const primerNombre = document.querySelector(
      'input[placeholder="Primer nombre"]'
    );
    const segundoNombre = document.querySelector(
      'input[placeholder="Segundo nombre (opcional)"]'
    );
    const primerApellido = document.querySelector(
      'input[placeholder="Primer apellido"]'
    );
    const segundoApellido = document.querySelector(
      'input[placeholder="Segundo apellido (Opcional)"]'
    );
    const nickname = document.querySelector("#nombre-usuario");
    const residencia = document.querySelector("#residencia");
    const correo1 = document.querySelector(
      'input[type="email"]:nth-of-type(1)'
    );
    const correo2 = document.querySelector(
      'input[type="email"]:nth-of-type(2)'
    );
    const numeroIdentificacion = document.querySelector('input[type="text"]');

    const guardarButton = document.querySelector(".button");

    // Evento al hacer clic en el botón "Guardar"
    guardarButton.addEventListener("click", () => {
      // Validar campos obligatorios
      if (
        !primerNombre.value ||
        !primerApellido.value ||
        !correo1.value ||
        !numeroIdentificacion.value
      ) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
      }

      // Crear el nuevo objeto User con los datos
      const phoneNumber = localStorage.getItem("phoneNumber"); // Obtener el número de teléfono guardado

      const newUser = new User(
        primerNombre.value,
        segundoNombre.value,
        primerApellido.value,
        segundoApellido.value,
        nickname.value,
        residencia.value,
        correo1.value,
        numeroIdentificacion.value,
        phoneNumber
      );

      // Guardar el nuevo usuario
      account.saveUser(newUser);

      // Guardar datos adicionales en el localStorage si es necesario
      localStorage.setItem("primerNombre", primerNombre.value);
      localStorage.setItem("segundoNombre", segundoNombre.value);
      localStorage.setItem("primerApellido", primerApellido.value);
      localStorage.setItem("segundoApellido", segundoApellido.value);
      localStorage.setItem("nickname", nickname.value);
      localStorage.setItem("residencia", residencia.value);
      localStorage.setItem("correo1", correo1.value);
      localStorage.setItem("correo2", correo2.value);
      localStorage.setItem("numeroIdentificacion", numeroIdentificacion.value);

      alert("Datos guardados exitosamente.");

      // Redirección
      window.location.href = "./creat_password.html";
    });
  }

  if (window.location.pathname.includes("creat_password.html")) {
    const account = new Account();
    const phoneNumber = localStorage.getItem("phoneNumber");

    const user = account.getUser(phoneNumber);
    //lo uso para validar, no me juzguen
    if (user) {
      console.log("Usuario encontrado:", user);
    } else {
      console.log("No se encontró el usuario.");
      alert("Usuario no encontrado. Por favor, reinicia el registro.");
      return;
    }

    // Elementos del DOM
    const pins = document.querySelectorAll(".password-inputs .pin");
    const numpad = document.querySelector(".numpad");
    const errorMessage = document.getElementById("error-message");
    const acceptButton = document.getElementById("accept-btn");

    let currentPin = "";
    const maxPinLength = pins.length;

    // Evento: captura los clics en el teclado numérico
    numpad.addEventListener("click", (event) => {
      const button = event.target;

      // Verifica si el elemento clicado es un botón válido
      if (button.tagName !== "BUTTON") return;

      const value = button.getAttribute("data-value"); // Número ingresado
      const action = button.getAttribute("data-action"); // Acción

      if (value && currentPin.length < maxPinLength) {
        // Si es un número y hay espacio en la contraseña
        currentPin += value;
        pins[currentPin.length - 1].value = "*"; // Muestra un asterisco
      } else if (action === "delete" && currentPin.length > 0) {
        // Si es la acción de borrar
        pins[currentPin.length - 1].value = "";
        currentPin = currentPin.slice(0, -1);
      }
    });

    // Evento: al hacer clic en el botón "Aceptar"
    acceptButton.addEventListener("click", () => {
      if (currentPin.length !== maxPinLength) {
        errorMessage.textContent =
          "Debes ingresar una contraseña de 4 dígitos.";
        errorMessage.style.display = "block";
        return;
      }

      // Verificar si el número de teléfono existe
      if (!phoneNumber) {
        errorMessage.textContent = "Número de teléfono no encontrado.";
        errorMessage.style.display = "block";
        return;
      }

      // Guardar la contraseña al usuario encontrado
      if (user) {
        user.password = currentPin;
        account.saveUser(user);

        alert("Contraseña guardada exitosamente.");
        window.location.href = "../index.html"; // Redirigir al inicio
      } else {
        errorMessage.textContent = "Usuario no encontrado.";
        errorMessage.style.display = "block";
      }
    });
  }

  //PARTE DEL LOGINx

  const login = new Login();

  // --- LOGIN.HTML: Validar número de teléfono ---
  if (window.location.pathname.includes("login.html")) {
    const phoneInput = document.getElementById("phone"); // Input del número de teléfono
    const loginButton = document.getElementById("login-btn"); // Botón para continuar
    const errorMessage = document.getElementById("error-message"); // Mensaje de error

    loginButton.addEventListener("click", () => {
      const phoneNumber = phoneInput.value.trim();

      if (!phoneNumber) {
        errorMessage.textContent = "Por favor, ingrese un número de teléfono.";
        errorMessage.style.display = "block";
        return;
      }

      if (!login.validatePhone(phoneNumber)) {
        errorMessage.textContent =
          "Número no válido o no registrado. Verifica e intenta de nuevo.";
        errorMessage.style.display = "block";
        return;
      }

      // Guardar temporalmente el número en localStorage para usarlo en el próximo paso
      localStorage.setItem("currentPhoneNumber", phoneNumber);
      window.location.href = "password.html";
    });
  }

  // --- PASSWORD.HTML: Validar contraseña ---
  if (window.location.pathname.includes("password.html")) {
    const savedPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const passwordInputs = document.querySelectorAll(".pin");
    const numpadButtons = document.querySelectorAll(".numpad button");
    const errorMessage = document.getElementById("error-message");
    const acceptButton = document.getElementById("accept-btn");

    if (!savedPhoneNumber) {
      window.location.href = "login.html";
      return;
    }

    let enteredPassword = "";

    // Lógica para los botones del teclado numérico
    numpadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.textContent;

        if (
          !button.classList.contains("delete") &&
          enteredPassword.length < 4
        ) {
          enteredPassword += value;
          passwordInputs[enteredPassword.length - 1].value = "*";
        }

        if (button.classList.contains("delete") && enteredPassword.length > 0) {
          passwordInputs[enteredPassword.length - 1].value = "";
          enteredPassword = enteredPassword.slice(0, -1);
        }
      });
    });

    acceptButton.addEventListener("click", () => {
      if (login.validatePassword(savedPhoneNumber, enteredPassword)) {
        alert("Inicio de sesión exitoso.");
        const currentUser = login.getCurrentUser(savedPhoneNumber);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.location.href = "home.html";
      } else {
        errorMessage.textContent = "Contraseña incorrecta. Intenta de nuevo.";
        errorMessage.style.display = "block";

        enteredPassword = "";
        passwordInputs.forEach((input) => {
          input.value = "";
        });
      }
    });
  }
});
