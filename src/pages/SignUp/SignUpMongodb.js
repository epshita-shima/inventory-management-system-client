import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/features/user/userSlice';
import logImage from "../../assets/images/cta1.1.jpg"
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SignUpMongodb = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const isRegistered = useSelector((state) => state.user.isRegistered); // Select isRegistered state
const navigate=useNavigate()
  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register({ username,email, password,isActive:'true' }));
    if(isRegistered){
        setMessage('Register Successfully, please login!')
    }
    else{
        setMessage('email already exist')
    }
  };
  return (
    <div className="container-fluid vh-100">
      <div className=" h-100 w-100 position-relative" >
      <img className="h-100 w-100" src={logImage} alt="" />
      </div>
      <div className="shadow-lg position-absolute rounded-4 p-4 w-50 " style={{top:'15%',left:'25%',backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
      <h2 className="text-white text-center text-uppercase mb-3 ">Register Form</h2>
      {isRegistered ? (
        navigate('/login') // Render success message if isRegistered is true
      ) : (
       <>
        <Form onSubmit={handleRegister}>
        <Form.Label htmlFor="inputPassword5" className="text-white">User Name</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="User's name"
              name="username"
              required
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={username} onChange={(e) => setUserName(e.target.value)}
              className="border border-primary"
            />
            
          </InputGroup>
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
              className=" mt-4 w-50 mx-auto"
              style={{background:'orange',border:'none'}}
            >
              SignUp
            </Button>
            <p className=" mt-4 d-flex justify-content-between align-items-center mx-auto">
            <small className="text-white">
              Already have an acccount?
              <Link className="text-warning fw-bold" to="/login">
                Please Login
              </Link>
            </small>
            </p>
            {message && <p className='text-danger d-flex justify-content-between align-items-center mx-auto'>{message}</p> }
          </div>
        </Form>
         
         </>
      )}
      </div>
     
    </div>
  )
}

export default SignUpMongodb
