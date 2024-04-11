import React, { useEffect } from "react";
import Layout from "./components/Layout";
import AppRoutes from "./routes/PublicRoutes";
import useOverflowEffect from "./utils/functions/useOverflowEffect";
import { useNavigate } from "react-router-dom";

const App = () => {
  useOverflowEffect(); //to manage overflowing issue
  const navigate = useNavigate();

  const hasUserData = localStorage.getItem("userData");

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/starter" && hasUserData) {
      navigate("/start-searching");
    } else if (path === "/start-searching" && !hasUserData) {
      navigate("/starter");
    }
  }, [hasUserData, navigate]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App;
