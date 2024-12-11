import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import 'normalize.css';
import './App.css'

import Login from './pages/Login';
import ChatType from './pages/Chat';
import { UserContextProvider } from './AppProvider';

// interface PrivateRouteProps {
//   children: JSX.Element;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
//   const isAuthenticated = true; // Reemplaza con tu lógica de autenticación
//   return isAuthenticated ? children : <Navigate to="/" />;
// };

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/chat"
            element={
              <ChatType />
            }
          />
        </Routes>
      </Router>
    </UserContextProvider>
  );
};

export default App;
