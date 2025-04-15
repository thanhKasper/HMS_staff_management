import { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  FileText,
  Bell,
  Settings,
  Menu,
  X,
  ChevronDown,
  Search,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activePage, setActivePage] = useState("dashboard");
  const [breadcrumbText, setBreadcrumbText] = useState("Dashboard");

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="w-full">
      {/* Main Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto">
          {/* Top Bar with Logo and User Menu */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg p-2">
                <svg
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">T4HMS</h1>
                <p className="text-xs text-blue-200">
                  Hospital Management System
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-9 pr-4 py-2 bg-blue-800/30 text-white rounded-full border border-blue-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-300" />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-blue-700 relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-800 border-2 border-white overflow-hidden mr-2">
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-1024.png"
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">Dr. Admin User</p>
                  <p className="text-xs text-blue-200">Administrator</p>
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={toggleMenu}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex justify-between items-center border-t border-blue-500/30 px-4">
            <ul className="flex">
              <li>
                <button
                  className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                    activePage === "dashboard"
                      ? "border-white text-white"
                      : "border-transparent text-blue-200 hover:text-white"
                  }`}
                  onClick={() => {
                    setActivePage("dashboard");
                    setBreadcrumbText("Dashboard");
                    navigate("/");
                  }}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                    activePage === "staff"
                      ? "border-white text-white"
                      : "border-transparent text-blue-200 hover:text-white"
                  }`}
                  onClick={() => {
                    setActivePage("staff");
                    setBreadcrumbText("Staff Management");
                    navigate("/staff");
                  }}
                >
                  <Users className="h-4 w-4" />
                  <span>Staff Management</span>
                </button>
              </li>
              <li>
                <button
                  className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                    activePage === "schedule"
                      ? "border-white text-white"
                      : "border-transparent text-blue-200 hover:text-white"
                  }`}
                  onClick={() => {
                    setActivePage("schedule");
                    setBreadcrumbText("Staff Scheduling");
                    navigate("/staff-schedule");
                  }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Staff Scheduling</span>
                </button>
              </li>
              <li>
                <button
                  className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                    activePage === "task-assign"
                      ? "border-white text-white"
                      : "border-transparent text-blue-200 hover:text-white"
                  }`}
                  onClick={() => {
                    setActivePage("task-assign");
                    setBreadcrumbText("Task Assignment");
                    navigate("/task-assign");
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span>Task Assign</span>
                </button>
              </li>
              <li>
                <button
                  className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                    activePage === "workload"
                      ? "border-white text-white"
                      : "border-transparent text-blue-200 hover:text-white"
                  }`}
                  onClick={() => {
                    setActivePage("workload");
                    setBreadcrumbText("Workload Tracking");
                    navigate("/workload");
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span>Workload Tracking</span>
                </button>
              </li>
              <li>
                <button
                  className={`px-4 py-3 flex items-center space-x-2 border-b-2 font-medium ${
                    activePage === "settings"
                      ? "border-white text-white"
                      : "border-transparent text-blue-200 hover:text-white"
                  }`}
                  onClick={() => setActivePage("settings")}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>

            {/* Action Button
            <div>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center transition-all hover:bg-blue-50 shadow-sm">
                <UserPlus className="mr-2 h-5 w-5" />
                Add New Staff
              </button>
            </div> */}
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute z-50 w-full">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden mr-3">
                <img
                  src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-1024.png"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">Dr. Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 w-full border rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <nav>
              <ul className="space-y-1">
                <li>
                  <button className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-gray-100">
                    <Home className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Dashboard</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 rounded-md flex items-center bg-blue-50 text-blue-700">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Staff Management</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-gray-100">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Staff Scheduling</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-gray-100">
                    <FileText className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Reports</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-gray-100">
                    <Bell className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Notifications</span>
                    {notifications > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 rounded-md flex items-center hover:bg-gray-100">
                    <Settings className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-red-600 hover:bg-red-50">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Breadcrumb - Optional */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto py-2 px-4">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">{breadcrumbText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
