import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Tiers from "./pages/Tiers";


function Success() {
  return <h1>Subscription Successful!</h1>;
}

function Cancel() {
  return <h1>Subscription Canceled.</h1>;
}

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
