import Account from "./account.js";

class Login {
  constructor() {
    this.account = new Account(); 
  }

  validatePhone(phoneNumber) {
    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      return false; 
    }
    return this.account.userExists(phoneNumber); // Validar si existe en el sistema
  }

  validatePassword(phoneNumber, password) {
    if (!password || password.length !== 4) {
      return false; // Contraseña inválida
    }
    const user = this.account.getUser(phoneNumber); 
    return user && user.password === password; 
  }

  // Retornar el usuario actual si el inicio de sesión es exitoso
  getCurrentUser(phoneNumber) {
    return this.account.getUser(phoneNumber);
  }
}

export default Login;
