
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaCreditCard, FaSpinner } from "react-icons/fa";
import apiClient from "../../Services/apiClient";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("paymentData");
    if (stored) {
      setPaymentData(JSON.parse(stored));
    } else {
      navigate("/campaigns");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await apiClient.post(`/payment/initiate/`, {
        payment_id: paymentData.payment_id,
        cus_name: customer.name,
        cus_address: customer.address,
        cus_phone: customer.phone,
        amount: paymentData.amount,
      });

      // Redirect to SSLCommerz payment page
      window.location.href = res.data.payment_url;
    } catch (err) {
      alert(err.response?.data?.error || "Could not initiate payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin w-6 h-6 text-teal-500" />
        <span className="ml-2 text-slate-600">Loading payment details…</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-100 hover:text-white mb-3"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Premium Payment</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
          <p className="mb-2">
            <strong>Campaign:</strong> {paymentData.campaignName}
          </p>
          <p className="mb-2">
            <strong>Schedule:</strong> {paymentData.scheduleName}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-amber-800">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-amber-800">
                ${paymentData.amount}
              </span>
            </div>
          </div>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-yellow-700"
            >
              Pay ${paymentData.amount}
            </button>
          ) : (
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <input
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border rounded-lg p-3"
                required
              />
              <input
                name="address"
                value={customer.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border rounded-lg p-3"
                required
              />
              <input
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border rounded-lg p-3"
                required
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin w-5 h-5" /> Processing…
                  </>
                ) : (
                  <>
                    <FaCreditCard className="w-5 h-5" /> Confirm & Pay
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
