// Inside src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Page Imports
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import PropertyDetailPage from "./pages/property/PropertyDetailPage";
import PropertiesPage from "./pages/property/PropertiesPage";
import ManagePropertiesPage from "./pages/property/ManagePropertiesPage";
import ReviewApplicationsPage from "./pages/property/ReviewApplicationPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import { LandlordDashboard } from "./pages/property/LandlordDashboard";
import TenantDashboard from "./pages/property/TenantDashboard";
import CreatePropertyPage from "./pages/property/CreatePropertiesPage";
import EditPropertyPage from "./pages/property/EditPropertyPage";
import FavoritesPage from "./pages/property/FavoritesPage";
import ApplicationsPage from "./pages/property/ApplicationsPage";
import MessagesPage from "./pages/messages/MessagesPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import TourManagement from "./pages/landlord/TourManagement";
import MyBookings from "./pages/tenant/myBookings";
import BuyPage from "./pages/home/BuyPage";
import RentPage from "./pages/home/RentPage";
import NewHomesPage from "./pages/home/NewHomesPage";
import FindAgentsPage from "./pages/home/FindAgentsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (No Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (Under MainLayout) */}
        <Route element={<MainLayout />}>
          {/* Home / Property Browsing */}
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/new-homes" element={<NewHomesPage />} />
          <Route path="/find-agents" element={<FindAgentsPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/create" element={<CreatePropertyPage />} />
          <Route path="/property/edit/:id" element={<EditPropertyPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />

          {/* Tenant Routes */}
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/my-applications" element={<ApplicationsPage />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={["TENANT"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Landlord Routes */}
          <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={["LANDLORD", "TENANT"]}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord/tours"
            element={
              <ProtectedRoute allowedRoles={["LANDLORD"]}>
                <TourManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/landlord/properties" element={<ManagePropertiesPage />} />
          <Route path="/landlord/applications" element={<ReviewApplicationsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;