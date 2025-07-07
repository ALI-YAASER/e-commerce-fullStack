import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import {backendUrl} from "../App.jsx";
import {toast} from "react-toastify"; // إذا كنت تستخدم صورة

const Login = ({setToken}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin',{email, password})
            if (response.data.success) {
                setToken(response.data.token);
            }else {
                toast.error(response.data.message);
            }
        }catch (error) {
            console.log(error)
            setError(error.response?.data?.msg || "Login failed. Please try again.");
        }


        // if (email === "admin@example.com" && password === "admin123") {
        //     alert("Login successful");
        //     // navigate("/admin") هنا يمكنك استخدام React Router
        // } else {
        //     setError("Invalid email or password");
        // }
    };

    return (
        <div className="flex flex-col  items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-center ">Admin Login</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">


                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-rose-400 text-white py-2 rounded hover:bg-rose-500 focus:outline-none"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
