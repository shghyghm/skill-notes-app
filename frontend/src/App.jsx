import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { login, signup, setAuthToken } from "./api";
import Skills from "./components/Skills";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [token, setToken] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("token");
    toast.success("خروج موفقیت‌آمیز");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = isLoginMode
        ? await login({ email, password })
        : await signup({ username, email, password });

      const authToken = data.access_token;
      setToken(authToken);
      setAuthToken(authToken);
      localStorage.setItem("token", authToken);

      setEmail("");
      setPassword("");
      setUsername("");

      toast.success(
        isLoginMode ? "خوش آمدید!" : "ثبت‌نام موفقیت‌آمیز، لطفا وارد شوید"
      );

      if (!isLoginMode) {
        setIsLoginMode(true);
      }
    } catch (error) {
      const message =
        error?.detail || error?.message || "خطای نامعلوم";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
          <LandingPage
            isLoginMode={isLoginMode}
            setIsLoginMode={setIsLoginMode}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Dashboard token={token} onLogout={handleLogout} />
    </>
  );
}

