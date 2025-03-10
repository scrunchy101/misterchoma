
import { Navigate } from "react-router-dom";

const Reservations = () => {
  // Redirect to home page if someone tries to access this route directly
  return <Navigate to="/" replace />;
};

export default Reservations;
