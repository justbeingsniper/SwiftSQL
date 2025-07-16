import * as React from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; // Adjust if needed

function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Fetch and store ID token in local storage
      const idToken = await user.getIdToken(true); // force refresh
      console.log("🔥 Firebase UID:", user.uid);
      console.log("🛡️ Token:", idToken);

      localStorage.setItem("idToken", idToken); // Store securely
      alert("Login successful!");

      // ✅ Navigate to the SQL page
      window.location.href = "/sql";
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <header className="logo-section">
          <h1 className="brand-name">SwiftSQL</h1>
        </header>

        <form className="login-form" aria-label="Login form">
          <div className="form-container">
            <button
              type="submit"
              className="guest-login-button"
              aria-label="Log in"
            >
              <Link to="/Feature">Log as Guest</Link>
            </button>

            <button
              type="button"
              className="google-login-button"
              aria-label="Login with Google"
              onClick={handleGoogleLogin}
            >
              <div className="google-button-content">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/9bd672705027455b93fd5d7ffd665ea0/8211b85ddd685ec80b036334535bfe9a0ee532ec?placeholderIfAbsent=true"
                  alt="Google logo"
                  className="google-icon"
                />
                <span className="google-text">Login with Google</span>
              </div>
            </button>
          </div>
        </form>

        <footer className="login-footer">
          <p className="copyright-text">©2023 Swift SQL. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;
