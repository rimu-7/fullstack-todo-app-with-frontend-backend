import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, isLoggedIn }) => {
  if (isLoggedIn === null) {
    return null; // or a spinner
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
