function ValidToken() {
  const userSigned = window.localStorage.getItem("token");
  console.log(userSigned)
  if (userSigned == null) {
    return true;
  }
  return false;
}
export default ValidToken;
