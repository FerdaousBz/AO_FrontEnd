// src/routes/app-route.jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import routesList from './routes';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ROUTE_SIGNIN } from '@/utils/consts';

function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      {routesList.map(({ component: Component, name, path }) => (
        <Route
          key={name}
          path={path}
          element={
            path === ROUTE_SIGNIN ? (
              <Component /> // Pas de protection pour la page de connexion
            ) : (
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            )
          }
        />
      ))}
    </Routes>
  );
}

export default AppRoute;
