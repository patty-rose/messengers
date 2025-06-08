import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AppWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    const noScrollRoutes = ["/home", /^\/mol\/.+$/];
    const shouldDisableScroll = noScrollRoutes.some((rule) =>
      rule instanceof RegExp
        ? rule.test(location.pathname)
        : location.pathname === rule
    );

    document.body.style.overflow = shouldDisableScroll ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location]);

  return children;
}

export default AppWrapper;
