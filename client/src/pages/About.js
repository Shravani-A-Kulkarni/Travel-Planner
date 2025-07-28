import React from "react";
import "./About.css";
import { div } from "framer-motion/client";

const About = () => {
  return (
    <div className="about-container">
      <div className="overlay">
        <div className="content text-center">
          <h1 className="about-heading">About Travel Planner</h1>
          <p className="about-text">
            Travel Planner is your personalized AI-powered assistant to plan
            memorable trips. From recommending beautiful destinations to
            suggesting itineraries and local places, our goal is to make your
            journey smooth, stress-free, and exciting.Not only this, but you can
            also explore places, hotels and restaurants according to your
            budget.Whether you area solo traveller or your planning a memorable
            trip with your family and friends , this is the right place to plan
            your trip with ease and comfort. Explore the hidden gems of India
            and beyond with us. Plan your trip without stressing about budget
            and just plan youre trip within few clicks. Welcome to our website!
            Hope you have a wonderful experience.
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;
