import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/user/userSlice";
import logImage from "../../assets/images/reportlogo.png";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import bcrypt from "bcryptjs";
import "./LoginWithUsername.css";
import { useUserLoggedinMutation } from "../../redux/features/auth/authApi";

const LoginWithUsername = ({ singleUserData, setSingleUserData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loginUserValidation] = useUserLoggedinMutation();
  const inputRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleFocus = () => {
    setPassword("");
  };

  useEffect(() => {
    if (username === "" || password === "") {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [password, username]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginUser = {
      username: username,
      password: password,
    };

    try {
      const response = await loginUserValidation(loginUser);
      if (response.data.success === true) {
        swal("Done", `${response.data.message}`, "success").then(() => {
          localStorage.setItem("user", JSON.stringify(response.data.data));
          localStorage.setItem("accesstoken", response.data.token);
          navigate("/main-view");
        });
      } else {
        swal("Sorry!", `${response.data.message}`, "error");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    const form = formRef.current;
    const inputs = form.querySelectorAll("input");
    form.setAttribute("autocomplete", "off");
    inputs.forEach((input) => input.setAttribute("autocomplete", "off"));
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center shadow-lg w-100 h-100 rounded-4"
      style={{
        backgroundColor: "rgba(21, 253, 4, 0.3)",
      
        position: "absolute", // Or "fixed" if needed
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="col-11 col-md-11 col-lg-4 col-xl-2 bg-white bg-opacity-25" >
        <div className="px-4 py-5">
          <div className="d-flex justify-content-center">
            <img
              src={logImage}
              alt=""
              style={{
                height: "120px",
                width: "120px",
                borderRadius: "50%",
              }}
            />
          </div>

          {isLoggedIn ? (
            navigate("/project") // Render success message if isLoggedIn is true
          ) : (
            <>
              <Form onSubmit={handleLogin} ref={formRef} autoComplete="off">
                <Form.Label
                  htmlFor="inputPassword5"
                  style={{ color: "#032339", letterSpacing: "1px" }}
                >
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
                    style={{ border: "1px solid #B8FEB3", background: "white",borderRadius:'5px' }}
                  />
                </InputGroup>
                {/* <input type="username" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} required /> */}
                <Form.Label
                  htmlFor="inputPassword5"
                  style={{
                    color: "#032339",
                    letterSpacing: "1px",
                    fontWeight: "600",
                  }}
                >
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
                    style={{ border: "1px solid #B8FEB3", background: "white",borderRadius:'5px'  }}
                  />
                </InputGroup>

                <div className="d-grid ">
                  <Button
                    type="submit"
                    size="md"
                    disabled={isButtonDisabled ? true : false}
                    className=" mt-2 w-100 mx-auto"
                    style={{
                      background: isButtonDisabled ? "gray" : "#68F057",
                      border: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginWithUsername;
