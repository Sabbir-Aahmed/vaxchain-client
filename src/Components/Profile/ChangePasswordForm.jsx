import { useState } from "react";
import { FaSpinner, FaLock, FaShieldAlt } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

export default function ChangePasswordForm() {
    const { changePassword, errorMsg } = useAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const showSuccessAlert = () => {
        Swal.fire({
            title: "Password Updated!",
            text: "Your password has been changed successfully.",
            icon: "success",
            confirmButtonColor: "#14b8a6",
            confirmButtonText: "Continue",
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-lg px-4 py-2'
            }
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            title: "Update Failed!",
            text: message,
            icon: "error",
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Try Again",
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-lg px-4 py-2'
            }
        });
    };

    const showValidationError = (message) => {
        Swal.fire({
            title: "Validation Error",
            text: message,
            icon: "warning",
            confirmButtonColor: "#f59e0b",
            confirmButtonText: "OK",
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-lg px-4 py-2'
            }
        });
    };

    const showPasswordMismatchAlert = () => {
        Swal.fire({
            title: "Passwords Don't Match!",
            text: "New password and confirmation password do not match. Please try again.",
            icon: "warning",
            confirmButtonColor: "#f59e0b",
            confirmButtonText: "OK",
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'rounded-lg px-4 py-2'
            }
        });
    };

    const validatePassword = () => {
        if (!oldPassword) {
            showValidationError("Please enter your current password");
            return false;
        }

        if (!newPassword) {
            showValidationError("Please enter a new password");
            return false;
        }

        if (newPassword.length < 8) {
            showValidationError("New password must be at least 8 characters long");
            return false;
        }

        if (!reNewPassword) {
            showValidationError("Please confirm your new password");
            return false;
        }

        if (newPassword !== reNewPassword) {
            showPasswordMismatchAlert();
            return false;
        }

        // Check if new password is different from old password
        if (oldPassword === newPassword) {
            showValidationError("New password must be different from current password");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setSuccessMsg("");

        if (!validatePassword()) {
            return;
        }

        setLoading(true);

        const res = await changePassword({
            current_password: oldPassword,
            new_password: newPassword,
        });

        setLoading(false);

        if (res && res.success === false) {

            const errorMessage = errorMsg || "Failed to change password. Please check your current password and try again.";
            showErrorAlert(errorMessage);
        } else {
            showSuccessAlert();
            setOldPassword("");
            setNewPassword("");
            setReNewPassword("");
            setSuccessMsg("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200/30 rounded-full blur-lg"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4">
                        <FaShieldAlt className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">VaxChain</h1>
                    <p className="text-slate-600">Secure Vaccination Management Platform</p>
                </div>

                <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg">
                    <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 my-8 px-4 sm:px-6">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                            <FaLock className="text-cyan-600" /> Change Password
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    disabled={loading}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                    placeholder="Enter your current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                    placeholder="Enter your new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={reNewPassword}
                                    onChange={(e) => setReNewPassword(e.target.value)}
                                    disabled={loading}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                    placeholder="Confirm your new password"
                                />
                            </div>

                            {/* Keep existing error/success messages as fallback */}
                            {errorMsg && (
                                <p className="text-red-600 text-sm bg-red-50 p-2 rounded-md">{errorMsg}</p>
                            )}
                            {successMsg && (
                                <p className="text-green-600 text-sm bg-green-50 p-2 rounded-md">{successMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin h-4 w-4" />
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="h-4 w-4" />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                For security reasons, please ensure your new password is strong and unique.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}