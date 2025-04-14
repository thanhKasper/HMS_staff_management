import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BellRing,
  CheckCircle,
  Clock,
  CloudRain,
  User,
  Users
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Mock data
const overviewData = [
  {
    name: "Patients",
    value: 246,
    icon: <Users className="h-6 w-6 text-blue-500" />,
    change: 8,
    up: true,
  },
  {
    name: "Available Beds",
    value: 52,
    icon: <CloudRain className="h-6 w-6 text-green-500" />,
    change: 3,
    up: false,
  },
  {
    name: "Staff On Duty",
    value: 118,
    icon: <User className="h-6 w-6 text-purple-500" />,
    change: 5,
    up: true,
  },
  {
    name: "Average Wait",
    value: "28 min",
    icon: <Clock className="h-6 w-6 text-orange-500" />,
    change: 4,
    up: false,
  },
];

const patientTrendData = [
  { name: "Mon", inpatients: 120, outpatients: 80, emergency: 25 },
  { name: "Tue", inpatients: 125, outpatients: 90, emergency: 30 },
  { name: "Wed", inpatients: 130, outpatients: 85, emergency: 35 },
  { name: "Thu", inpatients: 125, outpatients: 95, emergency: 25 },
  { name: "Fri", inpatients: 140, outpatients: 100, emergency: 40 },
  { name: "Sat", inpatients: 135, outpatients: 75, emergency: 45 },
  { name: "Sun", inpatients: 130, outpatients: 70, emergency: 30 },
];

const departmentOccupancyData = [
  { name: "Cardiology", occupancy: 85 },
  { name: "Neurology", occupancy: 72 },
  { name: "Pediatrics", occupancy: 64 },
  { name: "Orthopedics", occupancy: 90 },
  { name: "Oncology", occupancy: 78 },
  { name: "Emergency", occupancy: 95 },
];

const recentAlerts = [
  {
    id: 1,
    type: "critical",
    message: "ICU Bed 3 patient showing deteriorating vitals",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "warning",
    message: "Blood supply for Type O- running low",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "info",
    message: "Staff meeting scheduled for 3:00 PM",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "success",
    message: "MRI Machine 2 maintenance completed",
    time: "2 hours ago",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Sarah Johnson",
    doctor: "Dr. Michael Chen",
    department: "Cardiology",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Robert Garcia",
    doctor: "Dr. Emily Wong",
    department: "Neurology",
    time: "11:15 AM",
    status: "Waiting",
  },
  {
    id: 3,
    patient: "Lisa Morgan",
    doctor: "Dr. James Wilson",
    department: "Orthopedics",
    time: "01:00 PM",
    status: "Confirmed",
  },
  {
    id: 4,
    patient: "David Brown",
    doctor: "Dr. Sarah Johnson",
    department: "Pediatrics",
    time: "02:30 PM",
    status: "Canceled",
  },
];

const staffOnCall = [
  {
    id: 1,
    name: "Dr. Rebecca Torres",
    role: "Emergency Physician",
    department: "ER",
    status: "On Duty",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 2,
    name: "Dr. John Patterson",
    role: "Cardiologist",
    department: "Cardiology",
    status: "On Call",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 3,
    name: "Dr. Angela Brooks",
    role: "Chief Surgeon",
    department: "Surgery",
    status: "On Duty",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 4,
    name: "Dr. Marcus Johnson",
    role: "Neurologist",
    department: "Neurology",
    status: "Available",
    avatar: "/api/placeholder/32/32",
  },
];

const todayAvailableBeds = [
  { department: "General Ward", total: 120, available: 32 },
  { department: "ICU", total: 30, available: 5 },
  { department: "Emergency", total: 50, available: 8 },
  { department: "Pediatrics", total: 40, available: 12 },
  { department: "Maternity", total: 25, available: 6 },
];

const pieColors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function HospitalDashboard() {
  const [selectedView, setSelectedView] = useState("overview");

  // Function to calculate bed availability percentage
  const calculateAvailability = (available, total) => {
    return ((available / total) * 100).toFixed(0);
  };

  return (
    <div className="flex bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 container overflow-auto mx-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <BellRing className="h-6 w-6 text-gray-500" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
                Monday, April 14, 2025
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {overviewData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.name}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">{item.icon}</div>
                </div>
                <div className="flex items-center mt-4">
                  {item.up ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      item.up ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.change}% {item.up ? "increase" : "decrease"} from
                    yesterday
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Patient Trends Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Patient Trends (Last 7 Days)
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="inpatients"
                      fill="#3B82F6"
                      name="Inpatients"
                    />
                    <Bar
                      dataKey="outpatients"
                      fill="#10B981"
                      name="Outpatients"
                    />
                    <Bar dataKey="emergency" fill="#F59E0B" name="Emergency" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Occupancy Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Department Occupancy</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={departmentOccupancyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 80,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Occupancy"]}
                    />
                    <Bar dataKey="occupancy" fill="#8884d8">
                      {departmentOccupancyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables and Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Alerts</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex items-start p-3 rounded-lg border"
                      style={{
                        borderLeftWidth: "4px",
                        borderLeftColor:
                          alert.type === "critical"
                            ? "#EF4444"
                            : alert.type === "warning"
                            ? "#F59E0B"
                            : alert.type === "info"
                            ? "#3B82F6"
                            : "#10B981",
                      }}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {alert.type === "critical" && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {alert.type === "warning" && (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                        {alert.type === "info" && (
                          <AlertCircle className="h-5 w-5 text-blue-500" />
                        )}
                        {alert.type === "success" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{alert.message}</p>
                          <span className="text-xs text-gray-500">
                            {alert.time}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Today's Appointments</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View Schedule
                </button>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.department}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {appointment.doctor}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {appointment.time}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              appointment.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "Waiting"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Staff On Call */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Staff On Call</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All Staff
                </button>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200">
                  {staffOnCall.map((staff) => (
                    <li key={staff.id} className="py-4 flex items-center">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-500">
                          {staff.role} • {staff.department}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            staff.status === "On Duty"
                              ? "bg-green-100 text-green-800"
                              : staff.status === "On Call"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bed Availability */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Bed Availability</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All Units
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {todayAvailableBeds.map((unit, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{unit.department}</span>
                        <span className="text-sm text-gray-500">
                          {unit.available} of {unit.total} available
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            parseInt(
                              calculateAvailability(unit.available, unit.total)
                            ) > 50
                              ? "bg-green-500"
                              : parseInt(
                                  calculateAvailability(
                                    unit.available,
                                    unit.total
                                  )
                                ) > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${calculateAvailability(
                              unit.available,
                              unit.total
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
