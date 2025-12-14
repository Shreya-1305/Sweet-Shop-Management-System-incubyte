import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

/* ---------------- INPUT FIELD ---------------- */

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete="off"
      className={`w-full px-4 py-3 rounded-lg border
        bg-white text-black placeholder-gray-400
        border-gray-300
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
        transition
        ${error ? "border-red-500" : ""}
      `}
    />

    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

/* ---------------- MAIN MODAL ---------------- */

const initialState = { name: "", email: "", password: "" };

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  /* Reset form when modal closes */
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setErrors({});
      setIsLogin(true);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};

    if (!formData.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = "Invalid email";

    if (!formData.password) err.password = "Password is required";
    else if (formData.password.length < 6)
      err.password = "Minimum 6 characters";

    if (!isLogin && !formData.name) err.name = "Name is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData.name, formData.email, formData.password);

      showNotification(
        isLogin ? "Login successful!" : "Account created!",
        "success"
      );

      onClose();
      navigate(res.user.role === "admin" ? "/admin" : "/purchase");
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
          text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isLogin ? "Sign in to continue" : "Join MithaiMart today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          )}

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold
            bg-gradient-to-r from-pink-500 to-red-500
            hover:from-pink-600 hover:to-red-600
            focus:outline-none focus:ring-2 focus:ring-pink-500
            disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData(initialState);
              setErrors({});
            }}
            className="ml-1 text-pink-600 font-semibold hover:text-pink-700"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
