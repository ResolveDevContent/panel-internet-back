import { Outlet, Navigate } from "react-router-dom";
import AuthContext from '../context/Auth'
import { useContext } from 'react';


export const PrivateRoutes = ({user, roles}) => {
  const { auth, setAuth } = useContext(AuthContext)
  console.log(user)

  return auth && roles.includes(user.role) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

