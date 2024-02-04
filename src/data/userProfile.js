const UserProfile = (function() {
    let fullName = "";
  
    const getName = function() {
      return document.cookie;    // Or pull this from cookie/localStorage
    };
  
    const setName = function(name) {
      fullName = name;     
      // Also set this in cookie/localStorage
    };
  
    return {
      getName: getName,
      setName: setName
    }
  
  })();
  
  export default UserProfile;