class User {
  private _username: string;
  private _password: string;
  private _email: string;
  private _accountSettings: Map<string, string>;

  /**
   * A User object which contains the user's information related to many core features.
   *
   * As of right now, accountSettings is an empty map that can be used to add
   * an alternative email. We will create more methods that adds to the functionality
   * of accountSettings.
   *
   * @param daEmail User's email
   * @param daPassword User's password
   */
  constructor(daEmail: string, daPassword: string) {
    this._email = daEmail;
    this._password = daPassword;
    this._username = this.createUsername();
    this._accountSettings = new Map<string, string>();
  }

  /**
   * Getter accountSettings
   * @return {Map<string, string>}
   */
  public get accountSettings(): Map<string, string> {
    return this._accountSettings;
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
   * Setter accountSettings
   * @param {Map<string, string>} value
   */
  public set accountSettings(value: Map<string, string>) {
    this._accountSettings = value;
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
   * Adds alternative email to account settings
   * @param alt the string that contains an alternative email
   */
  public addAltEmail(alt: string) {
    this.accountSettings.set("alt-email", alt);
  }

  /**
   * Will search if they have an alt email
   * @returns alt email
   */
  public getAltEmail(): string {
    if (this.accountSettings.has("alt-email")) {
      return this.accountSettings.get("alt-email")!; // "!"" is used to tell typescript it won't be null
    }
    return "No Alternative Email";
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
      this.password +
      "\nAlternative Email: " +
      this.getAltEmail()
    );
  }
}

// Sample code for initializing and printing array of User objects

const testUsers: Array<User> = [
  new User("og2828@uncw.edu", "gamertime"),
  new User("pio1681@uncw.edu", "siuuuuuuuu"),
  new User("dwi2359@uncw.edu", "Grugley da master ;)"),
  new User("rajebj@uncw.edu", "suppa hot FIYA")
];

// These statements show off how you can add alt emails to Users.

testUsers[0].addAltEmail("tabiogaming@gmail.com");
testUsers[1].addAltEmail("elpatoorces@hotmail.com");
testUsers[2].addAltEmail("gruggers@yahoo.com");

console.log("Display Sample Users\n");
for (let i = 0; i < testUsers.length; i++) {
  console.log("User " + (i + 1) + "\n" + testUsers[i].toString() + "\n");
}

export default User;