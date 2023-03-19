import Profile from "./Profile";
import { sampleProfiles } from "./Profile";

class User {
  private _username: string;
  private _password: string;
  private _email: string;
  private _accountSettings: Map<string, string>;
  private _friendsList: Array<User>
  private _profile: Profile;

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
  constructor(daEmail: string, daPassword: string, daFirst: string, daLast: string) {
    this._email = daEmail;
    this._password = daPassword;
    this._username = this.createUsername();
    this._accountSettings = new Map<string, string>();
    this._friendsList = new Array<User>();
    this._profile = new Profile(daFirst, daLast, this._username)
  }

  /**
   * Getter username
   * @return {string}
   */
  public get username(): string {
    return this._username;
  }

  /**
   * Setter username
   * @param {string} value
   */
  public set username(value: string) {
    this._username = value;
  }

  /**
 * Getter password
 * @return {string}
 */
  public get password(): string {
    return this._password;
  }

  /**
  * Setter password
  * @param {string} value
  */
  public set password(value: string) {
    this._password = value;
  }

  /**
   * Getter accountSettings
   * @return {Map<string, string>}
   */
  public get accountSettings(): Map<string, string> {
    return this._accountSettings;
  }

  /**
   * Setter accountSettings
   * @param {Map<string, string>} value
   */
  public set accountSettings(value: Map<string, string>) {
    this._accountSettings = value;
  }

  /**
   * Getter uncwEmail
   * @return {string}
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Setter uncwEmail
   * @param {string} value
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   * Getter profile
   * @return {Profile}
  */
  public get profile(): Profile {
    return this._profile
  }

  public set profile(newProf: Profile) {
    this._profile = newProf
  }

  /**
   *
   * @returns username which is split from the @ on the email
   */
  private createUsername() {
    const email: string = this.email;
    const theItems: Array<string> = email.split("@");
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
   * Getter for friendsList
   * @return Array<User>
   */
  public get friendsList(): Array<User> {
    return this._friendsList
  }

  /**
   * Adds a friend to the users friend list
   * @param friend 
   */
  public addFriend(friend: User) {
    this._friendsList.push(friend)
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

export const testUsers: User[] = [
  new User("og2828@uncw.edu", "gamertime", "Octavio", "Galindo"),
  new User("pio1681@uncw.edu", "siuuuuuuuu", "Patricio", "Orces"),
  new User("dwi2359@uncw.edu", "Grugley da master ;)", "Damon", "Incorvaia"),
  new User("rajebj@uncw.edu", "suppa hot FIYA", "John", "Bejar")
] as User[]

// For some reason, alt emails were giving me browser rendering problems, so I commented them out for now

// These statements show off how you can add alt emails to Users.

// testUsers[0].addAltEmail("tabiogaming@gmail.com");
// testUsers[1].addAltEmail("elpatoorces@hotmail.com");
// testUsers[2].addAltEmail("gruggers@yahoo.com");

// console.log("Display Sample Users\n");
// for (let i = 0; i < testUsers.length; i++) {
//   console.log("User " + (i + 1) + "\n" + testUsers[i].toString() + "\n");
// }

testUsers[0].addFriend(testUsers[0])
testUsers[0].addFriend(testUsers[1])
testUsers[0].addFriend(testUsers[2])
testUsers[0].addFriend(testUsers[3])

testUsers[0].profile = sampleProfiles[0]
testUsers[1].profile = sampleProfiles[1]
testUsers[2].profile = sampleProfiles[1]
testUsers[3].profile = sampleProfiles[1]

export default User;
