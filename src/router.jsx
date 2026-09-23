import { createBrowserRouter, Navigate } from "react-router-dom";

// Auth Routing Components
import Page404 from "@pages/Page404";
import IdentityLayout from "@layouts/Identity/IdentityLayout";
import LoginMainNumber from "@features/auth/main/LoginMainNumber";
import LoginMainOtp from "@features/auth/main/LoginMainOtp";

// Layout main
import MainLayout from "@layouts/main/MainLayout";

// Vendor Layout & Pages (Matching PRD)
import VendorLayout from "@layouts/vendor/VendorLayout";
import VendorDashboard from "@pages/vendor/VendorDashboard";
import VendorOrders from "@pages/vendor/VendorOrders";
import VendorProfile from "@pages/vendor/VendorProfile";
import VendorServices from "@pages/vendor/VendorServices";
import VendorCatalog from "@pages/vendor/VendorCatalog";
import VendorCRM from "@pages/vendor/VendorCRM";
import VendorOfflineBookings from "@pages/vendor/VendorOfflineBookings";

// pages
import Home from "@pages/app/Home";
import Business from "@pages/app/Business";
import Cart from "@pages/app/Cart";
import Orders from "@pages/app/Orders";
import Profile from "@pages/app/Profile";
import PayList from "@pages/app/PayList";
import Faq from "@pages/app/Faq";
import AboutUs from "@pages/app/AboutUs";
import Referral from "@pages/app/Referral";
import Search from "@pages/app/Search";

const router = createBrowserRouter([

  {
    element: <MainLayout />,
    path: "/",
    children: [
      {
        element: <Home />,
        errorElement: <Home />,
        index: true,
      },
      {
        element: <Business />,
        errorElement: <Business />,
        path: "/salon/:id",
      },
      {
        element: <Business />,
        errorElement: <Business />,
        path: "/salon/:id/:slug",
      },
      {
        element: <Business />,
        errorElement: <Business />,
        path: "/business/:id",
      },
      {
        element: <Business />,
        errorElement: <Business />,
        path: "/business/:id/:slug",
      },
      {
        element: <Cart />,
        errorElement: <Cart />,
        path: "/cart",
      },
      {
        element: <Orders />,
        errorElement: <Orders />,
        path: "/orders",
      },
      {
        element: <Orders />,
        errorElement: <Orders />,
        path: "/profile/orders",
      },
      {
        element: <Profile />,
        errorElement: <Profile />,
        path: "/profile",
      },
      {
        element: <PayList />,
        errorElement: <PayList />,
        path: "/profile/myPaymentList",
      },
      {
        element: <Faq />,
        errorElement: <Faq />,
        path: "/faq",
      },
      {
        element: <AboutUs />,
        errorElement: <AboutUs />,
        path: "/about-us",
      },
      {
        element: <Referral />,
        errorElement: <Referral />,
        path: "/referral",
      },
      {
        element: <Referral />,
        errorElement: <Referral />,
        path: "/invite",
      },
      {
        element: <Search />,
        errorElement: <Search />,
        path: "/search",
      },
    ],
  },

  {
    element: <IdentityLayout />,
    children: [
      {
        path: "login",
        element: <LoginMainNumber />,
        errorElement: <Page404 />,
      },
      {
        path: 'login/otp/:phone',
        element: <LoginMainOtp />,
        errorElement: <Page404 />,
      }
    ],
  },
  {
    path: "/vendor",
    element: <VendorLayout />,
    children: [
      {
        index: true,
        element: <VendorDashboard />,
      },
      {
        path: "dashboard",
        element: <VendorDashboard />,
      },
      {
        path: "orders",
        element: <VendorOrders />,
      },
      {
        path: "profile",
        element: <VendorProfile />,
      },
      {
        path: "services",
        element: <VendorServices />,
      },
      {
        path: "catalog",
        element: <VendorCatalog />,
      },
      {
        path: "crm",
        element: <VendorCRM />,
      },
      {
        path: "bookings",
        element: <VendorOfflineBookings />,
      },
      {
        path: "offline-bookings",
        element: <VendorOfflineBookings />,
      },
    ],
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);

export default router;
