import profilePlaceholder from "../../assets/profile.webp";

import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaSpinner,
  FaCog,
} from "react-icons/fa";
import useAuthContext from "../../Hooks/useAuthContext";
import apiClient from "../../Services/apiClient";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user, authLoading } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(null);
  const [medicalData, setMedicalData] = useState(null);
  const [loadingMedical, setLoadingMedical] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
  
      try {
        const userRes = await apiClient.get("/auth/users/me/");
        const currentUser = userRes.data;
        setProfileData(currentUser);
  
        let profileRes;
        if (currentUser.role === "PATIENT") {
          profileRes = await apiClient.get("/patient/profile/");
        } else {
          profileRes = await apiClient.get("/doctor/profile/");
        }
  
        const profile = Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data;
        setMedicalData(profile);
      } catch (err) {
        console.log("Profile fetch error:", err);
      } finally {
        setLoadingMedical(false);
      }
    };
  
    fetchUserProfile();
  }, [user]);

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonColor: "#14b8a6",
      confirmButtonText: "OK",
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Try Again",
    });
  };

  const showImageUploadSuccess = () => {
    Swal.fire({
      title: "Image Updated!",
      text: "Your profile picture has been updated successfully.",
      icon: "success",
      confirmButtonColor: "#14b8a6",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const showImageUploadError = () => {
    Swal.fire({
      title: "Upload Failed!",
      text: "Failed to upload profile picture. Please try again.",
      icon: "error",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "OK",
    });
  };

  const handlePersonalChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMedicalChange = (field, value) => {
    setMedicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileImageChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadProfileImage = async () => {
    if (!selectedFile || !profileData?.id) return;
    
    try {
      const formData = new FormData();
      formData.append("profile_image", selectedFile);
      await apiClient.patch(`/auth/users/me/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
     
      const res =
        user.role === "PATIENT"
          ? await apiClient.get("/patient/profile/")
          : await apiClient.get("/doctor/profile/");
      const profile = Array.isArray(res.data) ? res.data[0] : res.data;
      setProfileData(profile.user);
      setMedicalData(profile);
      setSelectedFile(null);
      
      showImageUploadSuccess();
    } catch (err) {
      console.error("Error uploading profile image:", err);
      showImageUploadError();
    }
  };

  const handleSave = async () => {
    try {
      // Save personal info
      if (activeTab === "personal") {
        await apiClient.patch(`/auth/users/me/`, {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          contact_number: profileData.contact_number,
          address: profileData.address,
          nid: profileData.nid,
        });
        showSuccessAlert("Personal information updated successfully!");
      }
  
      // Save or create medical info
      else if (activeTab === "medical") {
        if (user.role === "PATIENT") {
          if (medicalData?.id) {
            // Update existing patient profile
            await apiClient.patch(`/patient/profile/${medicalData.id}/`, {
              blood_type: medicalData.blood_type,
              allergies: medicalData.allergies,
              medical_conditions: medicalData.medical_conditions,
            });
          } else {
            // Create new patient profile
            const res = await apiClient.post(`/patient/profile/`, {
              blood_type: medicalData.blood_type,
              allergies: medicalData.allergies,
              medical_conditions: medicalData.medical_conditions,
            });
            setMedicalData(res.data);
          }
          showSuccessAlert("Medical information updated successfully!");
        } else if (user.role === "DOCTOR") {
          if (medicalData?.id) {
            // Update existing doctor profile
            await apiClient.patch(`/doctor/profile/${medicalData.id}/`, {
              specialization: medicalData.specialization,
              license_number: medicalData.license_number,
              hospital: medicalData.hospital,
              bio: medicalData.bio,
            });
          } else {
            // Create new doctor profile
            const res = await apiClient.post(`/doctor/profile/`, {
              specialization: medicalData.specialization,
              license_number: medicalData.license_number,
              hospital: medicalData.hospital,
              bio: medicalData.bio,
            });
            setMedicalData(res.data);
          }
          showSuccessAlert("Professional information updated successfully!");
        }
      }
  
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      
      let errorMessage = "Failed to save profile. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (typeof err.response.data === 'object') {
          errorMessage = Object.values(err.response.data).flat().join(', ');
        }
      }
      
      showErrorAlert(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    Swal.fire({
      title: "Discard Changes?",
      text: "Are you sure you want to cancel? All unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Discard",
      cancelButtonText: "Continue Editing",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false);
        // Reload the data to reset any changes
        window.location.reload();
      }
    });
  };

  if (authLoading || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative h-24 w-24 border-4 border-cyan-100 rounded-full overflow-hidden">
            <img
              src={
                profileData?.profile_image
                  ? `https://res.cloudinary.com/dg9kylqph/${profileData.profile_image}`
                  : profilePlaceholder
              }
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {profileData.first_name} {profileData.last_name}
                </h1>
                <p className="text-gray-100 mt-1">
                  {user.role === "PATIENT" ? "Patient" : "Healthcare Provider"}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-100">
                  <div className="flex items-center gap-1">
                    <FaEnvelope className="h-4 w-4" /> {profileData.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPhone className="h-4 w-4" /> {profileData.contact_number}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:bg-gradient-to-l from-teal-500 to-cyan-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <FaUser className="h-4 w-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="mt-2">
                <input 
                  type="file" 
                  onChange={handleProfileImageChange} 
                  className="text-white"
                  accept="image/*"
                />
                {selectedFile && (
                  <button
                    onClick={uploadProfileImage}
                    className="px-3 py-1 bg-teal-500 text-white rounded-md mt-1 hover:bg-teal-600 transition-colors"
                  >
                    Upload New Picture
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-3 bg-gray-100 rounded-lg p-1">
            {["personal", "medical", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "personal"
                  ? "Personal Info"
                  : tab === "medical"
                  ? user.role === "PATIENT" ? "Medical Info" : "Professional Info"
                  : "Settings"}
              </button>
            ))}
          </div>

          {/* Personal Info */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FaUser className="h-5 w-5 text-teal-600" /> Personal
                Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["First Name", "first_name"],
                  ["Last Name", "last_name"],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profileData?.[field] ?? ""}
                      onChange={(e) =>
                        handlePersonalChange(field, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileData?.email ?? ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData?.contact_number ?? ""}
                    onChange={(e) =>
                      handlePersonalChange("contact_number", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    NID
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData?.nid ?? ""}
                    onChange={(e) => handlePersonalChange("nid", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    disabled={!isEditing}
                    value={profileData?.address ?? ""}
                    onChange={(e) =>
                      handlePersonalChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Medical/Professional Info */}
          {activeTab === "medical" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {loadingMedical ? (
                <div className="flex justify-center items-center h-40">
                  <FaSpinner className="animate-spin text-4xl text-cyan-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <FaUser className="h-5 w-5 text-teal-600" />
                    {user.role === "PATIENT" ? "Medical Information" : "Professional Information"}
                  </h3>
                  {user.role === "PATIENT"
                    ? ["blood_type", "allergies", "medical_conditions"].map(
                        (field) => (
                          <div key={field} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                              {field.replace("_", " ")}
                            </label>
                            {field === "blood_type" ? (
                              <input
                                type="text"
                                value={medicalData?.[field] ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleMedicalChange(field, e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500"
                              />
                            ) : (
                              <textarea
                                value={medicalData?.[field] ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleMedicalChange(field, e.target.value)
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                              />
                            )}
                          </div>
                        )
                      )
                    : ["specialization", "license_number", "hospital", "bio"].map(
                        (field) => (
                          <div key={field} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                              {field.replace("_", " ")}
                            </label>
                            {field === "bio" ? (
                              <textarea
                                value={medicalData?.[field] ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleMedicalChange(field, e.target.value)
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={medicalData?.[field] ?? ""}
                                disabled={!isEditing}
                                onChange={(e) =>
                                  handleMedicalChange(field, e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500"
                              />
                            )}
                          </div>
                        )
                      )}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <FaCog className="text-teal-600"/> Settings
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Manage your account and privacy settings.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Change Password</span>
                  <Link to={'/profile/update-password'}>
                    <button className="px-3 py-1 border bg-gradient-to-r from-teal-500 to-cyan-600 hover:bg-gradient-to-l from-teal-600 to-cyan-700 rounded-md text-white text-md">
                      Update
                    </button>
                  </Link>
                </div>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}