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
    const user = account.getAllUsers();
    console.log(user);

    //GARANTIZAR QUE NO HAYAN CLAVES INDEFINIDAS :D
    account.cleanInvalidKeys();
    console.log(user);

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
      errorMessage.textContent = "Número guardado exitosamente.";
      window.location.href = "./code_number.html";
    });
  }

  // Lógica para la vista de código
  if (window.location.pathname.includes("code_number.html")) {
    const codeInputs = document.querySelectorAll(".code-input input");
    const numericKeys = document.querySelectorAll(".numeric-keypad .key");
    const acceptButton = document.getElementById("verify-code");
    const errorMessage = document.getElementById("error-message");

    const phoneNumber = localStorage.getItem("phoneNumber");
    const account = new Account();

    const user = account.getUser(phoneNumber);

    if (user) {
      console.log("Usuario encontrado: ", user);
    } else {
      console.log("No se encontró el usuario.");
    }
  }

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

    guardarButton.addEventListener("click", () => {
      if (
        !primerNombre.value ||
        !primerApellido.value ||
        !correo1.value ||
        !numeroIdentificacion.value
      ) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
      }

      const phoneNumber = localStorage.getItem("phoneNumber");

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

      account.saveUser(newUser);

      alert("Datos guardados exitosamente.");
      window.location.href = "./account_options.html";
    });
  }

  if (window.location.pathname.includes("creat_password.html")) {
    const account = new Account();
    const phoneNumber = localStorage.getItem("phoneNumber");

    const user = account.getUser(phoneNumber);

    if (user) {
      console.log("Usuario encontrado:", user);
    } else {
      console.log("No se encontró el usuario.");
      alert("Usuario no encontrado. Por favor, reinicia el registro.");
      return;
    }

    const pins = document.querySelectorAll(".password-inputs .pin");
    const numpad = document.querySelector(".numpad");
    const errorMessage = document.getElementById("error-message");
    const acceptButton = document.getElementById("accept-btn");

    let currentPin = "";
    const maxPinLength = pins.length;

    numpad.addEventListener("click", (event) => {
      const button = event.target;

      if (button.tagName !== "BUTTON") return;

      const value = button.getAttribute("data-value");
      const action = button.getAttribute("data-action");

      if (value && currentPin.length < maxPinLength) {
        currentPin += value;
        pins[currentPin.length - 1].value = "*";
      } else if (action === "delete" && currentPin.length > 0) {
        pins[currentPin.length - 1].value = "";
        currentPin = currentPin.slice(0, -1);
      }
    });

    acceptButton.addEventListener("click", () => {
      if (currentPin.length !== maxPinLength) {
        errorMessage.textContent =
          "Debes ingresar una contraseña de 4 dígitos.";
        errorMessage.style.display = "block";
        return;
      }

      if (!phoneNumber) {
        errorMessage.textContent = "Número de teléfono no encontrado.";
        errorMessage.style.display = "block";
        return;
      }

      if (user) {
        user.password = currentPin;
        account.saveUser(user);

        alert("Contraseña guardada exitosamente.");
        window.location.href = "../index.html";
      } else {
        errorMessage.textContent = "Usuario no encontrado.";
        errorMessage.style.display = "block";
      }
    });
  }

  const login = new Login();

  if (window.location.pathname.includes("login.html")) {
    const phoneInput = document.getElementById("phone");
    const loginButton = document.getElementById("login-btn");
    const errorMessage = document.getElementById("error-message");

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

      localStorage.setItem("currentPhoneNumber", phoneNumber);
      window.location.href = "password.html";
    });
  }

  if (window.location.pathname.includes("password.html")) {
    const user = account.getAllUsers();
    console.log(user);

    //--FORMA PARA ELIMINAR UN USUARIO DEL PROGRAMA--
    // alert("Apunto de eliminar un usuario");
    // const phoneNumber = localStorage.getItem("currentPhoneNumber");
    // console.log(`Numero a eliminar ${phoneNumber}`);
    // account.deleteUser(phoneNumber);
    // const lastUpdate = account.getAllUsers();
    // console.log(lastUpdate);

    //GARANTIZAR QUE NO HAYAN CLAVES INDEFINIDAS :D
    account.cleanInvalidKeys();

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

  //Sección del home

  if (window.location.pathname.includes("home.html")) {
    const sendButton = document.querySelector(
      ".side-item:nth-child(1) .side-btn"
    );
    const depositButton = document.querySelector(
      ".side-item:nth-child(2) .side-btn"
    );
    const transactionButton = document.querySelector(
      ".side-item:nth-child(3) .side-btn"
    );
    const withdrawButton = document.querySelector(
      ".side-item:nth-child(4) .side-btn"
    );
    const configurationButton = document.querySelector(
      ".side-item:nth-child(5) .side-btn"
    );

    // Redirecciónes
    sendButton.addEventListener("click", () => {
      window.location.href = "send.html";
    });
    depositButton.addEventListener("click", () => {
      window.location.href = "deposit.html";
    });
    transactionButton.addEventListener("click", () => {
      window.location.href = "transactions.html";
    });
    withdrawButton.addEventListener("click", () => {
      window.location.href = "withdraw.html";
    });
    configurationButton.addEventListener("click", () => {
      window.location.href = "configuration.html";
    });

    //Lógica para el nombre del header
    const phoneNumber = localStorage.getItem("currentPhoneNumber");
    const users = account.getAllUsers();
    const user = users[phoneNumber];

    const fullName = `${user.userName} ${user.surName} alias ${user.nickName}`;
    localStorage.setItem("fullName", fullName);

    const headerCenter = document.querySelector(".header-center h2");
    if (headerCenter && fullName) {
      headerCenter.textContent = `Hola, ${fullName}!`;
    }

    // Obtener el balance almacenado en localStorage y mostrarlo
    const currentBalance =
      localStorage.getItem(phoneNumber + "userBalance") || user.amount;

    const balanceElement = document.querySelector(".balance-card .amount");
    if (balanceElement) {
      balanceElement.textContent = `$ ${parseFloat(currentBalance).toFixed(2)}`;
    }
  }

  //Vista de la función enviar
  if (window.location.pathname.includes("send.html")) {
    const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const account = new Account();
    const users = account.getAllUsers(); // Obtén todos los usuarios
    const sender = users[currentPhoneNumber]; // Usuario actual (quien envía el dinero)

    const sendForm = document.getElementById("send-form");
    const recipientPhoneNumberInput = document.getElementById("phone-number");
    const amountInput = document.getElementById("amount");

    // Manejo del evento de envío del formulario
    sendForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const recipientPhoneNumber = recipientPhoneNumberInput.value.trim();
      const sendAmount = parseFloat(amountInput.value);

      // Verificar que el destinatario exista
      if (!users[recipientPhoneNumber]) {
        alert("El número ingresado no pertenece a ningún usuario registrado.");
        return;
      }

      // Verificar que el monto sea válido
      if (isNaN(sendAmount) || sendAmount <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
      }

      // Verificar que el usuario tenga suficiente saldo
      if (sender.amount < sendAmount) {
        alert("No tienes suficiente saldo para enviar esta cantidad.");
        return;
      }

      // Actualizar los saldos
      sender.amount -= sendAmount; // Restar el monto al remitente
      const recipient = users[recipientPhoneNumber];
      recipient.amount += sendAmount; // Sumar el monto al destinatario

      // Guardar los cambios en el almacenamiento local
      account.saveUser(sender);
      // Actualizar el balance en el home
      localStorage.setItem(
        currentPhoneNumber + "userBalance",
        sender.amount.toFixed(2)
      );
      account.saveUser(recipient);

      localStorage.setItem(
        recipientPhoneNumber + "userBalance",
        recipient.amount.toFixed(2)
      );

      // Mensaje de éxito
      alert(`Has enviado $${sendAmount.toFixed(2)} a ${recipientPhoneNumber}.`);
      window.location.href = "home.html"; // Redirigir al home
    });
  }

  //Vista del deposito
  if (window.location.pathname.includes("deposit.html")) {
    const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const account = new Account();
    const users = account.getAllUsers(); // Obtén todos los usuarios
    const user = users[currentPhoneNumber]; // Busca al usuario usando el número de teléfono

    const depositForm = document.getElementById("deposit-form");
    const phoneNumberInput = document.getElementById("phone-number");
    const amountInput = document.getElementById("amount");

    // Manejo del evento de envío del formulario
    depositForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const enteredPhoneNumber = phoneNumberInput.value;
      const depositAmount = parseFloat(amountInput.value);

      if (enteredPhoneNumber === currentPhoneNumber) {
        // Si el número es correcto, actualizamos el balance
        user.amount += depositAmount; // Actualiza el saldo directamente en el objeto usuario
        account.saveUser(user); // Guarda los cambios del usuario con el nuevo saldo

        // Actualizamos el balance en el home
        localStorage.setItem(
          currentPhoneNumber + "userBalance",
          user.amount.toFixed(2)
        );

        // Mensaje de éxito
        alert("Depósito realizado con éxito");
        window.location.href = "home.html"; // Redirigimos al home
      } else {
        alert("El número ingresado no coincide con el número actual");
      }
    });
  }

  // Lógica para la vista de configuración
  if (window.location.pathname.includes("configuration.html")) {
    const phoneNumber = localStorage.getItem("currentPhoneNumber");

    if (!phoneNumber) {
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "No se encontró un usuario activo. Por favor, inicia sesión.";
      document.body.appendChild(errorMessage);
      return;
    }

    const user = account.getUser(phoneNumber);

    if (!user) {
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Usuario no encontrado. Por favor, reinicia el registro.";
      document.body.appendChild(errorMessage);
      return;
    }

    // Referencias a los campos del formulario
    const firstNameInput = document.getElementById("first-name");
    const secondNameInput = document.getElementById("middle-name");
    const firstSurnameInput = document.getElementById("last-name");
    const secondSurnameInput = document.getElementById("second-last-name");
    const nicknameInput = document.getElementById("nickname");
    const emailInputs = document.querySelectorAll("input[type='email']");
    const saveMessage = document.createElement("p");
    saveMessage.className = "save-message";
    document.querySelector("footer").appendChild(saveMessage);

    // Cargar los datos del usuario
    firstNameInput.value = user.userName || "";
    secondNameInput.value = user.middleName || "";
    firstSurnameInput.value = user.surName || "";
    secondSurnameInput.value = user.surName2 || "";
    nicknameInput.value = user.nickName || "";
    emailInputs[0].value = user.email || "";
    emailInputs[1].value = user.email || "";

    // Guardar cambios al usuario
    const saveButton = document.getElementById("save-btn");
    saveButton.addEventListener("click", () => {
      const updatedData = {
        userName: firstNameInput.value.trim(),
        middleName: secondNameInput.value.trim(),
        surName: firstSurnameInput.value.trim(),
        surName2: secondSurnameInput.value.trim(),
        nickName: nicknameInput.value.trim(),
        email: emailInputs[0].value.trim(),
      };

      // Verificar si hay cambios
      const isDataChanged =
        updatedData.nickName !== user.nickName ||
        updatedData.email !== user.email;

      if (isDataChanged) {
        account.updateUser(phoneNumber, updatedData);
        saveMessage.textContent = "Cambios guardados exitosamente.";
        saveMessage.style.display = "block";
        saveMessage.classList.add("success");
      } else {
        saveMessage.textContent = "No hay cambios para guardar.";
        saveMessage.style.display = "block";
        saveMessage.classList.add("info");
      }

      setTimeout(() => {
        saveMessage.style.display = "none";
      }, 3000);
    });

    // ---- Lógica para el botón Bloquear Nequi ----
    const blockButton = document.querySelector(".block-btn");

    blockButton.addEventListener("click", () => {
      const modalContainer = document.createElement("div");
      modalContainer.classList.add("modal-container");

      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");

      const modalMessage = document.createElement("p");
      modalMessage.textContent =
        "¿Estás seguro de que deseas bloquear tu cuenta? Si la bloqueas, deberás crear una nueva cuenta.";

      const confirmButton = document.createElement("button");
      confirmButton.textContent = "Sí, bloquear cuenta";
      confirmButton.classList.add("confirm-btn");

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "No, cancelar";
      cancelButton.classList.add("cancel-btn");

      modalContent.appendChild(modalMessage);
      modalContent.appendChild(confirmButton);
      modalContent.appendChild(cancelButton);
      modalContainer.appendChild(modalContent);
      document.body.appendChild(modalContainer);

      confirmButton.addEventListener("click", () => {
        account.deleteUser(phoneNumber);
        localStorage.removeItem("currentPhoneNumber");
        saveMessage.textContent = "Tu cuenta ha sido bloqueada exitosamente.";
        saveMessage.style.display = "block";
        document.body.removeChild(modalContainer);
        setTimeout(() => {
          window.location.href = "../index.html"; //CAMBIAR
        }, 2000);
      });

      cancelButton.addEventListener("click", () => {
        document.body.removeChild(modalContainer);
      });
    });

    // ---- NUEVA LÓGICA PARA CAMBIO DE CONTRASEÑA ----
    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const changePasswordButton = document.getElementById("change-password-btn");
    const passwordMessage = document.getElementById("password-message");

    // Validar solo números en los campos de contraseña
    const restrictToNumbers = (input) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
      });
    };

    restrictToNumbers(currentPasswordInput);
    restrictToNumbers(newPasswordInput);

    changePasswordButton.addEventListener("click", () => {
      const currentPassword = currentPasswordInput.value.trim();
      const newPassword = newPasswordInput.value.trim();

      // Limpiar mensaje anterior
      passwordMessage.textContent = "";
      passwordMessage.style.display = "none";

      if (currentPassword !== user.password) {
        passwordMessage.textContent = "Clave actual incorrecta.";
        passwordMessage.style.color = "#ff0000"; // Color rojo para error
        passwordMessage.style.display = "block";
        return;
      }

      if (newPassword.length !== 4 || isNaN(newPassword)) {
        passwordMessage.textContent =
          "La nueva clave debe ser un número de 4 dígitos.";
        passwordMessage.style.color = "#ff0000";
        passwordMessage.style.display = "block";
        return;
      }

      // Actualizar la contraseña
      user.password = newPassword;
      account.updateUser(phoneNumber, user);

      passwordMessage.textContent = "Clave cambiada con éxito.";
      passwordMessage.style.color = "#2d7a2d"; // Color verde para éxito
      passwordMessage.style.display = "block";

      // Limpiar campos
      currentPasswordInput.value = "";
      newPasswordInput.value = "";
    });
  }
});
