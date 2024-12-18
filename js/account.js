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
}

export default Account;
