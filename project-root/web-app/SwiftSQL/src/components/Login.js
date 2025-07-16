// src/components/Login.js
import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Login({ onLogin }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      onLogin(token, result.user);
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  const handleGuestLogin = () => {
    onLogin(null, { isGuest: true });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={handleGuestLogin}>Continue as Guest</button>
    </div>
  );
}

export default Login;
