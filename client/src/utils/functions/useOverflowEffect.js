// useOverflowEffect.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useOverflowEffect = () => {
  const location = useLocation();

  useEffect(() => {
    const dontNeedOverflow = location.pathname === "/chat-dashboard";

    if (dontNeedOverflow) {
      document.documentElement.style.overflowY = "clip";
    } else {
      document.documentElement.style.overflowY = "auto";
    }

    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, [location.pathname]);
};

export default useOverflowEffect;
