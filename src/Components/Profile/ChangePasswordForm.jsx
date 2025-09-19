import { useState } from "react";
import { FaSpinner, FaLock,FaShieldAlt } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";


export default function ChangePasswordForm() {
    const { changePassword, errorMsg } = useAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== reNewPassword) {
            setSuccessMsg("");
            alert("New passwords do not match!");
            return;
        }

        setLoading(true);
        setSuccessMsg("");

        const res = await changePassword({
            current_password: oldPassword,
            new_password: newPassword,
        });

        setLoading(false);

        if (res && res.success === false) {
            setSuccessMsg("");
        } else {
            setSuccessMsg("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setReNewPassword("");
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
                                <label className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={reNewPassword}
                                    onChange={(e) => setReNewPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            {errorMsg && (
                                <p className="text-red-600 text-sm">{errorMsg}</p>
                            )}
                            {successMsg && (
                                <p className="text-green-600 text-sm">{successMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:bg-gradient-to-l from-teal-600 to-cyan-700 text-white rounded-lg font-medium transition-colors"
                            >
                                {loading && (
                                    <FaSpinner className="animate-spin h-4 w-4" />
                                )}
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
