import User, { testUsers } from "../User";


// this function keeps going even after a return statement, and I don't know why
// Will ask John later

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

