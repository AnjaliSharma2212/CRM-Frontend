

import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Leads from './Pages/Leads';
import RegisterForm from './Pages/Register';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import socket from "./utils/socket";
import { jwtDecode } from "jwt-decode"
import { useEffect } from 'react';
import Navbar from './components/Navbar';


export default function App() {
   const location = useLocation();
  const token = localStorage.getItem("token");

  // Pages where navbar should NOT appear
  const hideNavbarOn = ["/login", "/register"];

  const shouldShowNavbar = token && !hideNavbarOn.includes(location.pathname);

   // 1️⃣ Connect user to WebSocket room
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      socket.emit("join", user.id);
    }
  }, []);

  // 2️⃣ Listen for notifications
  useEffect(() => {
    socket.on("newLead", (data) => {
      toast.success(data.message);
    });

    socket.on("leadAssigned", (data) => {
      toast.info("A new lead has been assigned to you!");
    });

    return () => {
      socket.off("newLead");
      socket.off("leadAssigned");
    };
  }, []);
  
  // Pages where navbar should NOT appear
  
  return (
    <>
     {shouldShowNavbar && <Navbar />}
    <ToastContainer/>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
      </Routes>
    </>
  );
}
