import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../App.css";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Register clicked");

    // Registration logic (for now, just a log)
    // Here you can add actual API call for registration.

    // Redirect to login page after successful registration (for now)
    navigate("/login"); // This will redirect to login page after clicking Sign Up.
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: 'url("/registerbg.jpg")' }}
    >
      <div className="register-card">
        <div className="back-arrow" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </div>
        <div className="forward-arrow" onClick={() => navigate("/movies")}>
          <FaArrowRight />
        </div>

        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter Name"
            required
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            required
            autoComplete="new-password"
          />
          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;