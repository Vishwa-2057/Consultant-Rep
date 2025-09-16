import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, clinicAPI } from "@/services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [userType, setUserType] = useState("user"); // "user" or "clinic"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      let res;

      if (useOtp) {
        // 🔹 OTP Login
        res = await authAPI.loginWithOTP(email.trim(), otp);
      } else {
        // 🔹 Password Login
        if (userType === "clinic") {
          res = await clinicAPI.login({ email: email.trim(), password });
        } else {
          res = await authAPI.login({ email: email.trim(), password });
        }
      }

      // ✅ Store token & redirect
      localStorage.setItem("authToken", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");

    try {
      await authAPI.requestOTP(email.trim());
      alert("OTP sent to your email!");
    } catch (err) {
      setError(err.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold">Login</h2>

      {/* User type toggle */}
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="user">User</option>
        <option value="clinic">Clinic</option>
      </select>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />

      {/* Password login */}
      {!useOtp && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
      )}

      {/* OTP login */}
      {useOtp && (
        <>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handleRequestOtp}
            disabled={loading}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Request OTP
          </button>
        </>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Login button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Loading..." : "Login"}
      </button>

      {/* Toggle OTP/Password login */}
      <button
        onClick={() => setUseOtp(!useOtp)}
        className="text-sm text-blue-600 underline"
      >
        {useOtp ? "Use Password Instead" : "Use OTP Instead"}
      </button>
    </div>
  );
};

export default Login;
