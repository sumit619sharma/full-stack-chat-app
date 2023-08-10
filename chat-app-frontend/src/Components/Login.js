import React, {  useState } from "react";
import { Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authAction } from "../redux-store/auth-reducer";
import { themeAction } from "../redux-store/theme-reducer";
import axios from "axios";
//import AuthContext from '../store/auth-context';
let errMsg = "";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.theme.error);
  console.log("error state", error);
  //const authCtx= useContext(AuthContext);
  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const getUserLogin = async (userDetail) => {
    console.log("inside login");
    try {
      //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4Old42pkOxqkr1jsyq_dYLAFonOwLHJ4
      let resp = await axios.post(
        "http://localhost:4000/user/login",
        userDetail
      );

      //errMsg=resp.message;
      console.log("backend response object", resp);
      if (resp.status != 200) {
        console.log("request send but failed to fetch");
        // setError(true);
        dispatch(themeAction.toggleError());
        return;
      }
console.log('onLogin==',resp.data)
      const passData = {
        idToken: resp.data.token,
        email: resp.data.email,
        isPremium: resp.data.isPremium || false,
        userId: resp.data.userId,
        name: resp.data.name,
      };
      //  console.log('use details onLogin',res);
      dispatch(authAction.onLogIn({ data: passData }));
      navigation('/home');
    } catch (err) {
      dispatch(themeAction.toggleError());
      console.log("request failed", err);
      // return err.error.message;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      dispatch(themeAction.toggleError());
    }

    const detail = {
      email: email,
      password: password,
      // returnSecureToken: true,
    };
    await getUserLogin(detail);

    // authCtx.onLogIn(resp.idToken,resp.email);
    // localStorage.setItem('email',resp.email);
    // localStorage.setItem('token',resp.idToken);
  };

  return (
    <Container style={{ marginTop: "15%" }}>
      <Card>
        <Card.Body>
          <Card.Title>Login:</Card.Title>
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">Email:</label>
                <input
                  type="email"
                  id="username"
                  value={email}
                  onChange={handleUsernameChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {error && (
                <div
                  style={{
                    padding: "5px",
                    margin: "5px",
                    backgroundColor: error ? "red" : "white",
                    width: "200px",
                    color: "black",
                  }}
                >
                  {"Failed to login"}
                </div>
              )}
              <button type="submit">Login</button>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Link to="/forgot">forgott password?</Link>
                <Link to="/">sign Up?</Link>
              </div>
            </form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
