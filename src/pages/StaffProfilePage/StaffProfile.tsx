import axios from "axios";
import {
  Award,
  Briefcase,
  Building,
  Calendar,
  ChevronDown,
  Clipboard,
  Clock,
  Edit,
  Mail,
  Phone,
  Save,
  Search,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HospitalStaffManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [staffRoles, setStaffRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function getStaff() {
      const staff = await axios.get("http://localhost:3000/api/staff");
      console.log(staff.data);
      setStaffList(staff.data);
    }

    getStaff();
  }, []);

  useEffect(() => {
    async function getDepartments() {
      const department = await axios.get(
        "http://localhost:3000/api/staff/departments"
      );
      console.log("Departments:");
      console.log(department.data.department);
      setDepartments(department.data.department);
    }

    getDepartments();
  }, []);

  // Filter staff based on search term and filters
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.specialty &&
        staff.specialty.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "" || staff.role === roleFilter;
    const matchesStatus = statusFilter === "" || staff.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle staff selection
  const handleSelectStaff = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(false);
  };

  // Start editing staff profile
  const handleEdit = () => {
    setEditedStaff({ ...selectedStaff });
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStaff(null);
  };

  // Save edited staff profile
  const handleSave = async () => {
    // In a real application, this would call an API to update the staff's information
    setSelectedStaff({ ...editedStaff });
    const updateStaff = await axios.post(
      "http://localhost:3000/api/staff/" + editedStaff.id,
      {
        ...editedStaff,
      }
    );
    setIsEditing(false);
    setEditedStaff(null);
    alert("Staff profile updated successfully!");
    window.location.reload();
  };

  // Handle field changes during edit
  const handleChange = (field, value) => {
    setEditedStaff({ ...editedStaff, [field]: value });
  };

  // Get all unique roles from staff data
  // const staffRoles = ["", ...new Set(mockStaff.map((staff) => staff.role))];

  // An api call to get staff roles
  useEffect(() => {
    async function getStaffRoles() {
      const staffRole = await axios.get(
        "http://localhost:3000/api/staff/roles"
      );
      console.log(staffRole);
      setStaffRoles(staffRole.data.roles);
    }

    getStaffRoles();
  }, []);

  // Get icon based on staff role
  const getRoleIcon = (role) => {
    switch (role) {
      case "Doctor":
        return <User className="h-4 w-4 text-blue-600" />;
      case "Nurse":
        return <User className="h-4 w-4 text-green-600" />;
      case "Technician":
        return <Briefcase className="h-4 w-4 text-purple-600" />;
      case "Janitor":
        return <Briefcase className="h-4 w-4 text-gray-600" />;
      case "Administrator":
        return <Clipboard className="h-4 w-4 text-red-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get color based on staff role for badge
  const getRoleColor = (role) => {
    switch (role) {
      case "Doctor":
        return "bg-blue-100 text-blue-800";
      case "Nurse":
        return "bg-green-100 text-green-800";
      case "Technician":
        return "bg-purple-100 text-purple-800";
      case "Janitor":
        return "bg-gray-100 text-gray-800";
      case "Administrator":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render specific fields based on staff role
  const renderRoleSpecificFields = (staff, isEditing = false) => {
    if (!staff) return null;

    switch (staff.role) {
      case "Doctor":
      case "Nurse":
        return (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Clinical Information</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Clipboard className="h-4 w-4 mr-2" />
                  <span className="text-sm">Current Patient Load</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedStaff.patientLoad}
                    onChange={(e) =>
                      handleChange("patientLoad", parseInt(e.target.value))
                    }
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p>{staff.patientLoad} patients</p>
                )}
              </div>
            </div>
          </div>
        );
      case "Technician":
        return (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">
              Technical Information
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="text-sm">Equipment Expertise</span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedStaff.equipmentExpertise?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newExpertise = [
                              ...editedStaff.equipmentExpertise,
                            ];
                            newExpertise[index] = e.target.value;
                            handleChange("equipmentExpertise", newExpertise);
                          }}
                          className="flex-1 p-2 border rounded-md"
                        />
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          onClick={() => {
                            const newExpertise =
                              editedStaff.equipmentExpertise.filter(
                                (_, i) => i !== index
                              );
                            handleChange("equipmentExpertise", newExpertise);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      className="mt-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
                      onClick={() => {
                        handleChange("equipmentExpertise", [
                          ...(editedStaff.equipmentExpertise || []),
                          "",
                        ]);
                      }}
                    >
                      + Add Equipment
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {staff.equipmentExpertise?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      case "Janitor":
        return (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">
              Facilities Information
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="text-sm">Assigned Areas</span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedStaff.areas?.map((area, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => {
                            const newAreas = [...editedStaff.areas];
                            newAreas[index] = e.target.value;
                            handleChange("areas", newAreas);
                          }}
                          className="flex-1 p-2 border rounded-md"
                        />
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          onClick={() => {
                            const newAreas = editedStaff.areas.filter(
                              (_, i) => i !== index
                            );
                            handleChange("areas", newAreas);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      className="mt-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
                      onClick={() => {
                        handleChange("areas", [
                          ...(editedStaff.areas || []),
                          "",
                        ]);
                      }}
                    >
                      + Add Area
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {staff.areas?.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      case "Administrator":
        return (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">
              Administrative Information
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Clipboard className="h-4 w-4 mr-2" />
                  <span className="text-sm">Responsibilities</span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedStaff.responsibilities?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newResponsibilities = [
                              ...editedStaff.responsibilities,
                            ];
                            newResponsibilities[index] = e.target.value;
                            handleChange(
                              "responsibilities",
                              newResponsibilities
                            );
                          }}
                          className="flex-1 p-2 border rounded-md"
                        />
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          onClick={() => {
                            const newResponsibilities =
                              editedStaff.responsibilities.filter(
                                (_, i) => i !== index
                              );
                            handleChange(
                              "responsibilities",
                              newResponsibilities
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      className="mt-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
                      onClick={() => {
                        handleChange("responsibilities", [
                          ...(editedStaff.responsibilities || []),
                          "",
                        ]);
                      }}
                    >
                      + Add Responsibility
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {staff.responsibilities?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-1 container mx-auto p-4 gap-4 overflow-hidden">
        {/* Sidebar - Staff Search and List */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Staff Directory</h2>

          {/* Search Box */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex mb-4 gap-2">
            <div className="relative w-1/2">
              <select
                className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                {staffRoles
                  .filter((role) => role !== "")
                  .map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <div className="relative w-1/2">
              <select
                className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Remote">Remote</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Staff List */}
          <div className="flex-1 overflow-y-auto">
            {filteredStaff.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No staff found matching your search.
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredStaff.map((staff) => (
                  <li
                    key={staff.id}
                    className={`p-3 rounded-md cursor-pointer flex items-center hover:bg-gray-50 ${
                      selectedStaff?.id === staff.id
                        ? "bg-blue-50 border border-blue-200"
                        : ""
                    }`}
                    onClick={() => handleSelectStaff(staff)}
                  >
                    {/* <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={staff.imageUrl}
                        alt={staff.name}
                        className="h-full w-full object-cover"
                      />
                    </div> */}
                    <div className="flex-1">
                      <h3 className="font-medium">{staff.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        {getRoleIcon(staff.role)}
                        <span className="ml-1">{staff.role}</span>
                        {staff.specialty && (
                          <span className="ml-1">• {staff.specialty}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        staff.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {staff.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main Content - Staff Details */}
        <div className="w-2/3 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          {selectedStaff ? (
            <>
              {/* Action Buttons */}
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Staff Profile</h2>
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-50"
                        onClick={handleCancelEdit}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                        onClick={handleSave}
                      >
                        <Save className="mr-1 h-4 w-4" />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md flex items-center hover:bg-red-100">
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                        onClick={handleEdit}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Staff Basic Info */}
              <div className="flex items-start mb-6">
                {/* <div className="h-32 w-32 rounded-lg overflow-hidden mr-6">
                  <img
                    src={
                      isEditing ? editedStaff.imageUrl : selectedStaff.imageUrl
                    }
                    alt={isEditing ? editedStaff.name : selectedStaff.name}
                    className="h-full w-full object-cover"
                  />
                </div> */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editedStaff.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            value={editedStaff.role}
                            onChange={(e) =>
                              handleChange("role", e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          >
                            {staffRoles
                              .filter((role) => role !== "")
                              .map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                          </label>
                          {/* <input
                            type="text"
                            value={editedStaff.department}
                            onChange={(e) =>
                              handleChange("department", e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          /> */}
                          <select
                            value={editedStaff.department}
                            onChange={(e) =>
                              handleChange("department", e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          >
                            {departments && departments.map((department) => (
                              <option key={department} value={department}>
                                {department}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {(editedStaff.role === "Doctor" ||
                        editedStaff.role === "Nurse" ||
                        editedStaff.role === "Technician" ||
                        editedStaff.role === "Administrator") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Specialty
                          </label>
                          <input
                            type="text"
                            value={editedStaff.specialty || ""}
                            onChange={(e) =>
                              handleChange("specialty", e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editedStaff.status}
                          onChange={(e) =>
                            handleChange("status", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Remote">Remote</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-2">
                        {selectedStaff.name}
                      </h2>
                      <div className="flex items-center mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mr-2 ${getRoleColor(
                            selectedStaff.role
                          )}`}
                        >
                          {selectedStaff.role}
                        </span>
                        {selectedStaff.specialty && (
                          <span className="font-medium mr-2">
                            {selectedStaff.specialty}
                          </span>
                        )}
                        <span className="text-gray-600">
                          • {selectedStaff.department}
                        </span>
                      </div>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedStaff.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedStaff.status}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Staff Detailed Information */}
              <div className="grid grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">Email Address</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedStaff.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      ) : (
                        <p>{selectedStaff.email}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">Phone Number</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedStaff.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      ) : (
                        <p>{selectedStaff.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">
                    Employment Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Join Date</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedStaff.joinDate}
                          onChange={(e) =>
                            handleChange("joinDate", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      ) : (
                        <p>
                          {new Date(
                            selectedStaff.joinDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Schedule Hours</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedStaff.scheduleHours}
                          onChange={(e) =>
                            handleChange("scheduleHours", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      ) : (
                        <p>{selectedStaff.scheduleHours}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">
                    Education & Certifications
                  </h3>

                  <div className="space-y-4">
                    {selectedStaff.education && (
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Award className="h-4 w-4 mr-2" />
                          <span className="text-sm">Education</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedStaff.education || ""}
                            onChange={(e) =>
                              handleChange("education", e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        ) : (
                          <p>{selectedStaff.education}</p>
                        )}
                      </div>
                    )}

                    {selectedStaff.certifications && (
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Tag className="h-4 w-4 mr-2" />
                          <span className="text-sm">Certifications</span>
                        </div>
                        {isEditing ? (
                          <div className="space-y-2">
                            {editedStaff.certifications?.map((cert, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={cert}
                                  onChange={(e) => {
                                    const newCerts = [
                                      ...editedStaff.certifications,
                                    ];
                                    newCerts[index] = e.target.value;
                                    handleChange("certifications", newCerts);
                                  }}
                                  className="flex-1 p-2 border rounded-md"
                                />
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                  onClick={() => {
                                    const newCerts =
                                      editedStaff.certifications.filter(
                                        (_, i) => i !== index
                                      );
                                    handleChange("certifications", newCerts);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              className="mt-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
                              onClick={() => {
                                handleChange("certifications", [
                                  ...(editedStaff.certifications || []),
                                  "",
                                ]);
                              }}
                            >
                              + Add Certification
                            </button>
                          </div>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedStaff.certifications?.map(
                              (cert, index) => (
                                <li key={index}>{cert}</li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Role-specific information */}
                {renderRoleSpecificFields(
                  isEditing ? editedStaff : selectedStaff,
                  isEditing
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <User className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Staff Selected</h3>
              <p>Select a staff member from the list to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
