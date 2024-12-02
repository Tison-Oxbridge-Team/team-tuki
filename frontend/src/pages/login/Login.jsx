import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import "../../css/auth.css";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
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
      <span className="span">
        <Link to="/forgot-password">Forgot password?</Link>
      </span>
      <input className="submit" type="submit" value="Log in" />
      <span className="span">
        Dont have an account? <Link to="/signup">Sign up</Link>
      </span>
    </form>
  );
};

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;