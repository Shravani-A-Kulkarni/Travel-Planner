import React from "react";
import "./Home.css"; // For custom animations
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 fade-in">Welcome to Travel Planner</h1>
      <p className="lead fade-in">
        Plan your dream trip with ease and explore amazing destinations.
      </p>
      <button
        className="btn btn-primary btn-lg bounce"
        onClick={() => navigate("/plan-your-tour")}
      >
        Get Started
      </button>

      <div className="row mt-5">
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/Beach.gif"
              alt="Beach"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/Mountain.gif"
              alt="Mountain"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/TajMahal.gif"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/maldives.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/dubai.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/singapore.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/jaipur.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>

        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/coorg.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/houseBoat.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/manali.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/goa.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
        <div className="col-md-4 col-sm-12 mb-4">
          <div className="gif-container">
            <img
              src="/images/kashmir.png"
              alt="Taj Mahal"
              className="styled-gif fade-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
