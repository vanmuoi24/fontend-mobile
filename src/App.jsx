import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLayout from "./components/admin/AdminLayout";

import ConcreteStressChart from "./components/homeChart/HomeChart";
import "./App.css";
import UserManager from "./components/admin/userManager/userManager";

import ManagerAvt from "./components/admin/Avatar/ManagerAvt";
import ParticipationManager from "./components/admin/Particition/Manager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<UserManager />} />
          <Route path="participation" element={<ParticipationManager />} />
          <Route path="images" element={<ManagerAvt />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
