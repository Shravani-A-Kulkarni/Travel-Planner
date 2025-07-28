import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlanYourTour.css";

function PlanYourTour() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    travelType: "leisure",
    budget: "",
    people: "1",
    travelMode: "flight",
    ageGroup: "adult",
    foodPreference: "vegetarian",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    const prompt = `
Create a detailed ${formData.travelType} travel plan for ${
      formData.people
    } person(s) to ${formData.destination}.
Budget: ${formData.budget || "Flexible"}
Travel Mode: ${formData.travelMode}
Age Group: ${formData.ageGroup}
Food Preference: ${formData.foodPreference}
Duration: ${formData.startDate} to ${formData.endDate}

Please include:
1. Day-by-day itinerary with times
2. Recommended attractions with very brief descriptions
3. Accommodation options matching the budget(provide multiple accomation options according to budget)
4. Dining suggestions based on food preference
5. Transportation details between locations
6. Budget breakdown with estimated costs
7. Packing tips specific to the destination and season
8. Cultural etiquette notes and safety tips
9. Alternative options for different budgets
10. Emergency contact information for the destination
11. At last give a final overview of the total cost of the trip in one or two lines.
12. Give links of appropriate hotels in front of the hotels mentioned
13. Provide relevant links that would redirect users to that tourist spot information on google and only on any states official tourist sites
14. The users to get relevant information from the links provided. Do not provide same links for all the places, provide according to the tourist spot
Organize everything properly

Format the response with clear headings for each section and use bullet points for lists.
  `.trim();

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to get suggestions");
      }

      const response = await fetch("http://localhost:5000/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add this line
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle 401 unauthorized errors specifically
        if (response.status === 401) {
          navigate("/login", { state: { from: "/plan-your-tour" } });
          return;
        }
        throw new Error(errorData.error || "Failed to get suggestions");
      }

      const data = await response.json();
      navigate("/tour-map", {
        state: {
          suggestion: data.suggestion,
          formData,
          generatedAt: new Date().toLocaleString(),
        },
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setError(
        error.message || "Failed to get travel suggestions. Please try again."
      );
      // Redirect to login if token is missing/invalid
      if (error.message.includes("token") || error.message.includes("auth")) {
        navigate("/login", { state: { from: "/plan-your-tour" } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="about-container-outer">
      <div
        className="about-container-inner"
        style={{ maxWidth: "600px", margin: "50px auto" }}
      >
        <h2 className="headings text-center">Plan your Tour</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Destination */}
          <div className="mb-3">
            <label className="form-label">Destination*</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="form-control"
              placeholder="Where do you want to go?"
              required
            />
          </div>

          {/* Travel Type */}
          <div className="mb-3">
            <label className="form-label">Travel Type*</label>
            <select
              name="travelType"
              value={formData.travelType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="leisure">Leisure/Vacation</option>
              <option value="adventure">Adventure</option>
              <option value="business">Business</option>
              <option value="family">Family</option>
              <option value="solo">Solo Travel</option>
            </select>
          </div>

          {/* Budget */}
          <div className="mb-3">
            <label className="form-label">Budget (per person)</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="form-control"
              placeholder="E.g., ₹20,000 or $500"
            />
          </div>

          {/* Number of People */}
          <div className="mb-3">
            <label className="form-label">Number of People*</label>
            <input
              type="number"
              name="people"
              value={formData.people}
              onChange={handleChange}
              className="form-control"
              min="1"
              required
            />
          </div>

          {/* Travel Mode */}
          <div className="mb-3">
            <label className="form-label">Travel Mode*</label>
            <select
              name="travelMode"
              value={formData.travelMode}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="flight">Flight</option>
              <option value="train">Train</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="cruise">Cruise</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="mb-3">
            <label className="form-label">Primary Age Group*</label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="adult">Adults (18-60)</option>
              <option value="senior">Seniors (60+)</option>
              <option value="family">Family with Kids</option>
              <option value="student">Students</option>
            </select>
          </div>

          {/* Food Preference */}
          <div className="mb-3">
            <label className="form-label">Food Preference*</label>
            <select
              name="foodPreference"
              value={formData.foodPreference}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="no-preference">No Preference</option>
            </select>
          </div>

          {/* Dates */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col">
              <label className="form-label">End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Generating Your Plan...
              </>
            ) : (
              "Get Travel Suggestions"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlanYourTour;
