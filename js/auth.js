// Datos quemados para pruebas

//AQUI ES DONDE DEBO PONER LA LOGICA IMPLEMENTADA EN EL USER PARA CREAR USUARIOS, AQUI SE REFLEJAN LOS USUARIOS 
//GUARDADOS AHÍ
const registeredUsers = [
  { phone: "3001234567", password: "1234" },
  { phone: "3109876543", password: "5678" }
];

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  // Lógica para la vista de login.html
  if (window.location.pathname.includes("login.html")) {
    const loginButton = document.getElementById("login-btn");
    const phoneInput = document.getElementById("phone");
    const errorMessage = document.getElementById("error-message");

    loginButton.addEventListener("click", () => {
      const phoneValue = phoneInput.value.trim();

      if (!phoneValue) {
        errorMessage.textContent = "Por favor, ingrese un número de teléfono.";
        errorMessage.style.display = "block";
        return;
      }

      if (phoneValue.length !== 10 || isNaN(phoneValue)) {
        errorMessage.textContent = "Número de teléfono no válido. Debe contener 10 dígitos.";
        errorMessage.style.display = "block";
        return;
      }

      const user = registeredUsers.find(user => user.phone === phoneValue);
      if (!user) {
        errorMessage.textContent = "Número no registrado.";
        errorMessage.style.display = "block";
        return;
      }

      // Usuario encontrado, redirigir a password.html
      currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location.href = "password.html";
    });
  }

  // Lógica para la vista de password.html
  if (window.location.pathname.includes("password.html")) {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    const passwordInputs = document.querySelectorAll(".pin");
    const numpadButtons = document.querySelectorAll(".numpad button");
    const errorMessage = document.getElementById("error-message");
    const acceptButton = document.getElementById("accept-btn");

    if (!savedUser) {
      window.location.href = "login.html";
      return;
    }

    let enteredPassword = "";

    numpadButtons.forEach(button => {
      button.addEventListener("click", () => {
        const value = button.textContent;

        if (!button.classList.contains("delete") && enteredPassword.length < 4) {
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
      if (enteredPassword === savedUser.password) {
        window.location.href = "home.html";
      } else {
        errorMessage.textContent = "Contraseña incorrecta";
        errorMessage.style.display = "block";
        enteredPassword = "";
        passwordInputs.forEach(input => {
          input.value = "";
        });
      }
    });
  }

  // Lógica para la vista de register.html
  if (window.location.pathname.includes("register.html")) {
    const sendCodeButton = document.getElementById("send-code");
    const phoneNumberInput = document.getElementById("phone-number");
    const errorMessage = document.getElementById("error-message");

    sendCodeButton.addEventListener("click", () => {
      const phoneValue = phoneNumberInput.value.trim();

      // Validación del número de celular
      if (!phoneValue) {
        errorMessage.textContent = "Debes ingresar un número de celular.";
        errorMessage.style.display = "block";
        return;
      }

      if (phoneValue.length !== 10 || isNaN(phoneValue)) {
        errorMessage.textContent = "Número de teléfono no válido. Debe contener 10 dígitos.";
        errorMessage.style.display = "block";
        return;
      }

      // Redirección si la validación es exitosa
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
      window.location.href = "./code_number.html";
    });
  }

  // Lógica para la vista de code_number.html
  if (window.location.pathname.includes("code_number.html")) {
    const codeInputs = document.querySelectorAll(".code-input input");
    const numericKeys = document.querySelectorAll(".numeric-keypad .key");
    const acceptButton = document.getElementById("verify-code");
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";
    errorMessage.style.marginTop = "10px";
    errorMessage.id = "error-message";

    document.querySelector(".card").appendChild(errorMessage);

    let currentInputIndex = 0;

    // Función para escribir números en las casillas
    function updateInput(index, value) {
      codeInputs[index].value = value;
    }

    // Validación: solo aceptar números en los inputs
    codeInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        if (!/^[0-9]$/.test(e.data)) { // Solo números
          input.value = "";
        }
      });
    });

    // Manejo de eventos en botones numéricos
    numericKeys.forEach((key) => {
      key.addEventListener("click", () => {
        const value = key.textContent;

        if (!key.classList.contains("delete") && currentInputIndex < codeInputs.length) {
          updateInput(currentInputIndex, value);
          currentInputIndex++;
        }

        if (key.classList.contains("delete") && currentInputIndex > 0) {
          currentInputIndex--;
          updateInput(currentInputIndex, "");
        }
      });
    });

    // Validación al hacer clic en "Aceptar"
    acceptButton.addEventListener("click", () => {
      const enteredCode = Array.from(codeInputs).map(input => input.value.trim()).join("");

      if (enteredCode === "") {
        errorMessage.textContent = "Debes ingresar el código que te enviamos.";
        return;
      }

      if (enteredCode.length < 4) {
        errorMessage.textContent = "Debes ingresar el código completo.";
        return;
      }

      // Redirección si el código tiene 4 dígitos completos
      window.location.href = "account_options.html";
    });
  }
});
