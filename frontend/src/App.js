import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Login from './pages/Login';
import Signup from './pages/Signup';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/"                 element={<Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/login"            element={<Login />} />
        <Route path="/signup"           element={<Signup />} />

        {/* App pages */}


        {/* Catch-all fallback */}
        <Route path="*"                 element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
