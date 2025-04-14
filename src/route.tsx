import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import HospitalDashboard from "./pages/DashboardPage/DashboardPage";
import HospitalStaffManagement from "./pages/StaffProfilePage/StaffProfile";
import StaffScheduling from "./pages/SchedulingPage/SchedulingPage";
import TaskAssignmentPage from "./pages/TaskAssignPage/TaskAssignPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HospitalDashboard />,
      },
      {
        path: "staff",
        element: <HospitalStaffManagement />,
      },
      {
        path: "staff-schedule",
        element: <StaffScheduling />,
      },
      {
        path: "task-assign",
        element: <TaskAssignmentPage />,
      },
    ],
  },
]);

export default route;
