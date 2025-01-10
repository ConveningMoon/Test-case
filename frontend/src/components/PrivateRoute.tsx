import React from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/components/PrivateRoute.css';

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;