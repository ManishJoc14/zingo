import React, { useEffect } from "react";
import Layout from "./components/Layout";
import AppRoutes from "./routes/PublicRoutes";
import useOverflowEffect from "./utils/functions/useOverflowEffect";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName } from "./redux/userSlice";

const App = () => {
  useOverflowEffect(); //to manage overflowing issue
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const usersData = JSON.parse(localStorage.getItem("userData"));
    if (usersData) {
      dispatch(setName(usersData?.nickName));
    }
    const path = window.location.pathname;
    if (path === "/starter" && usersData) {
      navigate("/start-searching");
    } else if (path === "/start-searching" && !usersData) {
      navigate("/starter");
    }
  }, [dispatch, navigate]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
};

export default App;
