import { useState } from "react";
import { Calendar, Clock, User, Filter, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function StaffSchedulingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("day"); // "day" or "week"
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  // Sample staff data from the hospital system
  const staffList = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Doctor",
      department: "Cardiology",
      status: "Active",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Doctor",
      department: "Neurology",
      status: "Active",
    },
    {
      id: 3,
      name: "Rebecca Torres",
      role: "Nurse",
      department: "Registered Nurse",
      status: "Active",
    },
    {
      id: 4,
      name: "John Patterson",
      role: "Nurse",
      department: "Pediatric Nurse",
      status: "Active",
    },
    {
      id: 5,
      name: "Dr. Alicia Gomez",
      role: "Doctor",
      department: "Oncology",
      status: "Active",
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      role: "Doctor",
      department: "Cardiology",
      status: "Active",
    },
    {
      id: 7,
      name: "Maria Rodriguez",
      role: "Nurse",
      department: "Registered Nurse",
      status: "Active",
    },
  ];
  
  // Sample assigned tasks with start and end times
  const assignedTasks = [
    {
      id: 1,
      staffId: 1,
      title: "Review Cardiac Test Results",
      category: "Diagnostic Review",
      date: "2025-04-14", // Today
      startTime: "10:30",
      endTime: "11:30",
      status: "Pending",
      department: "Cardiology",
    },
    {
      id: 2,
      staffId: 2,
      title: "Neurological Assessment for Room 302",
      category: "Patient Consultation",
      date: "2025-04-14", // Today
      startTime: "14:15",
      endTime: "15:00",
      status: "Pending",
      department: "Neurology",
    },
    {
      id: 3,
      staffId: 3,
      title: "Administer Medications to Ward B",
      category: "Medication Administration",
      date: "2025-04-14", // Today
      startTime: "08:00",
      endTime: "09:00",
      status: "In Progress",
      department: "Registered Nurse",
    },
    {
      id: 4,
      staffId: 1,
      title: "Patient Consultation - Mr. Smith",
      category: "Patient Consultation",
      date: "2025-04-14", // Today
      startTime: "13:00",
      endTime: "13:45",
      status: "Pending",
      department: "Cardiology",
    },
    {
      id: 5,
      staffId: 4,
      title: "Check Vital Signs - Pediatric Ward",
      category: "Vital Sign Monitoring",
      date: "2025-04-14", // Today
      startTime: "09:30",
      endTime: "10:30",
      status: "Pending",
      department: "Pediatric Nurse",
    },
    {
      id: 6,
      staffId: 5,
      title: "Patient Treatment Plan Review",
      category: "Treatment Planning",
      date: "2025-04-14", // Today
      startTime: "11:00",
      endTime: "12:00",
      status: "Pending",
      department: "Oncology",
    },
    {
      id: 7,
      staffId: 6,
      title: "Cardiac Surgery Prep",
      category: "Medical Procedure",
      date: "2025-04-14", // Today
      startTime: "08:30",
      endTime: "10:30",
      status: "In Progress",
      department: "Cardiology",
    },
  ];

  // Get all unique departments
  const departments = [...new Set(staffList.map(staff => staff.department))];
  
  // Create time slots with half-hour intervals for better precision
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) { // 8 AM to 8 PM
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }
  
  // Format time from 24h to 12h
  const formatTime = (time) => {
    if (!time) return "";
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Navigate to the previous or next day
  const navigateDate = (direction) => {
    const date = new Date(selectedDate);
    
    if (viewMode === "day") {
      date.setDate(date.getDate() + (direction === "prev" ? -1 : 1));
    } else {
      date.setDate(date.getDate() + (direction === "prev" ? -7 : 7));
    }
    
    setSelectedDate(date.toISOString().split('T')[0]);
  };
  
  // Toggle staff selection
  const toggleStaffSelection = (staffId) => {
    if (selectedStaffIds.includes(staffId)) {
      setSelectedStaffIds(selectedStaffIds.filter(id => id !== staffId));
    } else {
      setSelectedStaffIds([...selectedStaffIds, staffId]);
    }
  };
  
  // Filter the staff list based on search term and department
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "" || staff.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });
  
  // Filter the staff to display in the schedule
  const staffToDisplay = selectedStaffIds.length > 0 
    ? staffList.filter(staff => selectedStaffIds.includes(staff.id))
    : filteredStaff;
  
  // Filter tasks for the selected date and staff
  const getFilteredTasks = (date, staffId) => {
    return assignedTasks.filter(task => 
      task.date === date && 
      task.staffId === staffId
    );
  };
  
  // Convert time string to decimal hours for positioning
  const timeToDecimal = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + (minutes / 60);
  };
  
  // Check if a staff member is free during a specific time slot
  const isStaffFree = (staffId, timeSlot) => {
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
  const availableStaff = showAvailableOnly 
    ? staffToDisplay.filter(staff => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const roundedMinute = currentMinute < 30 ? 30 : 0;
        const nextHour = roundedMinute === 0 ? currentHour + 1 : currentHour;
        const timeSlot = `${nextHour}:${roundedMinute === 0 ? '00' : '30'}`;
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
                <button onClick={() => navigateDate("prev")} className="p-1 rounded hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <input 
                  type="date" 
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button onClick={() => navigateDate("next")} className="p-1 rounded hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-1">{formatDate(selectedDate)}</div>
            </div>
            
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium mb-1">View Mode</label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  className={`flex-1 py-2 text-center ${viewMode === "day" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
                  onClick={() => setViewMode("day")}
                >
                  Day
                </button>
                <button 
                  className={`flex-1 py-2 text-center ${viewMode === "week" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
                  onClick={() => setViewMode("week")}
                >
                  Week
                </button>
              </div>
            </div>
            
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Staff Search */}
            <div>
              <label className="block text-sm font-medium mb-1">Search Staff</label>
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
              <label className="block text-sm font-medium mb-2">Staff Selection</label>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {filteredStaff.map(staff => (
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
                        <div className="text-xs text-gray-500">{staff.department}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{staff.role}</span>
                  </div>
                ))}
                {filteredStaff.length === 0 && (
                  <div className="p-3 text-center text-gray-500">No staff members match your filters</div>
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
                  {selectedStaffIds.map(id => {
                    const staff = staffList.find(s => s.id === id);
                    return (
                      <div key={id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span>{staff.name}</span>
                        <button onClick={() => toggleStaffSelection(id)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Schedule View */}
        <div className="w-3/4 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            {viewMode === "day" ? "Daily Schedule" : "Weekly Schedule"} for {formatDate(selectedDate)}
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
                    <th className="w-40 p-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Staff</th>
                    {timeSlots.map((time, index) => (
                      <th 
                        key={index} 
                        className="p-2 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase"
                        style={{ minWidth: '80px' }} // Fixed width for each time column
                      >
                        {formatTime(time)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availableStaff.map(staff => {
                    const staffTasks = getFilteredTasks(selectedDate, staff.id);
                    
                    return (
                      <tr key={staff.id}>
                        <td className="p-3 border-b border-gray-200">
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-xs text-gray-500">{staff.department}</div>
                        </td>
                        
                        {timeSlots.map((timeSlot, index) => {
                          // Convert current time slot to decimal
                          const currentSlotTime = timeToDecimal(timeSlot);
                          
                          // Check for tasks that overlap with this time slot
                          const overlappingTask = staffTasks.find(task => {
                            const taskStart = timeToDecimal(task.startTime);
                            const taskEnd = timeToDecimal(task.endTime);
                            return currentSlotTime >= taskStart && currentSlotTime < taskEnd;
                          });
                          
                          // Determine if this is the starting slot for the task
                          const isTaskStart = overlappingTask && 
                            Math.abs(timeToDecimal(overlappingTask.startTime) - currentSlotTime) < 0.01;
                          
                          if (overlappingTask && isTaskStart) {
                            // Calculate how many slots this task spans
                            const taskStart = timeToDecimal(overlappingTask.startTime);
                            const taskEnd = timeToDecimal(overlappingTask.endTime);
                            const slotSize = 0.5; // Each slot is 30 minutes or 0.5 hours
                            const slotsSpanned = Math.ceil((taskEnd - taskStart) / slotSize);
                            
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
                                    {formatTime(overlappingTask.startTime)} - {formatTime(overlappingTask.endTime)}
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