import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "../App";
import { PlayTab } from "../components/tabs/PlayTab";
import { NewsTab } from "../components/tabs/NewsTab";
import { SkinsTab } from "../components/tabs/SkinsTab";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/play" replace />,
      },
      {
        path: "play",
        element: <PlayTab />,
      },
      {
        path: "news",
        element: <NewsTab />,
      },
      {
        path: "skins",
        element: <SkinsTab />,
      },
    ],
  },
]);
