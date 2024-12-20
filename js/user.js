class User {
  constructor(
    userName,
    middleName,
    surName,
    surName2,
    nickName,
    residencia,
    email,
    ID,
    phoneNumber,
    password,
    amount
  ) {
    this.userName = userName;
    this.middleName = middleName;
    this.surName = surName;
    this.surName2 = surName2;
    this.nickName = nickName;
    this.residencia = residencia;
    this.email = email;
    this.ID = ID;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.amount = 0.0;
  }
}
export default User;
