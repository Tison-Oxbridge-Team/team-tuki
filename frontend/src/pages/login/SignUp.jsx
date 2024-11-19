import { Link, useNavigate } from "react-router-dom";
import "../../css/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate successful signup logic
    localStorage.setItem("isAuthenticated", "true"); // Mark the user as authenticated
    navigate("/dashboard"); // Redirect to Dashboard
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <span className="input-span">
        <label htmlFor="name" className="label">
          Full Name
        </label>
        <input type="text" name="name" id="name" required />
      </span>
      <span className="input-span">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input type="email" name="email" id="email" required />
      </span>
      <span className="input-span">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input type="password" name="password" id="password" required />
      </span>
      <span className="input-span">
        <label htmlFor="confirmPassword" className="label">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
        />
      </span>
      <input className="submit" type="submit" value="Sign up" />
      <span className="span">
        Already have an account? <Link to="/login">Log in</Link>
      </span>
    </form>
  );
};

export default Signup;