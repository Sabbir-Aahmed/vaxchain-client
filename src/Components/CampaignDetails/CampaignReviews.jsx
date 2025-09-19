import { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash, FaSpinner, FaUser } from "react-icons/fa";
import apiClient from "../../Services/apiClient";

const CampaignReview = ({ campaignId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [editingReview, setEditingReview] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Fetch campaign reviews
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/campaigns/${campaignId}/reviews/`);
            setReviews(res.data.results || []);
        } catch (err) {
            console.error("Fetch Reviews Error:", err.response || err);
            setErrorMsg("Failed to fetch reviews. Login might be required.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (campaignId) fetchReviews();
    }, [campaignId]);

    // Submit new review or update existing
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment || !newRating) {
            setErrorMsg("Please enter rating and comment");
            return;
        }

        try {
            setLoadingAction(true);
            if (editingReview) {
                await apiClient.patch(
                    `/campaigns/${campaignId}/reviews/${editingReview.id}/`,
                    {
                        campaign: campaignId,
                        rating: newRating,
                        comment: newComment,
                    }
                );
                setEditingReview(null);
            } else {
                await apiClient.post(`/campaigns/${campaignId}/reviews/`, {
                    campaign: campaignId,
                    rating: newRating,
                    comment: newComment,
                });
            }
            setNewComment("");
            setNewRating(5);
            fetchReviews();
            setErrorMsg("");
        } catch (err) {
            console.error("Submit Review Error:", err.response || err);
            setErrorMsg("Failed to save review. Check login and data.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleEdit = (rev) => {
        setEditingReview(rev);
        setNewComment(rev.comment);
        setNewRating(rev.rating);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            setLoadingAction(true);
            await apiClient.delete(`/campaigns/${campaignId}/reviews/${id}/`);
            fetchReviews();
        } catch (err) {
            console.error("Delete Review Error:", err.response || err);
            setErrorMsg("Failed to delete review.");
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="bg-white w-full rounded-2xl shadow-lg border border-gray-200 shadow-inner p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <span className="text-gray-500">
                    {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                </span>
            </div>

            {/* Add / Edit Review Form */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                <div className="flex gap-2 items-center">
                    <label className="font-medium">Rating:</label>
                    <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-2 py-1"
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num} Star{num > 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
                    rows={3}
                />

                {errorMsg && <p className="text-red-600">{errorMsg}</p>}

                <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:bg-gradient-to-l from-teal-500 to-cyan-600 text-white rounded-md font-medium flex items-center gap-2"
                >
                    {loadingAction && <FaSpinner className="animate-spin" />}
                    {editingReview ? "Update Review" : "Post Review"}
                </button>
            </form>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center">
                    <FaSpinner className="animate-spin text-cyan-600 w-6 h-6" />
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((rev) => (
                        <div
                            key={rev.id}
                            className="border border-gray-200 rounded-md p-4 flex justify-between items-start"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                                        <FaUser className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text">{rev.patient_name}</span>
                                    <span className="text-yellow-400 flex items-center gap-1">
                                        {Array.from({ length: rev.rating }).map((_, idx) => (
                                            <FaStar key={idx} />
                                        ))}
                                    </span>
                                </div>
                                <p>{rev.comment}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Created: {new Date(rev.created_at).toLocaleDateString()}
                                    {rev.updated_at !== rev.created_at && (
                                        <span>
                                            {" "}
                                            | Updated: {new Date(rev.updated_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(rev)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(rev.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignReview;
