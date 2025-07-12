import React, { useState } from "react";
import API from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", formData);
      toast.success("User registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="p-4 flex justify-center items-center flex-col min-h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 rounded border focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
        <span>
          Have and account? <Link to="/login" className="text-blue-500">SignIn</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
