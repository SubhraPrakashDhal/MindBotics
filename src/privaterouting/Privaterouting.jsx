import { Navigate } from "react-router-dom";

const PrivateRouting = ({ children }) => {
  const token = localStorage.getItem("mindbrain_token"); 

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRouting;
