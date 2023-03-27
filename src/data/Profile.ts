/*
 * A profile class that is used as a parameter of the user class. Profiles cannot exist independently without a User to go with it.
 * Profile should never be instanstiated outside of an instance of User.
 */
class Profile {
  private _firstName: string;
  private _lastName: string;
  private _userName: string;
  private _bio = "";
  private _interests: string[] = [];
  private _profilePicture = "defprofileimg.jpg";
  private _coverPhoto = "";
  private _birthDate: Date = new Date(0, 0, 0);

  constructor(firstName: string, lastName: string, userName: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._userName = userName;
  }

  /**
   * Getter firstName
   * @return {string}
   */
  public get firstName(): string {
    return this._firstName;
  }
  /**
   * Setter firstName
   * @param {string} value
   */
  public set firstName(value: string) {
    this._firstName = value;
  }
  /**
   * Getter lastName
   * @return {string}
   */
  public get lastName(): string {
    return this._lastName;
  }
  /**
   * Setter lastName
   * @param {string} value
   */
  public set lastName(value: string) {
    this._lastName = value;
  }
  /**
   * Getter userName
   * @return {string}
   */
  public get userName(): string {
    return this._userName;
  }
  /**
   * Setter userName
   * @param {string} value
   */
  public set userName(value: string) {
    this._userName = value;
  }
  /**
   * Getter bio
   * @return {string}
   */
  public get bio(): string {
    return this._bio;
  }
  /**
   * Setter bio
   * @param {string} value
   */
  public set bio(value: string) {
    this._bio = value;
  }
  /**
   * Getter interests
   * @return {string[]}
   */
  public get interests(): string[] {
    return this._interests;
  }
  /**
   * Setter interests
   * @param {string[]} value
   */
  public set interests(value: string[]) {
    this._interests = value;
  }
  /**
   * Getter profilePicture
   * @return {string}
   */
  public get profilePicture(): string {
    return this._profilePicture;
  }
  /**
   * Setter profilePicture
   * @param {string} value
   */
  public set profilePicture(value: string) {
    this._profilePicture = value;
  }
  /**
   * Getter coverPhoto
   * @return {string}
   */
  public get coverPhoto(): string {
    return this._coverPhoto;
  }
  /**
   * Setter coverPhoto
   * @param {string} value
   */
  public set coverPhoto(value: string) {
    this._coverPhoto = value;
  }
  /**
   * Getter birthDate
   * @return {Date}
   */
  public get birthDate(): Date {
    return this._birthDate;
  }

  /**
   * Setter birthDate
   * @param {Date} value
   */
  public set birthDate(value: Date) {
    this._birthDate = value;
  }
}

export const sampleProfiles: Profile[] = [
  new Profile("Damon", "Incorvaia", "dwi2359"),

  new Profile("Octavio", "Galindo", "og2828"),
];

sampleProfiles[0].bio =
  "Hello, my name is Damon Incorvaia. I am currently a Senior studying Computer Science! Other things about me: I am a musician of 12 years, I am a car enthusiast and I thorughly enjoy videogames and technology";
sampleProfiles[0].interests = [
  "Music",
  "Videogames",
  "Cars",
  "Computers",
  "Technology",
  "Drums",
  "Bass",
  "Guitar",
];
sampleProfiles[0].profilePicture = "profileimg.jpg";
sampleProfiles[0].coverPhoto = "coverphoto.jpg";
sampleProfiles[0].birthDate = new Date(2000, 6, 17);

sampleProfiles[1].bio = "My name is Octavio Galindo and I am a man of culture.";
sampleProfiles[1].interests = [
  "Predatory Mobile Gaming",
  "Stale Bread",
  "Paint Chips",
  "Esoteric Art",
];
sampleProfiles[1].profilePicture = "profileimg2.jpg";
sampleProfiles[1].coverPhoto = "coverphoto.jpg";
sampleProfiles[1].birthDate = new Date(1999, 12, 20);

export default Profile;
