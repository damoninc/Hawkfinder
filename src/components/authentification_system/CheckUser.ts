import User, { testUsers } from "../User";


// this function keeps going even after a return statement, and I don't know why
// Just realized it might have to do with how for loops work in Typescript.
// In other words, you can't return early from a for loop

/**
 * Parses the User array in User.ts and determines username and password match
 * @param typedUser User's username
 * @param typedPass User's password
 * @returns boolean
 */
export function parseUsers(typedUser : string, typedPass : string) : [boolean, User] {
    let found : boolean = false;
    let userFound : User = new User("did","not","work","empty")
    testUsers.forEach((currentUser) => {
      console.log(currentUser.username, currentUser.password)
      if (
        currentUser.username == typedUser &&
        currentUser.password == typedPass
      ) {
        console.log("A user was found")
        
        found = true;
        userFound = currentUser
      }
    });
    return [found, userFound]

  }

