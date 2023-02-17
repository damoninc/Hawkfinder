class User {
  private _username: string;
  private _password: string;
  private _email: string;

  /**
   *
   * @param daEmail User's email
   * @param daPassword User's password
   */
  constructor(daEmail: string, daPassword: string) {
    this._email = daEmail;
    this._password = daPassword;
    this._username = this.createUsername();
  }

  /**
   * Getter password
   * @return {string}
   */
  public get password(): string {
    return this._password;
  }

  /**
   * Getter username
   * @return {string}
   */
  public get username(): string {
    return this._username;
  }

  /**
   * Getter uncwEmail
   * @return {string}
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Setter password
   * @param {string} value
   */
  public set password(value: string) {
    this._password = value;
  }

  /**
   * Setter username
   * @param {string} value
   */
  public set username(value: string) {
    this._username = value;
  }

  /**
   * Setter uncwEmail
   * @param {string} value
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   *
   * @returns username which is split from the @ on the email
   */
  private createUsername() {
    let email: string = this.email;
    var theItems: Array<string> = email.split("@");
    return theItems[0];
  }

  /**
   *
   * @returns description of user, used for testing, should probably be depreciated afterwards
   */
  public toString(): string {
    return (
      "Username: " +
      this.username +
      "\nEmail: " +
      this.email +
      "\nPassword: " +
      this.password
    );
  }
}

// Sample code for initializing and printing array of User objects

const testUsers: Array<User> = [
  new User("og2828@uncw.edu", "123456789"),
  new User("pio1681", "siuuuuuuuu"),
  new User("dwi2359@uncw.edu", "Grugley is sexy ;)"),
];

console.log("Display Sample Users\n");
for (let i = 0; i < testUsers.length; i++) {
  console.log("User " + (i + 1) + "\n" + testUsers[i].toString() + "\n");
}

export default User;
