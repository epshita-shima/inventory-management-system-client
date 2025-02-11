import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/features/user/userSlice';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const LoginWithMongodb = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const isLoggedIn = useSelector((state) =>(state.user.isLoggedIn)); // Select isLoggedIn state
    const navigate = useNavigate();
    
    const handleLogin = (e) => {
      e.preventDefault();
      dispatch(login({ email, password }));
      if(isLoggedIn){
        navigate("/project");
        setMessage('Login Successfull')
      }
      else{
        setMessage('Login Failed!')
      }
    };
  
  return (
    <div className="container-fluid vh-100">
     {/* <div className=" h-100 w-100 position-relative" >
      <img className="h-100 w-100" src={logImage} alt="" />
      </div> */}
      <div className="shadow-lg position-absolute w-50 rounded-4" style={{top:'30%',left:'25%',backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
      <div className="p-4">
       <h2 className=" mb-3 text-center text-white text-uppercase">Login</h2>
      {isLoggedIn ? (
            navigate("/project")// Render success message if isLoggedIn is true
      ) : (
        <>
        <Form onSubmit={handleLogin}>
        <Form.Label htmlFor="inputPassword5" className="text-white">Email</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="User's email"
              name="email"
              required
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="border border-primary"
            />
          </InputGroup>
          {/* <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> */}
          <Form.Label htmlFor="inputPassword5" className="text-white">Password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="User's password"
              id="inputPassword5"
              required
              aria-describedby="passwordHelpBlock"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-primary"
            />
          </InputGroup>
          
          <div className="d-grid ">
            <Button
              type="submit"
              size="md"
              className=" mt-2 w-50 mx-auto"
             style={{background:'orange',border:'none'}}
            >
              Login
            </Button>
            {/* {isExit.isError ? (
              <div className="text-warning mt-3 fw-bold d-flex justify-content-between align-items-center mx-auto">Please give valid email and password</div>
            ) : (
              ""
            )} */}
          </div>
          {/* <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button> */}
        </Form>
        {message && <p>{message}</p>}
        </>
       )} 
      </div>
      </div>
    </div>
  )
}

export default LoginWithMongodb
