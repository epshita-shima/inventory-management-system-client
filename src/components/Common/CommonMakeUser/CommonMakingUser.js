const getMakebyUser = () => {
    const getUser = localStorage.getItem("user");
    if (getUser) {
      const getUserParse = JSON.parse(getUser);
      return getUserParse?.username || '';  
    }
    
    return ''; 
  };
 export default  getMakebyUser