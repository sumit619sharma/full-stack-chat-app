import React, { useState } from "react";
import "./SignUp.css"; // Import the CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { themeAction } from "../redux-store/theme-reducer";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone:""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.theme.error);
  const addUserToFirebase = async (userDetail) => {
    try {
      //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4Old42pkOxqkr1jsyq_dYLAFonOwLHJ4
      const resp = await fetch("http://localhost:4000/user/signup", {
        method: "POST",
        body: JSON.stringify(userDetail),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("SignUp resp===", resp);
      if (!resp.ok) {
        // setError(true);
        const err = await resp.json();
        console.log("sign up failed with response");
        dispatch(themeAction.toggleError());
        return;
      }
      //setError(false);
      const res = await resp.json();
      navigate("/login");
    } catch (err) {
      console.log("request to sign up failed");
      dispatch(themeAction.toggleError());
      // return err.error.message;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      dispatch(themeAction.toggleError());
    }

    console.log(formData); // Perform signup logic or API call here
    if (formData.password != formData.confirm) {
      return;
    }

    const detail = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      returnSecureToken: true,
    };
    const resp = await addUserToFirebase(detail);
    // console.log("inside check",resp)

    setFormData({
      name: "",
      email: "",
      password: "",
      confirm: "",
      phone:"",
    });
  };

  return (
    <div
      style={{ marginTop: "10%", alignContent: "centre" }}
      className="signup-container"
    >
      <h2 style={{ color: "black" }}>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="username"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="phone"
          name="phone"
          placeholder="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder="confirm password"
          value={formData.confirm}
          onChange={handleChange}
          required
        />
        {error && <div>"failed to sign Up</div>}
        <button type="submit">Sign Up</button>

        <div>
          already have an account? <Link to="/login">login</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
