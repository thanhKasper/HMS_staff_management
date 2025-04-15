import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  User,
  X,
} from "lucide-react";
import { useState, JSX, useEffect } from "react";

// Define TypeScript interfaces for data structures
interface StaffMember {
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
  department: string;
}

export default function StaffSchedulingPage(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  // const [viewMode, setViewMode] = useState<"day" | "week">("day"); // "day" or "week"
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  useEffect(() => {
    async function getStaff() {
      const staffData = await axios.get("http://localhost:3000/api/staff");
      console.log(staffData.data);
      setStaffList(staffData.data);
    }
    getStaff();
  }, []);

  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function getTodayTasks() {
      const todayTasks = await axios.get("http://localhost:3000/api/tasks");
      console.log(todayTasks.data);
      setAssignedTasks(todayTasks.data);
    }
    getTodayTasks();
  }, []);

  // Get all unique departments
  const departments: string[] = [
    ...new Set(staffList.map((staff) => staff.department)),
  ];

  // Create time slots with half-hour intervals for better precision
  const timeSlots: string[] = [];
  for (let hour = 6; hour < 22; hour++) {
    // 8 AM to 8 PM
    timeSlots.push(`${hour}:00`);
    // timeSlots.push(`${hour}:15`);
    timeSlots.push(`${hour}:30`);
    // timeSlots.push(`${hour}:45`);
  }

  // Format time from 24h to 12h
  const formatTime = (time: string): string => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
    // return `${hours}:${minutes}`;
  };

  // Format date to display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Navigate to the previous or next day
  const navigateDate = (direction: "prev" | "next"): void => {
    const date = new Date(selectedDate);

    date.setDate(date.getDate() + (direction === "prev" ? -1 : 1));

    setSelectedDate(date.toISOString().split("T")[0]);
  };

  // Toggle staff selection
  const toggleStaffSelection = (staffId: number): void => {
    if (selectedStaffIds.includes(staffId)) {
      setSelectedStaffIds(selectedStaffIds.filter((id) => id !== staffId));
    } else {
      setSelectedStaffIds([...selectedStaffIds, staffId]);
    }
  };

  // Filter the staff list based on search term and department
  const filteredStaff: StaffMember[] = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "" || staff.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Filter the staff to display in the schedule
  const staffToDisplay: StaffMember[] =
    selectedStaffIds.length > 0
      ? staffList.filter((staff) => selectedStaffIds.includes(staff.id))
      : filteredStaff;

  // Filter tasks for the selected date and staff
  const getFilteredTasks = (date: string, staffId: number): Task[] => {
    const tasks = assignedTasks.filter(
      (task) => task.date === date && task.staffId === staffId
    );
    console.log(tasks);
    return tasks;
  };

  // Convert time string to decimal hours for positioning
  const timeToDecimal = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours + minutes / 60;
  };

  // Check if a staff member is free during a specific time slot
  const isStaffFree = (staffId: number, timeSlot: string): boolean => {
    const tasks = getFilteredTasks(selectedDate, staffId);
    const slotTime = timeToDecimal(timeSlot);

    for (const task of tasks) {
      const startTime = timeToDecimal(task.startTime);
      const endTime = timeToDecimal(task.endTime);

      if (slotTime >= startTime && slotTime < endTime) {
        return false;
      }
    }

    return true;
  };

  // If showAvailableOnly is true, filter staff to only those available in the next time slot
  const availableStaff: StaffMember[] = showAvailableOnly
    ? staffToDisplay.filter((staff) => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const roundedMinute = currentMinute < 30 ? 30 : 0;
        const nextHour = roundedMinute === 0 ? currentHour + 1 : currentHour;
        const timeSlot = `${nextHour}:${roundedMinute === 0 ? "00" : "30"}`;
        return isStaffFree(staff.id, timeSlot);
      })
    : staffToDisplay;

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      {/* Page Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">Staff Scheduling Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 container mx-auto p-4 gap-4">
        {/* Filters Column */}
        <div className="w-1/4 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h2>

          <div className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate("prev")}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <input
                  type="date"
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                  onClick={() => navigateDate("next")}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(selectedDate)}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Staff Search */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Search Staff
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or role..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Available Only Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availableOnly"
                className="h-4 w-4 text-blue-600 rounded"
                checked={showAvailableOnly}
                onChange={() => setShowAvailableOnly(!showAvailableOnly)}
              />
              <label htmlFor="availableOnly" className="ml-2 text-sm">
                Show available staff only
              </label>
            </div>

            {/* Staff Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Staff Selection
              </label>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleStaffSelection(staff.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded"
                        checked={selectedStaffIds.includes(staff.id)}
                        onChange={() => {}} // Handled by the div onClick
                      />
                      <div className="ml-2">
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-xs text-gray-500">
                          {staff.department}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {staff.role}
                    </span>
                  </div>
                ))}
                {filteredStaff.length === 0 && (
                  <div className="p-3 text-center text-gray-500">
                    No staff members match your filters
                  </div>
                )}
              </div>
            </div>

            {/* Selected Staff Display */}
            {selectedStaffIds.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Selected Staff</label>
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => setSelectedStaffIds([])}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStaffIds.map((id) => {
                    const staff = staffList.find((s) => s.id === id);
                    return staff ? (
                      <div
                        key={id}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{staff.name}</span>
                        <button onClick={() => toggleStaffSelection(id)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule View */}
        <div className="w-3/4 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Daily Schedule {formatDate(selectedDate)}
          </h2>

          {availableStaff.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No staff members match current filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-40 p-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                      Staff
                    </th>
                    {timeSlots.map((time, index) => (
                      <th
                        key={index}
                        className="p-2 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase"
                        style={{ minWidth: "80px" }} // Fixed width for each time column
                      >
                        {formatTime(time)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availableStaff.map((staff) => {
                    const staffTasks = getFilteredTasks(selectedDate, staff.id);

                    return (
                      <tr key={staff.id}>
                        <td className="p-3 border-b border-gray-200">
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-xs text-gray-500">
                            {staff.department}
                          </div>
                        </td>

                        {timeSlots.map((timeSlot, index) => {
                          // Convert current time slot to decimal
                          const currentSlotTime = timeToDecimal(timeSlot);
                          const nextSlotTime = currentSlotTime + 0.5; // Next slot is 30 minutes later

                          // Check for tasks that overlap with this time slot
                          const overlappingTask = staffTasks.find((task) => {
                            const taskStart = timeToDecimal(task.startTime);
                            const taskEnd = timeToDecimal(task.endTime);

                            // A task overlaps with this slot if:
                            // 1. Task starts within this slot, OR
                            // 2. Task ends within this slot, OR
                            // 3. Task spans over this slot (starts before and ends after)
                            return (
                              (taskStart >= currentSlotTime &&
                                taskStart < nextSlotTime) || // Starts in this slot
                              (taskEnd > currentSlotTime &&
                                taskEnd <= nextSlotTime) || // Ends in this slot
                              (taskStart <= currentSlotTime &&
                                taskEnd >= nextSlotTime) // Spans over this slot
                            );
                          });

                          // Determine if this is the starting slot for the task
                          const isTaskStart =
                            overlappingTask &&
                            // Either the task starts in this slot
                            ((timeToDecimal(overlappingTask.startTime) >=
                              currentSlotTime &&
                              timeToDecimal(overlappingTask.startTime) <
                                nextSlotTime) ||
                              // Or this is the first slot we encounter for a task that might start before our first slot
                              (index === 0 &&
                                timeToDecimal(overlappingTask.startTime) <
                                  currentSlotTime));

                          if (overlappingTask && isTaskStart) {
                            // Calculate how many slots this task spans
                            const taskStart = timeToDecimal(
                              overlappingTask.startTime
                            );
                            const taskEnd = timeToDecimal(
                              overlappingTask.endTime
                            );

                            // Find which slot the task ends in
                            const endSlotIndex = timeSlots.findIndex((slot) => {
                              const slotTime = timeToDecimal(slot);
                              return slotTime >= taskEnd;
                            });

                            // Calculate slots spanned
                            let slotsSpanned;
                            if (endSlotIndex === -1) {
                              // Task ends after the last slot
                              slotsSpanned = timeSlots.length - index;
                            } else {
                              slotsSpanned = endSlotIndex - index;
                              // Ensure minimum of 1 slot for very short tasks
                              if (slotsSpanned < 1) slotsSpanned = 1;
                            }

                            return (
                              <td
                                key={index}
                                colSpan={slotsSpanned}
                                className="border-b border-gray-200 bg-blue-100 p-1"
                              >
                                <div className="h-16 flex flex-col justify-center p-1">
                                  <div className="font-medium text-xs text-blue-800">
                                    {overlappingTask.title}
                                  </div>
                                  <div className="text-xs text-blue-600">
                                    {formatTime(overlappingTask.startTime)} -{" "}
                                    {formatTime(overlappingTask.endTime)}
                                  </div>
                                  <div className="text-xs text-blue-700 mt-1">
                                    {overlappingTask.category}
                                  </div>
                                </div>
                              </td>
                            );
                          } else if (overlappingTask && !isTaskStart) {
                            // Skip rendering cells that are covered by a task's colspan
                            return null;
                          } else {
                            // Free time slot
                            return (
                              <td
                                key={index}
                                className="border-b border-gray-200 bg-green-50 p-1 text-center"
                              >
                                <div className="h-16 flex items-center justify-center text-xs text-green-700">
                                  Available
                                </div>
                              </td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
