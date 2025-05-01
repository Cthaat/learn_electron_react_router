import { createHashRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./views/Dashboard";
import CpuView, { loader as cpuLoader } from "./views/CpuView";
import RamView from "./views/RamView";
import StorageView from "./views/StorageView";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "cpu",
        element: <CpuView />,
        loader: cpuLoader, // 添加loader函数
      },
      {
        path: "ram",
        element: <RamView />,
      },
      {
        path: "storage",
        element: <StorageView />,
      },
    ],
  },
]);
