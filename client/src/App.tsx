import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

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
import ProfileSettingsPage from "./pages/property/ProfileSettingsPage";
import TourManagement from "./pages/landlord/TourManagement";
import MyBookings from "./pages/tenant/myBookings";
import BuyPage from "./pages/home/BuyPage";
import RentPage from "./pages/home/RentPage";
import NewHomesPage from "./pages/home/NewHomesPage";
import FindAgentsPage from "./pages/home/FindAgentsPage";
import MyApplicationsPage from "./pages/property/MyApplicationPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Fully Public Routes (No Navbar, No Auth) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>

          {/* ✅ Public Routes (Navbar, No Auth Required) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/new-homes" element={<NewHomesPage />} />
          <Route path="/find-agents" element={<FindAgentsPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />

          {/* 🔒 Any Logged In User */}
          <Route path="/profile-settings" element={
            <ProtectedRoute allowedRoles={["ADMIN", "LANDLORD", "TENANT"]}>
              <ProfileSettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute allowedRoles={["LANDLORD", "TENANT"]}>
              <MessagesPage />
            </ProtectedRoute>
          } />

          {/* 🔒 TENANT Only Routes */}
          <Route path="/tenant/dashboard" element={
            <ProtectedRoute allowedRoles={["TENANT"]}>
              <TenantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-applications" element={
            <ProtectedRoute allowedRoles={["TENANT"]}>
              <ApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/my-applications/:id" element={
            <ProtectedRoute allowedRoles={["TENANT"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute allowedRoles={["TENANT"]}>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute allowedRoles={["TENANT"]}>
              <FavoritesPage />
            </ProtectedRoute>
          } />

          {/* 🔒 LANDLORD Only Routes */}
          <Route path="/landlord/dashboard" element={
            <ProtectedRoute allowedRoles={["LANDLORD"]}>
              <LandlordDashboard />
            </ProtectedRoute>
          } />
          <Route path="/landlord/properties" element={
            <ProtectedRoute allowedRoles={["LANDLORD"]}>
              <ManagePropertiesPage />
            </ProtectedRoute>
          } />
          <Route path="/landlord/applications" element={
            <ProtectedRoute allowedRoles={["LANDLORD"]}>
              <ReviewApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/landlord/tours" element={
            <ProtectedRoute allowedRoles={["LANDLORD"]}>
              <TourManagement />
            </ProtectedRoute>
          } />
          <Route path="/property/create" element={
            <ProtectedRoute allowedRoles={["LANDLORD"]}>
              <CreatePropertyPage />
            </ProtectedRoute>
          } />
          <Route path="/property/edit/:id" element={
            <ProtectedRoute allowedRoles={["LANDLORD"]}>
              <EditPropertyPage />
            </ProtectedRoute>
          } />

          {/* 🔒 ADMIN Only Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagementPage />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;