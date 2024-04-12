import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../components/Loader";

const HomePage = React.lazy(() => import("../components/HomePage"));
const Starter = React.lazy(() => import("../components/Starter"));
const ContactUs = React.lazy(() => import("../components/ContactUs"));
const Searching = React.lazy(() => import("../components/searching"));
const ChatDashboard = React.lazy(() => import("../components/ChatDashboard"));
const PageNotFound = React.lazy(() => import("../components/PageNotFound"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        }
      />
      <Route
        path="/starter"
        element={
          <Suspense fallback={<Loader />}>
            <Starter />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<Loader />}>
            <ContactUs />
          </Suspense>
        }
      />
      <Route
        path="/start-searching"
        element={
          <Suspense fallback={<Loader />}>
            <Searching />
          </Suspense>
        }
      />
      <Route
        path="/chat-dashboard"
        element={
          <Suspense fallback={<Loader />}>
            <ChatDashboard />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<Loader />}>
            <PageNotFound />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
