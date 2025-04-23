import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import '../App.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log("Login clicked");
    navigate("/movies");
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: 'url("/loginbg.avif")' }}
    >
      <div className="login-card">
        <div className="back-arrow" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </div>
        <div className="forward-arrow" onClick={() => navigate("/register")}>
          <FaArrowRight />
        </div>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
