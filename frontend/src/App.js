import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect home to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
