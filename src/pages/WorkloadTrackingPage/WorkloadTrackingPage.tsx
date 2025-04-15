import {
  BarChart3,
  Calendar,
  Calendar as CalendarIcon,
  ClipboardList,
  Clock,
  Search,
  User,
  X
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  PieChart as RPieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Type definitions
interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "Active" | "On Leave";
  avatar: string;
  capacity: number; // hours per week
}

interface Task {
  id: number;
  staffId: number;
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  complexity: "Low" | "Medium" | "High";
  status: "Completed" | "In Progress" | "Pending";
}

interface WorkloadMetrics {
  totalHours: number;
  taskCount: number;
  complexityDistribution: {
    Low: number;
    Medium: number;
    High: number;
  };
  typeDistribution: Record<string, number>;
  utilization: number;
}

interface TaskTypeData {
  name: string;
  value: number;
}

interface WorkloadSummaryData {
  name: string;
  hours: number;
  tasks: number;
  utilization: number;
  fullName: string;
  capacity?: number;
}

interface DepartmentWorkloadData {
  name: string;
  hours: number;
  tasks: number;
  staff?: number;
}

interface WeekDay {
  date: string;
  label: string;
}

export default function StaffWorkloadTracker(): JSX.Element {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");
  const [selectedWeek, setSelectedWeek] = useState<string>(
    getWeekStartDate().toISOString().split("T")[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filterRole, setFilterRole] = useState<string>("All Roles");
  const [filterDepartment, setFilterDepartment] =
    useState<string>("All Departments");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sample staff data
  const staffList: StaffMember[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Doctor",
      department: "Cardiology",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      capacity: 48, // hours per week
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Doctor",
      department: "Neurology",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      capacity: 42, // hours per week
    },
    {
      id: 3,
      name: "Rebecca Torres",
      role: "Nurse",
      department: "Emergency",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      capacity: 40, // hours per week
    },
    {
      id: 4,
      name: "John Patterson",
      role: "Nurse",
      department: "Pediatrics",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      capacity: 36, // hours per week
    },
    {
      id: 5,
      name: "Maria Rodriguez",
      role: "Technician",
      department: "Radiology",
      status: "Active",
      avatar: "/api/placeholder/40/40",
      capacity: 40, // hours per week
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      role: "Doctor",
      department: "Oncology",
      status: "On Leave",
      avatar: "/api/placeholder/40/40",
      capacity: 45, // hours per week
    },
  ];

  // Task types by role
  const taskTypes: Record<string, string[]> = {
    Doctor: [
      "Patient Consultation",
      "Medical Procedure",
      "Diagnostic Review",
      "Treatment Planning",
      "Medical Documentation",
      "Rounds",
      "Surgery",
    ],
    Nurse: [
      "Patient Care",
      "Medication Administration",
      "Vital Sign Monitoring",
      "Patient Education",
      "Care Coordination",
      "Documentation",
    ],
    Technician: [
      "Diagnostic Testing",
      "Equipment Maintenance",
      "Lab Work",
      "Patient Preparation",
      "Results Processing",
    ],
  };

  // Sample tasks data
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([
    {
      id: 1,
      staffId: 1,
      title: "Review Cardiac Test Results",
      type: "Diagnostic Review",
      date: "2025-04-15",
      startTime: "09:30",
      endTime: "11:30",
      hours: 2,
      complexity: "Medium",
      status: "Completed",
    },
    {
      id: 2,
      staffId: 1,
      title: "Cardiology Rounds",
      type: "Rounds",
      date: "2025-04-15",
      startTime: "14:15",
      endTime: "16:15",
      hours: 2,
      complexity: "Medium",
      status: "Completed",
    },
    {
      id: 3,
      staffId: 1,
      title: "Patient Consultations",
      type: "Patient Consultation",
      date: "2025-04-15",
      startTime: "07:00",
      endTime: "09:00",
      hours: 2,
      complexity: "High",
      status: "Completed",
    },
    {
      id: 4,
      staffId: 1,
      title: "Cardiac Surgery - Patient #4872",
      type: "Surgery",
      date: "2025-04-14",
      startTime: "08:00",
      endTime: "12:00",
      hours: 4,
      complexity: "High",
      status: "Completed",
    },
    {
      id: 5,
      staffId: 2,
      title: "Neurological Assessment for Room 302",
      type: "Patient Consultation",
      date: "2025-04-15",
      startTime: "10:00",
      endTime: "11:30",
      hours: 1.5,
      complexity: "Medium",
      status: "Completed",
    },
    {
      id: 6,
      staffId: 2,
      title: "Review MRI Results",
      type: "Diagnostic Review",
      date: "2025-04-15",
      startTime: "13:00",
      endTime: "15:00",
      hours: 2,
      complexity: "High",
      status: "In Progress",
    },
    {
      id: 7,
      staffId: 2,
      title: "Neurology Department Meeting",
      type: "Administrative",
      date: "2025-04-14",
      startTime: "15:00",
      endTime: "16:00",
      hours: 1,
      complexity: "Low",
      status: "Completed",
    },
    {
      id: 8,
      staffId: 3,
      title: "Medication Rounds - Ward A",
      type: "Medication Administration",
      date: "2025-04-15",
      startTime: "06:00",
      endTime: "08:00",
      hours: 2,
      complexity: "Medium",
      status: "Completed",
    },
    {
      id: 9,
      staffId: 3,
      title: "Emergency Triage Support",
      type: "Patient Care",
      date: "2025-04-15",
      startTime: "10:00",
      endTime: "14:00",
      hours: 4,
      complexity: "High",
      status: "Completed",
    },
    {
      id: 10,
      staffId: 3,
      title: "Patient Discharge Processing",
      type: "Documentation",
      date: "2025-04-15",
      startTime: "14:30",
      endTime: "16:30",
      hours: 2,
      complexity: "Medium",
      status: "In Progress",
    },
    {
      id: 11,
      staffId: 4,
      title: "Pediatric Vital Checks",
      type: "Vital Sign Monitoring",
      date: "2025-04-15",
      startTime: "07:00",
      endTime: "09:00",
      hours: 2,
      complexity: "Medium",
      status: "Completed",
    },
    {
      id: 12,
      staffId: 5,
      title: "X-Ray Imaging - 6 Patients",
      type: "Diagnostic Testing",
      date: "2025-04-15",
      startTime: "08:00",
      endTime: "12:00",
      hours: 4,
      complexity: "Medium",
      status: "Completed",
    },
    {
      id: 13,
      staffId: 5,
      title: "MRI Scans - 3 Patients",
      type: "Diagnostic Testing",
      date: "2025-04-15",
      startTime: "13:00",
      endTime: "16:00",
      hours: 3,
      complexity: "High",
      status: "In Progress",
    },
    // Tasks for previous days - for weekly view
    {
      id: 14,
      staffId: 1,
      title: "Cardiac Surgery - Patient #4213",
      type: "Surgery",
      date: "2025-04-14",
      startTime: "09:00",
      endTime: "14:00",
      hours: 5,
      complexity: "High",
      status: "Completed",
    },
    {
      id: 15,
      staffId: 1,
      title: "Rounds - Cardiac Ward",
      type: "Rounds",
      date: "2025-04-14",
      startTime: "15:00",
      endTime: "17:00",
      hours: 2,
      complexity: "Medium",
      status: "Completed",
    },
  ]);

  // Calculate workload metrics for staff
  const calculateStaffWorkload = (
    staffId: number,
    date: string | null = null,
    weekStart: Date | null = null
  ): WorkloadMetrics => {
    let relevantTasks: Task[];

    if (date) {
      // Daily view
      relevantTasks = assignedTasks.filter(
        (task) => task.staffId === staffId && task.date === date
      );
    } else if (weekStart) {
      // Weekly view
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];

      relevantTasks = assignedTasks.filter(
        (task) =>
          task.staffId === staffId &&
          task.date >= weekStartStr &&
          task.date <= weekEndStr
      );
    } else {
      // All tasks
      relevantTasks = assignedTasks.filter((task) => task.staffId === staffId);
    }

    const totalHours = relevantTasks.reduce((sum, task) => sum + task.hours, 0);
    const taskCount = relevantTasks.length;

    // Calculate complexity distribution
    const complexityCount = {
      Low: relevantTasks.filter((t) => t.complexity === "Low").length,
      Medium: relevantTasks.filter((t) => t.complexity === "Medium").length,
      High: relevantTasks.filter((t) => t.complexity === "High").length,
    };

    // Calculate task type distribution
    const typeDistribution: Record<string, number> = {};
    relevantTasks.forEach((task) => {
      if (!typeDistribution[task.type]) {
        typeDistribution[task.type] = 0;
      }
      typeDistribution[task.type]++;
    });

    // Find staff info
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) {
      throw new Error(`Staff member with ID ${staffId} not found`);
    }

    // Calculate utilization (based on 8-hour workday)
    const dailyCapacity = 8; // hours per day
    const utilization = date
      ? (totalHours / dailyCapacity) * 100
      : (totalHours / staff.capacity) * 100;

    return {
      totalHours,
      taskCount,
      complexityDistribution: complexityCount,
      typeDistribution,
      utilization: Math.min(utilization, 100), // Cap at 100%
    };
  };

  // Function to get tasks for a specific date
  const getTasksForDate = (date: string): Task[] => {
    return assignedTasks.filter((task) => task.date === date);
  };

  // Function to get tasks for a specific week
  const getTasksForWeek = (weekStart: string): Task[] => {
    const weekStartDate = new Date(weekStart);
    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekStartStr = weekStartDate.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    return assignedTasks.filter(
      (task) => task.date >= weekStartStr && task.date <= weekEndStr
    );
  };

  // Get formatted date for display
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  // Generate week dates
  function getWeekDates(startDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const current = new Date(start);
      current.setDate(current.getDate() + i);
      dates.push(current.toISOString().split("T")[0]);
    }

    return dates;
  }

  // Get week start date (Sunday)
  function getWeekStartDate(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - dayOfWeek;
    const weekStart = new Date(today.setDate(diff));
    return weekStart;
  }

  // Format week range for display
  function formatWeekRange(startDate: string): string {
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(end.getDate() + 6);

    return `${new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(start)} - ${new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(end)}`;
  }

  // Format time for display
  const formatTime = (time: string): string => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Filter staff based on search and filters
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All Roles" || staff.role === filterRole;
    const matchesDept =
      filterDepartment === "All Departments" ||
      staff.department === filterDepartment;

    return matchesSearch && matchesRole && matchesDept;
  });

  // Get unique roles and departments for filters
  const roles = [
    "All Roles",
    ...Array.from(new Set(staffList.map((staff) => staff.role))),
  ];
  const departments = [
    "All Departments",
    ...Array.from(new Set(staffList.map((staff) => staff.department))),
  ];

  // Generate workload summary data for charts
  const generateWorkloadSummary = (): WorkloadSummaryData[] => {
    if (activeTab === "daily") {
      // For daily view
      const dailyData = filteredStaff.map((staff) => {
        const workload = calculateStaffWorkload(staff.id, selectedDate);
        return {
          name: staff.name.split(" ")[1], // Just last name for chart
          hours: workload.totalHours,
          tasks: workload.taskCount,
          utilization: workload.utilization,
          fullName: staff.name,
        };
      });

      return dailyData.sort((a, b) => b.utilization - a.utilization);
    } else {
      // For weekly view
      const weekStart = new Date(selectedWeek);
      const weeklyData = filteredStaff.map((staff) => {
        const workload = calculateStaffWorkload(staff.id, null, weekStart);
        return {
          name: staff.name.split(" ")[1], // Just last name for chart
          hours: workload.totalHours,
          tasks: workload.taskCount,
          utilization: workload.utilization,
          fullName: staff.name,
          capacity: staff.capacity,
        };
      });

      return weeklyData.sort((a, b) => b.utilization - a.utilization);
    }
  };

  // For task type distribution chart
  const generateTaskTypeData = (staffId: number | null): TaskTypeData[] => {
    if (!staffId) return [];

    const relevantTasks =
      activeTab === "daily"
        ? assignedTasks.filter(
            (task) => task.staffId === staffId && task.date === selectedDate
          )
        : getTasksForWeek(selectedWeek).filter(
            (task) => task.staffId === staffId
          );

    const typeCount: Record<string, number> = {};
    relevantTasks.forEach((task) => {
      if (!typeCount[task.type]) {
        typeCount[task.type] = 0;
      }
      typeCount[task.type]++;
    });

    return Object.keys(typeCount).map((type) => ({
      name: type,
      value: typeCount[type],
    }));
  };

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
  ];

  // Generate day labels for the week
  const weekDays: WeekDay[] = getWeekDates(selectedWeek).map((date) => ({
    date,
    label: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
  }));

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Staff Workload Tracker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 container mx-auto p-4 gap-4">
        {/* Staff Directory Column */}
        <div className="w-1/4 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Staff Directory
          </h2>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-1/2">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredStaff.map((staff) => {
              const workload =
                activeTab === "daily"
                  ? calculateStaffWorkload(staff.id, selectedDate)
                  : calculateStaffWorkload(
                      staff.id,
                      null,
                      new Date(selectedWeek)
                    );

              return (
                <div
                  key={staff.id}
                  className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between ${
                    selectedStaff?.id === staff.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={staff.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full bg-gray-200"
                    />
                    <div>
                      <h3 className="font-medium">{staff.name}</h3>
                      <p className="text-xs text-gray-600">
                        {staff.role} • {staff.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        staff.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {staff.status}
                    </span>
                    <div className="mt-1 flex items-center text-xs">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            workload.utilization > 90
                              ? "bg-red-500"
                              : workload.utilization > 75
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${workload.utilization}%` }}
                        />
                      </div>
                      <span>{Math.round(workload.utilization)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Content: Workload Dashboard */}
        <div className="w-3/4 space-y-4">
          {/* Time period selector */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === "daily"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("daily")}
                >
                  Daily View
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === "weekly"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("weekly")}
                >
                  Weekly View
                </button>
              </div>

              {activeTab === "daily" ? (
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-3 py-1"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {formatWeekRange(selectedWeek)}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      onClick={() => {
                        const newDate = new Date(selectedWeek);
                        newDate.setDate(newDate.getDate() - 7);
                        setSelectedWeek(newDate.toISOString().split("T")[0]);
                      }}
                    >
                      ◀
                    </button>
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      onClick={() => {
                        const newDate = new Date(selectedWeek);
                        newDate.setDate(newDate.getDate() + 7);
                        setSelectedWeek(newDate.toISOString().split("T")[0]);
                      }}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Workload Overview */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Staff Workload Overview
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={generateWorkloadSummary()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "Hours",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Utilization %",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "utilization")
                        return [`${Math.round(value)}%`, "Utilization"];
                      if (name === "hours") return [`${value} hrs`, "Hours"];
                      if (name === "tasks") return [value, "Tasks"];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="hours"
                    name="Work Hours"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="tasks"
                    name="Task Count"
                    fill="#82ca9d"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="utilization"
                    name="Utilization %"
                    fill="#ffc658"
                  >
                    {generateWorkloadSummary().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.utilization > 90
                            ? "#ef4444"
                            : entry.utilization > 75
                            ? "#f59e0b"
                            : "#10b981"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Staff Detail View (when selected) */}
          {selectedStaff && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {selectedStaff.name}'s Workload
                </h2>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Left column - Stats */}
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h3 className="text-xs text-gray-500">Total Hours</h3>
                      <p className="text-xl font-bold">
                        {activeTab === "daily"
                          ? calculateStaffWorkload(
                              selectedStaff.id,
                              selectedDate
                            ).totalHours
                          : calculateStaffWorkload(
                              selectedStaff.id,
                              null,
                              new Date(selectedWeek)
                            ).totalHours}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h3 className="text-xs text-gray-500">Tasks</h3>
                      <p className="text-xl font-bold">
                        {activeTab === "daily"
                          ? calculateStaffWorkload(
                              selectedStaff.id,
                              selectedDate
                            ).taskCount
                          : calculateStaffWorkload(
                              selectedStaff.id,
                              null,
                              new Date(selectedWeek)
                            ).taskCount}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h3 className="text-xs text-gray-500">Utilization</h3>
                      <p className="text-xl font-bold">
                        {Math.round(
                          activeTab === "daily"
                            ? calculateStaffWorkload(
                                selectedStaff.id,
                                selectedDate
                              ).utilization
                            : calculateStaffWorkload(
                                selectedStaff.id,
                                null,
                                new Date(selectedWeek)
                              ).utilization
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Task Type Distribution */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2">
                      Task Type Distribution
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie
                            data={generateTaskTypeData(selectedStaff.id)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value, percent }) =>
                              `${name}: ${value} (${(percent * 100).toFixed(
                                0
                              )}%)`
                            }
                          >
                            {generateTaskTypeData(selectedStaff.id).map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip formatter={(value) => [value, "Tasks"]} />
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Right column - Tasks */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    {activeTab === "daily"
                      ? `Tasks for ${formatDate(selectedDate)}`
                      : `Tasks for ${formatWeekRange(selectedWeek)}`}
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {activeTab === "daily"
                      ? assignedTasks
                          .filter(
                            (task) =>
                              task.staffId === selectedStaff.id &&
                              task.date === selectedDate
                          )
                          .map((task) => (
                            <div
                              key={task.id}
                              className="border border-gray-200 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{task.title}</h4>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    task.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : task.status === "In Progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </div>
                              <div className="mt-2 grid grid-cols-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(task.startTime)} -{" "}
                                  {formatTime(task.endTime)}
                                </div>
                                <div>{task.type}</div>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      task.complexity === "High"
                                        ? "bg-red-500"
                                        : task.complexity === "Medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                                  ></span>
                                  {task.complexity} Complexity
                                </div>
                              </div>
                            </div>
                          ))
                      : // Weekly tasks
                        getTasksForWeek(selectedWeek)
                          .filter((task) => task.staffId === selectedStaff.id)
                          .sort((a, b) => a.date.localeCompare(b.date))
                          .map((task) => (
                            <div
                              key={task.id}
                              className="border border-gray-200 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{task.title}</h4>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    task.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : task.status === "In Progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </div>
                              <div className="mt-2 grid grid-cols-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(task.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(task.startTime)} -{" "}
                                  {formatTime(task.endTime)}
                                </div>
                                <div>{task.type}</div>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      task.complexity === "High"
                                        ? "bg-red-500"
                                        : task.complexity === "Medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                                  ></span>
                                  {task.complexity} Complexity
                                </div>
                              </div>
                            </div>
                          ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Calendar (for weekly view) */}
          {activeTab === "weekly" && !selectedStaff && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Weekly Staff Schedule
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 p-2 bg-gray-50 text-left">
                        Staff
                      </th>
                      {weekDays.map((day) => (
                        <th
                          key={day.date}
                          className="border border-gray-200 p-2 bg-gray-50 text-center"
                        >
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((staff) => (
                      <tr key={staff.id}>
                        <td className="border border-gray-200 p-2 font-medium">
                          {staff.name}
                        </td>
                        {weekDays.map((day) => {
                          const dayTasks = assignedTasks.filter(
                            (task) =>
                              task.staffId === staff.id &&
                              task.date === day.date
                          );
                          const dayHours = dayTasks.reduce(
                            (sum, task) => sum + task.hours,
                            0
                          );

                          return (
                            <td
                              key={day.date}
                              className="border border-gray-200 p-1 text-center"
                            >
                              {dayTasks.length > 0 ? (
                                <div
                                  className={`text-xs p-1 rounded ${
                                    dayHours > 8
                                      ? "bg-red-100"
                                      : dayHours > 6
                                      ? "bg-yellow-100"
                                      : "bg-green-100"
                                  }`}
                                >
                                  <div className="font-semibold">
                                    {dayHours} hrs
                                  </div>
                                  <div className="text-gray-600">
                                    {dayTasks.length} tasks
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  No tasks
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily schedule (for daily view) */}
          {activeTab === "daily" && !selectedStaff && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Daily Staff Schedule for {formatDate(selectedDate)}
              </h2>

              <div className="space-y-4">
                {filteredStaff
                  .filter((staff) =>
                    assignedTasks.some(
                      (task) =>
                        task.staffId === staff.id && task.date === selectedDate
                    )
                  )
                  .map((staff) => {
                    const staffTasks = assignedTasks.filter(
                      (task) =>
                        task.staffId === staff.id && task.date === selectedDate
                    );

                    return (
                      <div
                        key={staff.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={staff.avatar}
                            alt=""
                            className="h-8 w-8 rounded-full bg-gray-200"
                          />
                          <h3 className="font-medium">{staff.name}</h3>
                          <span className="text-sm text-gray-500">
                            {staffTasks.reduce(
                              (sum, task) => sum + task.hours,
                              0
                            )}{" "}
                            hours
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {staffTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-2 rounded-md text-sm ${
                                task.status === "Completed"
                                  ? "bg-green-50 border border-green-200"
                                  : task.status === "In Progress"
                                  ? "bg-yellow-50 border border-yellow-200"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="font-medium">{task.title}</div>
                              <div className="text-xs text-gray-500 flex justify-between mt-1">
                                <span>
                                  {formatTime(task.startTime)} -{" "}
                                  {formatTime(task.endTime)}
                                </span>
                                <span>{task.hours} hrs</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                {/* No tasks message */}
                {filteredStaff.filter((staff) =>
                  assignedTasks.some(
                    (task) =>
                      task.staffId === staff.id && task.date === selectedDate
                  )
                ).length === 0 && (
                  <div className="text-center p-6 text-gray-500">
                    No tasks scheduled for the selected date.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
