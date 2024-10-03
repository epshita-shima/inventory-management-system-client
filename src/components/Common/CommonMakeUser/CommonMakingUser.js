const getMakebyUser = () => {
    const getUser = localStorage.getItem("user");
    if (getUser) {
      const getUserParse = JSON.parse(getUser);
      return getUserParse[0]?.username || '';  
    }
    
    return ''; 
  };
 export default  getMakebyUser