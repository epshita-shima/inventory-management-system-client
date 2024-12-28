import React, { useEffect, useRef, useState } from "react";
import { useUserLoginMutation } from "../../redux/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/user/userSlice";
import logImage from "../../assets/images/logoimage.jpg";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../redux/features/user/userApi";
import swal from "sweetalert";
import './LoginWithUsername.css'

const LoginWithUsername = ({singleUserData,setSingleUserData}) => {
  const [data] = useUserLoginMutation();
  const { data: user,isUserLoading } = useGetAllUserQuery(undefined);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const inputRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn); 
  const navigate = useNavigate();
  console.log(user)
  const formRef = useRef(null);

  const handleFocus = () => {
    setPassword(''); // Clearing the password value
  };
  console.log(isButtonDisabled)
console.log(singleUserData)
if(isUserLoading){
  <p>loding ....</p>
}
  useEffect(() => {
    const userData = user?.filter(
      (item) => item.username === username && item.password === password
    );
    console.log(userData)
    setSingleUserData(userData)
    if(userData?.length > 0){
      setIsButtonDisabled(false)
    }
    else{
      setIsButtonDisabled(true)
    }
  }, [user, password, username,setSingleUserData,setIsButtonDisabled]);
  
  const handleLogin = (e) => {
    e.preventDefault();
    if(singleUserData.length > 0){
      navigate('/main-view')
      localStorage.setItem('user',JSON.stringify(singleUserData))
    }
    else{
      swal("Not Possible!", "Try Again!", "warning")
    }
  
  };
  useEffect(() => {
    const form = formRef.current;
    const inputs = form.querySelectorAll('input');
    form.setAttribute('autocomplete', 'off');
    inputs.forEach(input => input.setAttribute('autocomplete', 'off'));
  }, []);
  return (
    <div className="row background-image">
     {/* <div className="col-md-6">
        <img className="h-50 w-50" src={logImage} alt=""  style={{
          top: "50%",
          left: "10%",
    borderRadius:'50%'
        }}/>
      </div> */}
      <div
        className="shadow-lg col-md-12 rounded-4"
        style={{
          top: "20%",
          left: "35%",
          backgroundColor: "rgba(21, 253, 4, 0.3)",
          width:'30%',
          height:"60%"
        }}
      >
        <div className="p-4">
          <div className="d-flex justify-content-center">
          <img className="h-50 w-50" src={logImage} alt=""  style={{
          borderRadius:'20px'
        }}/>
          </div>
       
          <h2 className="mb-3 text-center text-uppercase" style={{color:'#68F057'}}>Login</h2>
          {isLoggedIn ? (
            navigate("/project") // Render success message if isLoggedIn is true
          ) : (
            <>
              <Form onSubmit={handleLogin} ref={formRef} autoComplete="off">
                <Form.Label htmlFor="inputPassword5" style={{color:'#032339',letterSpacing:'1px'}}>
                  Username
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Username"
                    name="username"
                    required
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={username}
                    ref={inputRef}
                    autoComplete="off"
                    onFocus={handleFocus}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{border:"1px solid #B8FEB3", background:'white'}}
                  />
                </InputGroup>
                {/* <input type="username" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} required /> */}
                <Form.Label htmlFor="inputPassword5" style={{color:'#032339',letterSpacing:'1px',fontWeight:'600'}}>
                  Password
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="inputPassword5"
                    required
                    ref={inputRef}
                    onFocus={handleFocus}
                    aria-describedby="passwordHelpBlock"
                    value={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{border:"1px solid #B8FEB3", background:'white'}}
                  />
                </InputGroup>

                <div className="d-grid ">
                  <Button
                    type="submit"
                    size="md"
                    disabled= {isButtonDisabled ? true : false}
                    className=" mt-2 w-50 mx-auto"
                    style={{ background: isButtonDisabled? "gray" : "#68F057", border: "none" }}
                  >
                    Login
                  </Button>
               
                </div>
              </Form>
              {message && <p>{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginWithUsername;
