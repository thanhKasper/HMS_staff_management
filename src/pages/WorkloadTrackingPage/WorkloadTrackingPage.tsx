import {
  BarChart3,
  Calendar as CalendarIcon,
  Search,
  User,
  X,
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

export default function StaffWorkloadTracker() {
  const [selectedStaff, setSelectedStaff] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample staff data
  const staffList = [
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

  // Sample tasks data
  const [assignedTasks] = useState([
    {
      id: 1,
      staffId: 1,
      title: "Review Cardiac Test Results",
      type: "Diagnostic Review",
      date: "2025-04-15",
      startTime: "09:30",
      endTime: "11:30",
      hours: 2,
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
      status: "In Progress",
    },
    {
      id: 14,
      staffId: 1,
      title: "Cardiac Surgery - Patient #4213",
      type: "Surgery",
      date: "2025-04-14",
      startTime: "09:00",
      endTime: "14:00",
      hours: 5,
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
      status: "Completed",
    },
  ]);

  // Calculate workload metrics for staff
  const calculateStaffWorkload = (staffId: number, date: string) => {
    // Daily view
    const relevantTasks = assignedTasks.filter(
      (task) => task.staffId === staffId && task.date === date
    );

    const totalHours = relevantTasks.reduce((sum, task) => sum + task.hours, 0);
    const taskCount = relevantTasks.length;

    // Calculate task type distribution
    const typeDistribution: Record<string, number> = {};
    relevantTasks.forEach((task) => {
      if (!typeDistribution[task.type]) {
        typeDistribution[task.type] = 0;
      }
      typeDistribution[task.type]++;
    });

    // Calculate utilization (based on 8-hour workday)
    const dailyCapacity = 8; // hours per day
    const utilization = (totalHours / dailyCapacity) * 100;

    return {
      totalHours,
      taskCount,
      typeDistribution,
      utilization: Math.min(utilization, 100), // Cap at 100%
    };
  };

  // Function to get tasks for a specific date
  const getTasksForDate = (date: string) => {
    return assignedTasks.filter((task) => task.date === date);
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
  const roles = ["All Roles", ...new Set(staffList.map((staff) => staff.role))];
  const departments = [
    "All Departments",
    ...new Set(staffList.map((staff) => staff.department)),
  ];

  // For task type distribution chart
  const generateTaskTypeData = (staffId: number) => {
    if (!staffId) return [];

    const relevantTasks = assignedTasks.filter(
      (task) => task.staffId === staffId && task.date === selectedDate
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
              const workload = calculateStaffWorkload(staff.id, selectedDate);

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
          {/* Date selector */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Daily View</h2>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-1"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
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

              <div className=" gap-4">
                {/* Left column - Stats */}
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800">
                        Total Hours
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {
                          calculateStaffWorkload(selectedStaff.id, selectedDate)
                            .totalHours
                        }
                      </p>
                      <p className="text-xs text-blue-600">8 hour capacity</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800">
                        Tasks Assigned
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          calculateStaffWorkload(selectedStaff.id, selectedDate)
                            .taskCount
                        }
                      </p>
                      <p className="text-xs text-green-600">
                        Daily assignments
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Utilization
                    </h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                        <div
                          className={`h-4 rounded-full ${
                            calculateStaffWorkload(
                              selectedStaff.id,
                              selectedDate
                            ).utilization > 90
                              ? "bg-red-500"
                              : calculateStaffWorkload(
                                  selectedStaff.id,
                                  selectedDate
                                ).utilization > 75
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              calculateStaffWorkload(
                                selectedStaff.id,
                                selectedDate
                              ).utilization
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-lg font-bold">
                        {Math.round(
                          calculateStaffWorkload(selectedStaff.id, selectedDate)
                            .utilization
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Task type distribution chart */}
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Task Distribution
                    </h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RPieChart>
                          <Pie
                            data={generateTaskTypeData(selectedStaff.id)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {generateTaskTypeData(selectedStaff.id).map(
                              (_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip formatter={(value, name) => [value, name]} />
                        </RPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Analytics for Hospital Context */}
          {!selectedStaff && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Hospital Staff Workload Insights
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">
                    Staff Utilization
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      filteredStaff.reduce(
                        (sum, staff) =>
                          sum +
                          calculateStaffWorkload(staff.id, selectedDate)
                            .utilization,
                        0
                      ) / filteredStaff.length
                    )}
                    %
                  </p>
                  <p className="text-xs text-blue-600">
                    Average across all departments
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">
                    Active Staff Members
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      staffList.filter((staff) => staff.status === "Active")
                        .length
                    }
                  </p>
                  <p className="text-xs text-green-600">
                    Out of {staffList.length} total
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">
                    Total Assigned Hours
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {getTasksForDate(selectedDate).reduce(
                      (sum, task) => sum + task.hours,
                      0
                    )}
                  </p>
                  <p className="text-xs text-purple-600">
                    {"Today's workload"}
                  </p>
                </div>
              </div>

              {/* Department workload comparison */}
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {"Today's"} Department Workload Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(() => {
                        const deptData: Record<
                          string,
                          {
                            name: string;
                            hours: number;
                            tasks: number;
                            staff: number;
                          }
                        > = {};
                        const tasks = getTasksForDate(selectedDate);

                        departments
                          .filter((d) => d !== "All Departments")
                          .forEach((dept) => {
                            deptData[dept] = {
                              name: dept,
                              hours: 0,
                              tasks: 0,
                              staff: 0,
                            };
                          });

                        // Count staff by department
                        staffList.forEach((staff) => {
                          if (deptData[staff.department]) {
                            deptData[staff.department].staff += 1;
                          }
                        });

                        // Sum tasks and hours by department
                        tasks.forEach((task) => {
                          const staff = staffList.find(
                            (s) => s.id === task.staffId
                          );
                          if (!staff || !deptData[staff.department]) return;

                          deptData[staff.department].hours += task.hours;
                          deptData[staff.department].tasks += 1;
                        });

                        return Object.values(deptData);
                      })()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        label={{
                          value: "Hours/Tasks",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{
                          value: "Staff Count",
                          angle: 90,
                          position: "insideRight",
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="hours"
                        name="Total Hours"
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
                        dataKey="staff"
                        name="Staff Count"
                        fill="#ffc658"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
