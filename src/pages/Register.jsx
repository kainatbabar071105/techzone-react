import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    const result = register(name, email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/");
  }

  return (
    <main className="register-page">
      <div className="register-container">

        <div className="register-card">

          <div className="register-header">
            <h1>Create Account 📝</h1>

            <p>
              Create your TechZone account to continue shopping.
            </p>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">

            <div className="register-field">
              <label htmlFor="register-name">
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">
                Email
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="register-submit-button"
            >
              Create Account
            </button>

          </form>

          <div className="register-login">
            <p>
              Already have an account?
              {" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}

export default Register;