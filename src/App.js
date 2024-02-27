import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./sharedComponents/Navbar";
import Footer from "./sharedComponents/Footer";

const App = () => {
  return (
    <>


      <BrowserRouter>

   
        <Navbar />           

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
