import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Tiers from "./pages/Tiers";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tiers", element: <Tiers /> },
      { path: "/checkout/:tierId", element: <Checkout /> },
      { path: "/success", element: <Success/>},
      { path: "/cancel", element: <Cancel/>},
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      { path: "/login", element: <Login /> },
    ]
  },
  
]);

export default router;
