// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUi } from '@/contexts/ui.context';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUi();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
