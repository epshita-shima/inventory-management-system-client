const getMakebyUser = () => {
    const getUser = localStorage.getItem("user");
    
    // Check if the user data exists before parsing
    if (getUser) {
      const getUserParse = JSON.parse(getUser);
      
      // Assuming getUserParse is an array and you want the first item's username
      return getUserParse[0]?.username || '';  // Add fallback if username doesn't exist
    }
    
    return '';  // Return an empty string or handle the case when no user is found
  };
 export default  getMakebyUser