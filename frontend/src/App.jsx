import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import PurchasePage from "./pages/PurchasePage";
import AdminDashboard from "./pages/AdminDashboard";

// Protected wrappers
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/purchase",
    element: (
      <ProtectedRoute>
        <PurchasePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
}

export default App;
