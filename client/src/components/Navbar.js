import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Travel Planner
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleNavigation("/plan-your-tour")}
              >
                Plan Your Tour
              </button>
            </li>
          </ul>

          <div className="d-flex">
            {isAuthenticated ? (
              <>
                <span className="navbar-text text-light me-3">
                  Welcome, {user?.username}
                </span>
                <button className="btn btn-outline-light" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
