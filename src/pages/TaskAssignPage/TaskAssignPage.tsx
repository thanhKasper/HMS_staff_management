import { useEffect, useState } from "react";
import { Calendar, Clock, User, X, Plus, Filter, Search } from "lucide-react";
import axios from "axios";

// Define types for our data structures
interface Staff {
  id: number;
  name: string;
  role: string;
  department: string;
  status: string;
}

interface Task {
  id: number;
  staffId: number;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  description?: string;
}

type TaskCategoryMap = {
  [key: string]: string[];
};

export default function TaskAssignmentPage() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskDate, setTaskDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [taskStartTime, setTaskStartTime] = useState<string>("");
  const [taskEndTime, setTaskEndTime] = useState<string>("");
  const [taskCategory, setTaskCategory] = useState<string>("");
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    async function getAllStaff() {
      const staff = (
        await axios.get<Staff[]>("http://localhost:3000/api/staff")
      ).data;
      console.log(staff);
      setStaffList(staff);
    }
    getAllStaff();
  }, []);

  useEffect(() => {
    async function getDepartments() {
      const department = await axios.get<{ department: string[] }>(
        "http://localhost:3000/api/staff/departments"
      );
      console.log("Departments:");
      console.log(department.data.department);
      setDepartments(department.data.department);
    }

    getDepartments();
  }, []);

  // Sample task categories based on staff roles
  const taskCategories: TaskCategoryMap = {
    Doctor: [
      "Patient Consultation",
      "Medical Procedure",
      "Diagnostic Review",
      "Treatment Planning",
      "Medical Documentation",
    ],
    Nurse: [
      "Patient Care",
      "Medication Administration",
      "Vital Sign Monitoring",
      "Patient Education",
      "Care Coordination",
    ],
    Technician: ["Diagnostic Testing", "Equipment Maintenance"],
    Janitor: [
      "Cleaning and Disinfection",
      "Waste Disposal",
      "Inventory Management",
      "Safety Inspections",
    ],
  };

  // Sample assigned tasks - updated with start and end times
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function getAllTasks() {
      const tasks = await axios.get<Task[]>("http://localhost:3000/api/tasks");
      console.log("Tasks:");
      console.log(tasks.data);
      setAssignedTasks(tasks.data);
    }
    getAllTasks();
  }, []);

  const handleAssignTask = async (): Promise<void> => {
    if (
      !selectedStaff ||
      !taskTitle ||
      !taskDate ||
      !taskStartTime ||
      !taskEndTime
    )
      return;

    const newTask = {
      // id: assignedTasks.length + 1,
      staffId: selectedStaff.id,
      title: taskTitle,
      category: taskCategory,
      date: taskDate,
      startTime: taskStartTime,
      endTime: taskEndTime,
      // status: "Pending",
    };

    const newTaskCreate = (
      await axios.post<Task>("http://localhost:3000/api/tasks/", {
        ...newTask,
      })
    ).data;

    setAssignedTasks([...assignedTasks, newTaskCreate]);

    // Reset form
    setTaskTitle("");
    setTaskDescription("");
    setTaskCategory("");
    // Don't reset the date as it defaults to today
    setTaskStartTime("");
    setTaskEndTime("");
  };

  const filterTasksByStaff = (staffId: number): Task[] => {
    return assignedTasks.filter((task) => task.staffId === staffId);
  };

  const getStaffById = (staffId: number): Staff | undefined => {
    return staffList.find((staff) => staff.id === staffId);
  };

  // Format time for display
  const formatTime = (time: string): string => {
    if (!time) return "";

    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const filterStaffBasedOnDepartment = async (
    department: string
  ): Promise<void> => {
    console.log("filter department: ", department);
    if (department) {
      const filteredStaff = staffList.filter(
        (staff) => staff.department === department
      );
      setStaffList(filteredStaff);
    } else {
      const staff = (
        await axios.get<Staff[]>("http://localhost:3000/api/staff")
      ).data;
      setStaffList(staff);
    }
  };

  const filterStaffBasedOnStatus = async (status: string): Promise<void> => {
    if (status) {
      const filteredStaff = staffList.filter(
        (staff) => staff.status === status
      );
      setStaffList(filteredStaff);
    } else {
      const staff = (
        await axios.get<Staff[]>("http://localhost:3000/api/staff")
      ).data;
      setStaffList(staff);
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Main Content */}
      <main className="flex flex-1 container mx-auto p-4 gap-4">
        {/* Staff Directory Column */}
        <div className="w-1/3 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Staff Directory</h2>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-1/2">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => filterStaffBasedOnDepartment(e.target.value)}
              >
                <option value={""}>All Departments</option>
                {departments &&
                  departments.map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-1/2">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => filterStaffBasedOnStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between ${
                  selectedStaff?.id === staff.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedStaff(staff)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">{staff.name}</h3>
                    <p className="text-sm text-gray-600">
                      {staff.role} • {staff.department}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    staff.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {staff.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Assignment Column */}
        <div className="w-2/3">
          {/* New Task Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Assign New Task</h2>
              {selectedStaff && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <span>Assigning to: {selectedStaff.name}</span>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {!selectedStaff ? (
              <div className="text-center py-6 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Select a staff member from the directory to assign a task</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {selectedStaff &&
                        taskCategories[selectedStaff.role]?.map(
                          (category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          )
                        )}
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                      />
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Start Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                        value={taskStartTime}
                        onChange={(e) => setTaskStartTime(e.target.value)}
                      />
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      End Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                        value={taskEndTime}
                        onChange={(e) => setTaskEndTime(e.target.value)}
                      />
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={handleAssignTask}
                  >
                    <Plus className="h-4 w-4" />
                    Assign Task
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedStaff
                  ? `Tasks Assigned to ${selectedStaff.name}`
                  : "All Assigned Tasks"}
              </h2>

              <div className="flex items-center gap-2">
                <select className="p-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>

                <button className="p-2 border border-gray-300 rounded-lg">
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {assignedTasks.length === 0 ||
            (selectedStaff &&
              filterTasksByStaff(selectedStaff.id).length === 0) ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p>No tasks assigned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(selectedStaff
                  ? filterTasksByStaff(selectedStaff.id)
                  : assignedTasks
                ).map((task) => {
                  const staff = getStaffById(task.staffId);
                  return (
                    <div
                      key={task.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">
                              {task.category}
                            </span>
                            <span>•</span>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Date: {task.date}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {formatTime(task.startTime)} -{" "}
                                {formatTime(task.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`mt-2 px-2 py-1 text-xs rounded-full ${
                              task.status === "Pending"
                                ? "bg-gray-100 text-gray-800"
                                : task.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                      {!selectedStaff && (
                        <div className="mt-2 flex items-center">
                          <div className="h-6 w-6 bg-gray-200 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Assigned to: {staff?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
