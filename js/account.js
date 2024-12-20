import User from "./user.js";

class Account {
  constructor() {
    this.usersKey = "users";
  }

  saveUser(user) {
    const users = this.getAllUsers();
    users[user.phoneNumber] = user; // Vamos a usar el numero como el código :)
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  getAllUsers() {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : {};
  }

  getUser(phoneNumber) {
    const users = this.getAllUsers();
    return users[phoneNumber] || null;
  }

  userExists(phoneNumber) {
    const users = this.getAllUsers();
    return !!users[phoneNumber];
  }

  // Método para actualizar datos de un usuario
  updateUser(phoneNumber, updatedData) {
    const users = this.getAllUsers();
    if (users[phoneNumber]) {
      users[phoneNumber] = { ...users[phoneNumber], ...updatedData }; // Actualiza los datos
      localStorage.setItem(this.usersKey, JSON.stringify(users));
      return true;
    }
    return false;
  }

  //Metodo para eliminar un usuario através de su número de teléfono
  deleteUser(phoneNumber) {
    const users = this.getAllUsers();

    if (users[phoneNumber]) {
      delete users[phoneNumber];
      console.log(
        `Usuario con el número ${phoneNumber} eliminado exitosamente.`
      );
    } else {
      console.error(`El usuario con el número ${phoneNumber} no existe.`);
    }
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // Método para limpiar entradas inválidas
  cleanInvalidKeys() {
    const users = this.getAllUsers();

    for (const key in users) {
      if (users[key] === undefined || users[key] === "undefined") {
        console.log(`Eliminando clave con valor inválido: ${key}`);
        delete users[key];
      }
    }

    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }
}

export default Account;
