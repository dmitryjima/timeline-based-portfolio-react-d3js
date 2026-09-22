import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.tsx";
// Demo sections
import AppSection_1 from "./1-initial-setup-and-structure/App.tsx";
import AppSection_2 from "./2-data-models-and-sample-data/App.tsx";
import AppSection_3 from "./3-responsive-timeline-map/App.tsx";
import AppSection_4 from "./4-putting-nodes-on-the-timeline/App.tsx";
import AppSection_5 from "./5-putting-nodes-on-lanes/App.tsx";
import AppSection_6 from "./6-drawing-lines-to-nodes/App.tsx";
import AppSection_7 from "./7-rich-content-cards/App.tsx";
import AppSection_8 from "./8-animating-the-resize/App.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/1-initial-setup-and-structure",
    element: <AppSection_1 />,
  },
  {
    path: "/2-data-models-and-sample-data",
    element: <AppSection_2 />,
  },
  {
    path: "/3-responsive-timeline-map",
    element: <AppSection_3 />,
  },
  {
    path: "/4-putting-nodes-on-the-timeline",
    element: <AppSection_4 />,
  },
  {
    path: "/5-putting-nodes-on-lanes",
    element: <AppSection_5 />,
  },
  {
    path: "/6-drawing-lines-to-nodes",
    element: <AppSection_6 />,
  },
  {
    path: "/7-rich-content-cards",
    element: <AppSection_7 />,
  },
  {
    path: "/8-animating-the-resize",
    element: <AppSection_8 />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
