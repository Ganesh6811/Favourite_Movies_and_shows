import { useState } from "react";
import axios from "axios";
import baseUrl from "../config.tsx";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/Auth.store.tsx";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();

  const circles = [
    { size: "200px", x: "80%", y: "10%", opacity: 0.1 },
    { size: "250px", x: "5%", y: "70%", opacity: 0.05 },
    { size: "100px", x: "25%", y: "40%", opacity: 0.08 },
  ];

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const send_data = await axios.post(
        `${baseUrl}/auth/login`,
        { email, password }, 
        {
          withCredentials:true,
        }
      );

      if (send_data.status === 200) {
        fetchUser();
        navigate("/");
      }
    } catch (err) {
      console.log("Error while logging In");
      alert("Login Failed");
    }
  };

  const handleSignUp = ()=>{
    navigate("/signUp");
  }

  return (
    <div className="relative bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] h-screen w-screen overflow-hidden flex items-center justify-center">
      {circles.map((item, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: item.size,
            height: item.size,
            right: item.x,
            top: item.y,
            opacity: item.opacity,
            animation: `float ${5 + i * 2}s ease-in-out infinite`,
          }}
        ></div>
      ))}

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>

      {/* Login Form */}
      <form
        onSubmit={submitForm}
        className="flex flex-col gap-5 bg-[rgba(255,255,255,0.15)] backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg w-[400px] text-white"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white">Media Tracker</h1>
          <p className=" text-white/80">Turn your watchlist into a legacy of moments</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text font-semibold">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-lg bg-transparent border border-white/30 focus:outline-none focus:border-white/70 placeholder-white/60"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="px-4 py-2 rounded-lg bg-transparent border border-white/30 focus:outline-none focus:border-white/70 placeholder-white/60"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        <button
          type="submit"
          className="bg-white text-[#764ba2] py-2 rounded-lg font-semibold hover:bg-white/90 transition-all"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-white/80 mt-4">
          Don’t have an account?{" "}
          <span onClick={handleSignUp} className="font-semibold text-white hover:underline">
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
