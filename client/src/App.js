import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import PlanYourTour from "./pages/PlanYourTour.js";
import "leaflet/dist/leaflet.css";
import TourMap from "./pages/TourMap.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import { AuthProvider } from "./AuthContext.js";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="mt-5 pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/About" element={<About />} />
            <Route
              path="/plan-your-tour"
              element={
                <ProtectedRoute>
                  <PlanYourTour />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tour-map"
              element={
                <ProtectedRoute>
                  <TourMap />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
