import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import route from "./route.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>
);
