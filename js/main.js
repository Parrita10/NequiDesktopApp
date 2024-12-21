import Account from "./account.js";
import User from "./user.js";
import Login from "./login.js";
import IA from "./ia.js";

document.addEventListener("DOMContentLoaded", () => {
  const account = new Account();
  const login = new Login();
  const ia = new IA();

  //ACCIONES

// Enviar
if (window.location.pathname.includes("send.html")) {
  const sendForm = document.getElementById("send-form");
  const recipientPhoneNumberInput = document.getElementById("phone-number");
  const amountInput = document.getElementById("amount");
  const messageInput = document.getElementById("message"); // Campo para el mensaje
  const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
  const user = account.getUser(currentPhoneNumber);

  if (!user) {
    alert("Por favor, inicia sesión.");
    window.location.href = "login.html";
    return;
  }

  // Validar que el número de celular inicie con "3" y tenga máximo 10 dígitos
  recipientPhoneNumberInput.addEventListener("input", (e) => {
    // Eliminar cualquier carácter no numérico
    let value = recipientPhoneNumberInput.value.replace(/[^0-9]/g, "");
    
    // Limitar a 10 dígitos
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    // Validar que inicie por "3"
    if (value && value[0] !== "3") {
      alert("El número de celular debe iniciar con '3'.");
      value = ""; // Limpiar el campo si no cumple
    }
    
    recipientPhoneNumberInput.value = value;
  });

  // Formatear el campo "¿Cuánto?" como pesos colombianos
  amountInput.addEventListener("input", (e) => {
    // Eliminar cualquier carácter no numérico
    let value = amountInput.value.replace(/\D/g, "");
    
    // Aplicar formato de pesos colombianos
    const formatter = new Intl.NumberFormat("es-CO");
    amountInput.value = formatter.format(value);
  });

  sendForm.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const recipientPhoneNumber = recipientPhoneNumberInput.value.trim();
    const rawAmount = amountInput.value.replace(/\D/g, ""); // Eliminar formato para procesar
    const amount = parseInt(rawAmount, 10);
    const message = messageInput.value.trim(); // Captura el mensaje
  
    const messageContainer = document.getElementById("message-container");
  
    // Función para mostrar mensajes
    const showMessage = (text, type) => {
      messageContainer.textContent = text;
      messageContainer.className = `message-container ${type}`;
      messageContainer.style.display = "block";
    };
  
    // Validaciones
    if (!recipientPhoneNumber || recipientPhoneNumber.length !== 10) {
      showMessage("Por favor, ingresa un número de celular válido (10 dígitos y debe iniciar con '3').", "error");
      return;
    }
  
    if (recipientPhoneNumber === currentPhoneNumber) {
      showMessage("No puedes enviar dinero a tu propio número.", "error");
      return;
    }
  
    if (!account.userExists(recipientPhoneNumber)) {
      showMessage("El número ingresado no pertenece a ningún usuario registrado.", "error");
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      showMessage("Por favor, ingresa un monto válido.", "error");
      return;
    }
  
    if (user.amount < amount) {
      showMessage("Saldo insuficiente. No puedes realizar esta transferencia.", "error");
      return;
    }
  
    // Procesar la transferencia
    const recipient = account.getUser(recipientPhoneNumber);
    user.amount -= amount;
    recipient.amount += amount;
  
    account.saveUser(user);
    account.saveUser(recipient);
  
    // Guardar la transacción para el remitente
    saveTransaction(currentPhoneNumber, {
      title: "Envío realizado",
      amount: `-$ ${amount.toLocaleString("es-CO")}`,
      phone: recipientPhoneNumber,
      description: message || "Sin mensaje", // Guardar el mensaje o un valor por defecto
      date: new Date().toLocaleString("es-CO"),
    });
  
    // Guardar la transacción para el destinatario
    saveTransaction(recipientPhoneNumber, {
      title: "Dinero recibido",
      amount: `+$ ${amount.toLocaleString("es-CO")}`,
      phone: currentPhoneNumber,
      description: "Recepción de dinero",
      date: new Date().toLocaleString("es-CO"),
    });
  
    // Mostrar mensaje de éxito
    showMessage(`Transferencia exitosa. Has enviado $${amount.toLocaleString("es-CO")} a ${recipientPhoneNumber}.`, "success");
  
    // Redirigir después de un breve tiempo
    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  });
  
}



  //Recargar
  if (window.location.pathname.includes("deposit.html")) {
    const depositForm = document.getElementById("deposit-form");
    const phoneNumberInput = document.getElementById("phone-number");
    const amountInput = document.getElementById("amount");
    const messageContainer = document.getElementById("message-container");
  
    // Obtener el número de la cuenta activa desde localStorage
    const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const user = account.getUser(currentPhoneNumber);
  
    if (!user) {
      // Si no hay usuario activo, redirigir al login
      alert("Por favor, inicia sesión.");
      window.location.href = "login.html";
      return;
    }
  
    // Mostrar el número de cuenta actual en el campo de número de celular
    phoneNumberInput.value = currentPhoneNumber;
    phoneNumberInput.setAttribute("readonly", true); // Hacer el campo de solo lectura
  
    // Función para mostrar mensajes
    const showMessage = (text, type) => {
      messageContainer.textContent = text;
      messageContainer.className = `message-container ${type}`;
      messageContainer.style.display = "block";
    };
  
    // Formatear el campo "¿Cuánto?" como pesos colombianos
    amountInput.addEventListener("input", (e) => {
      let value = amountInput.value.replace(/\D/g, ""); // Solo números
      const formatter = new Intl.NumberFormat("es-CO");
      amountInput.value = formatter.format(value); // Formato de pesos colombianos
    });
  
    // Validación y envío del formulario
    depositForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const enteredPhoneNumber = phoneNumberInput.value.trim(); // Número ingresado
      const rawAmount = amountInput.value.replace(/\D/g, ""); // Eliminar formato
      const amount = parseInt(rawAmount, 10);
  
      // Validar que el número coincida con la sesión activa
      if (enteredPhoneNumber !== currentPhoneNumber) {
        showMessage("No puedes recargar un número diferente al tuyo.", "error");
        return;
      }
  
      if (isNaN(amount) || amount <= 0) {
        showMessage("Por favor, ingresa un monto válido.", "error");
        return;
      }
  
      // Recargar el saldo del usuario activo
      user.amount += amount;
      account.saveUser(user); // Guardar usuario actualizado
  
      // Guardar la transacción en el historial
      saveTransaction(currentPhoneNumber, {
        title: "Depósito realizado",
        amount: `+$ ${amount.toLocaleString("es-CO")}`,
        phone: currentPhoneNumber,
        description: "Depósito de dinero",
        date: new Date().toLocaleString("es-CO"),
      });
  
      // Mostrar mensaje de éxito
      showMessage(`Recarga exitosa. Ahora tienes $${user.amount.toLocaleString("es-CO")}.`, "success");
  
      // Limpiar campo después de la recarga
      amountInput.value = "";
  
      // Opcional: recargar la página después de un tiempo
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000);
    });
  }
  
  
  



  // Transacciones.
  if (window.location.pathname.includes("transactions.html")) {
    const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const transactionsKey = `${currentPhoneNumber}_transactions`;
    const transactionsContainer = document.querySelector(
      ".transactions-container"
    );
    const transactions =
      JSON.parse(localStorage.getItem(transactionsKey)) || [];

    transactions.forEach((transaction) => {
      const transactionCard = document.createElement("div");
      transactionCard.classList.add("transaction-card");
      transactionCard.innerHTML = `
        <h2>${transaction.title}</h2>
        <p><span class="label">Monto:</span> <span class="value">${transaction.amount}</span></p>
        <p><span class="label">Número de teléfono:</span> <span class="value">${transaction.phone}</span></p>
        <p><span class="label">Descripción:</span> <span class="value">${transaction.description}</span></p>
        <p><span class="label">Fecha:</span> <span class="value">${transaction.date}</span></p>
      `;
      transactionsContainer.appendChild(transactionCard);
    });
  }

  // Función para guardar Transacciones
  const saveTransaction = (userPhoneNumber, transaction) => {
    const transactionsKey = `${userPhoneNumber}_transactions`;
    let transactions = JSON.parse(localStorage.getItem(transactionsKey)) || [];
    transactions.push(transaction);
    localStorage.setItem(transactionsKey, JSON.stringify(transactions));
  };

  // Retirar
  if (window.location.pathname.includes("withdraw.html")) {
    const amountInput = document.getElementById("amount");
    const withdrawBtn = document.getElementById("withdraw-btn");
    const withdrawMessage = document.getElementById("withdraw-message");
    const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const user = account.getUser(currentPhoneNumber);

    if (!user) {
      alert("Por favor, inicia sesión.");
      window.location.href = "login.html";
      return;
    }

    withdrawBtn.addEventListener("click", () => {
      const rawAmount = amountInput.value.replace(/\D/g, "");
      const amount = parseInt(rawAmount, 10);

      if (isNaN(amount) || amount <= 0) {
        withdrawMessage.textContent = "Por favor, ingresa un monto válido.";
        withdrawMessage.className = "withdraw-message error";
        withdrawMessage.style.display = "block";
        return;
      }

      if (user.amount < amount) {
        withdrawMessage.textContent = "Saldo insuficiente para este retiro.";
        withdrawMessage.className = "withdraw-message error";
        withdrawMessage.style.display = "block";
        return;
      }

      user.amount -= amount;
      account.saveUser(user);

      saveTransaction(currentPhoneNumber, {
        title: "Retiro realizado",
        amount: `-$ ${amount.toLocaleString("es-CO")}`,
        phone: currentPhoneNumber,
        description: "Retiro en cajero automático",
        date: new Date().toLocaleString("es-CO"),
      });

      withdrawMessage.textContent = "Retiro exitoso.";
      withdrawMessage.className = "withdraw-message success";
      withdrawMessage.style.display = "block";

      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000);
    });
  }

  // -> Transacción
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
        // Eliminar usuario
        account.deleteUser(phoneNumber);

        // Eliminar historial de transacciones
        const transactionsKey = `${phoneNumber}_transactions`;
        localStorage.removeItem(transactionsKey);

        // Limpiar datos del usuario actual
        localStorage.removeItem("currentPhoneNumber");

        // Mostrar mensaje de confirmación
        saveMessage.textContent = "Tu cuenta ha sido bloqueada exitosamente.";
        saveMessage.style.display = "block";
        document.body.removeChild(modalContainer);

        // Redirigir al inicio
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

  //Crear un usuario.

  // Lógica para la vista de registro
if (window.location.pathname.includes("register.html")) {
  const sendCodeButton = document.getElementById("send-code");
  const phoneNumberInput = document.getElementById("phone-number");
  const errorMessage = document.getElementById("error-message");
  const user = account.getAllUsers();
  console.log(user);

  // Garantizar que no haya claves indefinidas
  account.cleanInvalidKeys();

  // Validar en tiempo real
  phoneNumberInput.addEventListener("input", () => {
    let value = phoneNumberInput.value.replace(/[^0-9]/g, ""); // Solo números

    // Limitar a 10 dígitos
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Mostrar mensaje de error si no inicia con "3"
    if (value && value[0] !== "3") {
      errorMessage.textContent = "El número debe iniciar con '3'.";
      errorMessage.style.display = "block";
    } else {
      errorMessage.textContent = ""; // Ocultar mensaje de error si cumple
      errorMessage.style.display = "none";
    }

    phoneNumberInput.value = value; // Actualizar el valor
  });

  sendCodeButton.addEventListener("click", () => {
    const phoneValue = phoneNumberInput.value.trim();

    // Validaciones
    if (!phoneValue) {
      errorMessage.textContent = "Debes ingresar un número de celular.";
      errorMessage.style.display = "block";
      return;
    }

    if (
      phoneValue.length !== 10 ||
      isNaN(phoneValue) ||
      !phoneValue.startsWith("3")
    ) {
      errorMessage.textContent =
        "Número de teléfono no válido. Debe contener 10 dígitos y comenzar con 3.";
      errorMessage.style.display = "block";
      return;
    }

    if (account.userExists(phoneValue)) {
      errorMessage.textContent = "El número de teléfono ya está registrado.";
      errorMessage.style.display = "block";
      return;
    }

    // Crear usuario y guardarlo
    const newUser = new User(phoneValue);
    account.saveUser(newUser);

    localStorage.setItem("phoneNumber", phoneValue); // Guardar número en LocalStorage
    errorMessage.textContent = ""; // Limpiar mensaje de error
    window.location.href = "./code_number.html";
  });
}


// Lógica para la vista de código
if (window.location.pathname.includes("code_number.html")) {
  const codeInputs = document.querySelectorAll(".code-input input");
  const numericKeys = document.querySelectorAll(".numeric-keypad .key");
  const acceptButton = document.getElementById("verify-code");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  const phoneNumber = localStorage.getItem("phoneNumber");
  const account = new Account();

  const user = account.getUser(phoneNumber);

  if (user) {
    console.log("Usuario encontrado: ", user);
  } else {
    console.log("No se encontró el usuario.");
  }

  // Validar cada input para permitir solo números
  codeInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
    });
  });

  // Validación al hacer clic en "Aceptar"
  acceptButton.addEventListener("click", () => {
    const code = Array.from(codeInputs)
      .map((input) => input.value)
      .join(""); // Unir los valores de los inputs en una sola cadena

    if (code.length !== codeInputs.length) {
      errorMessage.textContent = "Por favor, completa todos los campos con números.";
      errorMessage.style.display = "block";
      successMessage.style.display = "none"; // Ocultar mensaje de éxito
      return;
    }

    // Aquí puedes validar el código real que debería coincidir
    if (code === "1234") { // Cambia "1234" por la lógica que estés usando
      errorMessage.style.display = "none"; // Ocultar mensaje de error
      successMessage.textContent = "Correo enviado con éxito.";
      successMessage.style.display = "block";

      // Opcional: redirigir después de un tiempo
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000);
    } else {
      successMessage.style.display = "none"; // Ocultar mensaje de éxito
      errorMessage.textContent = "Código incorrecto. Intenta nuevamente.";
      errorMessage.style.display = "block";
    }
  });
}



  

  // Lógica para la vista de Retiro
  if (window.location.pathname.includes("withdraw.html")) {
    const amountInput = document.getElementById("amount");
    const withdrawMethod = document.getElementById("withdraw-method");
    const withdrawBtn = document.getElementById("withdraw-btn");
    const withdrawMessage = document.getElementById("withdraw-message");
    const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
    const user = account.getUser(currentPhoneNumber);

    // Si no hay usuario activo, redirige al login
    if (!user) {
      alert("Por favor, inicia sesión.");
      window.location.href = "login.html";
      return;
    }

    // Formatear el monto al escribir
    amountInput.addEventListener("input", (e) => {
      const rawValue = e.target.value.replace(/\D/g, ""); // Elimina cualquier carácter no numérico
      const formattedValue = new Intl.NumberFormat("es-CO").format(rawValue);
      e.target.value = formattedValue;
    });

    // Eliminar la opción de transferencia bancaria
    withdrawMethod.innerHTML = `<option value="atm">Cajero Automático</option>`;

    // Manejo del evento de retiro
    withdrawBtn.addEventListener("click", () => {
      const rawAmount = amountInput.value.replace(/\D/g, ""); // Obtiene el valor sin formato
      const amount = parseInt(rawAmount, 10);

      if (isNaN(amount) || amount <= 0) {
        withdrawMessage.textContent = "Por favor, ingresa un monto válido.";
        withdrawMessage.className = "withdraw-message error";
        withdrawMessage.style.display = "block";
        return;
      }

      if (user.amount < amount) {
        withdrawMessage.textContent = "Saldo insuficiente para este retiro.";
        withdrawMessage.className = "withdraw-message error";
        withdrawMessage.style.display = "block";
        return;
      }

      // Actualizar el saldo del usuario
      user.amount -= amount;
      account.saveUser(user);

      withdrawMessage.textContent = "Retiro exitoso.";
      withdrawMessage.className = "withdraw-message success";
      withdrawMessage.style.display = "block";

      // Actualiza el saldo en localStorage
      localStorage.setItem(
        currentPhoneNumber + "userBalance",
        user.amount.toFixed(2)
      );

      // Redirige al home después de 2 segundos
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000);
    });
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

  //LOGIN
  if (window.location.pathname.includes("login.html")) {
    const phoneInput = document.getElementById("phone");
    const loginButton = document.getElementById("login-btn");
    const errorMessage = document.getElementById("error-message");
  
    // Validación en tiempo real del campo de celular
    phoneInput.addEventListener("input", () => {
      let value = phoneInput.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no numéricos
  
      // Limitar a 10 dígitos
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
  
      // Validar que inicie con "3"
      if (value && value[0] !== "3") {
        errorMessage.textContent = "El número debe iniciar con '3'.";
        errorMessage.style.display = "block";
        value = ""; // Limpiar el campo si no cumple
      } else {
        errorMessage.style.display = "none"; // Ocultar mensaje si cumple
      }
  
      phoneInput.value = value; // Actualizar el valor del campo
    });
  
    // Validación al hacer clic en el botón "Entrar"
    loginButton.addEventListener("click", () => {
      const phoneNumber = phoneInput.value.trim();
  
      if (!phoneNumber) {
        errorMessage.textContent = "Por favor, ingrese un número de teléfono.";
        errorMessage.style.display = "block";
        return;
      }
  
      if (phoneNumber.length !== 10 || phoneNumber[0] !== "3") {
        errorMessage.textContent = "Número no válido. Debe iniciar con '3' y tener 10 dígitos.";
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
      const successMessage = document.getElementById("success-message"); // Contenedor para el mensaje de éxito
    
      if (login.validatePassword(savedPhoneNumber, enteredPassword)) {
        // Mostrar mensaje de éxito
        errorMessage.style.display = "none"; // Ocultar mensaje de error si estaba visible
        successMessage.textContent = "Contraseña correcta.";
        successMessage.style.display = "block";
    
        // Redirigir a home después de un tiempo
        setTimeout(() => {
          const currentUser = login.getCurrentUser(savedPhoneNumber);
          window.location.href = "home.html";
        }, 2000);
      } else {
        // Mostrar mensaje de error
        successMessage.style.display = "none"; // Ocultar mensaje de éxito si estaba visible
        errorMessage.textContent = "Contraseña incorrecta. Intenta de nuevo.";
        errorMessage.style.display = "block";
    
        // Limpiar los campos de entrada
        enteredPassword = "";
        passwordInputs.forEach((input) => {
          input.value = "";
        });
      }
    });
  }    

  // Sección del home

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

    // Lógica para el nombre del header
    const phoneNumber = localStorage.getItem("currentPhoneNumber");
    const users = account.getAllUsers();
    const user = users[phoneNumber];

    const fullName = `${user.userName} ${user.surName} alias ${user.nickName}`;
    localStorage.setItem("fullName", fullName);

    const headerCenter = document.querySelector(".header-center h2");
    if (headerCenter && fullName) {
      headerCenter.textContent = `Hola, ${fullName}!`;
    }

    // Validar si el saldo es NaN, undefined o inválido
    if (
      isNaN(user.amount) ||
      user.amount === undefined ||
      user.amount === null
    ) {
      // Si el saldo no es válido, establecerlo en 0.00
      user.amount = 0.0;
      account.saveUser(user); // Guardar el saldo corregido en la base de datos
    } else {
      // Si el saldo es válido, obtener y mantener el saldo actual
      user.amount = parseFloat(user.amount);
    }

    // Mostrar el saldo actualizado
    const balanceElement = document.querySelector(".balance-card .amount");
    const totalElement = document.querySelector(".balance-card .total");

    if (balanceElement && totalElement) {
      const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
      });
    
      const formattedAmount = formatter.format(user.amount);
    
      balanceElement.textContent = formattedAmount; // Actualiza "Disponible"
      totalElement.textContent = `Total ${formattedAmount}`; // Actualiza "Total"
    }
    
    

    // //--Funciones importantes para la Inteligencia.

    function agregarMensaje(alUsuario, mensaje) {
      const chatInnerBox = document.querySelector(".chat-inner-box");

      // Crear el div para el mensaje
      const divMensaje = document.createElement("div");
      divMensaje.classList.add(alUsuario ? "user-message" : "bot-message");

      // Añadir el mensaje al div
      divMensaje.textContent = mensaje;

      // Añadir el mensaje a la ventana del chat
      chatInnerBox.appendChild(divMensaje);

      // Hacer que el chat se desplace al final cada vez que se agrega un nuevo mensaje
      chatInnerBox.scrollTop = chatInnerBox.scrollHeight;
    }

    // Manejar el envío del mensaje desde el input
    const sendButton2 = document.querySelector(".send-btn");
    const chatInput = document.querySelector(".chat-input");

    sendButton2.addEventListener("click", () => {
      const inputText = chatInput.value.trim();

      // Si el campo no está vacío
      if (inputText !== "") {
        // Agregar el mensaje del usuario al chat
        agregarMensaje(true, inputText);

        // Limpiar el campo de texto
        chatInput.value = "";

        // Mostrar mensaje de "Pensando..." mientras se obtiene la respuesta de la IA
        agregarMensaje(false, "Pensando...");

        // Llamar a la clase IA para obtener la respuesta
        ia.llamarGemini(inputText).then((respuesta) => {
          // Reemplazar el mensaje de "Pensando..." por la respuesta de la IA
          const lastBotMessage = document.querySelector(".bot-message");
          lastBotMessage.textContent = respuesta;

          // Agregar el mensaje de la IA
          agregarMensaje(false, respuesta);
        });
      }
    });

    // Si presionan "Enter" también se debe enviar el mensaje
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendButton.click();
      }
    });
  }
});
