import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Admin goes to dashboard
    if (result.user.role === "admin") {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    // Normal user
    const destination = location.state?.from?.pathname || "/";

    navigate(destination, {
      replace: true,
    });
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">

          {/* HEADER */}

          <div className="login-header">
            <h1>Login 🔐</h1>

            <p>
              Welcome back to TechZone.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* EMAIL */}

            <div className="login-field">
              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}

            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* BUTTON */}

            <button
              className="login-submit-button"
              type="submit"
            >
              Login
            </button>

          </form>

          {/* REGISTER */}

          <div className="login-register">
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Login;