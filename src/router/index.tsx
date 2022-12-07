import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Home = lazy(() => import("@/pages/home"));
const Title = lazy(() => import("@/pages/title"));

const RouterConfig: React.FC = () => {
  return useRoutes([
    { path: "/", element: <Home /> },
    { path: "title", element: <Title /> },
  ]);
};

export default RouterConfig;
