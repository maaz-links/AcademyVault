import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function Checkout() {
  const { tierId } = useParams();
  const navigate = useNavigate();
  const [tier, setTier] = useState(null);
  const [subStatus, setSubStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const [tierRes, statusRes] = await Promise.all([
          axiosClient.get(`/api/tiers/${tierId}/`),
          axiosClient.get('/api/subscription-status/')
        ]);
        setTier(tierRes.data);
        setSubStatus(statusRes.data);
      } catch (err) {
        console.error("Failed to fetch checkout data", err);
        setError("Unable to load tier details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (tierId) {
      fetchCheckoutData();
    }
  }, [tierId]);

  const handleAction = async () => {
    setProcessing(true);
    setError(null);
    try {
      if (subStatus?.is_subscribed) {
        // Go to billing portal
        const { data } = await axiosClient.post('/api/billing-portal/');
        if (data.url) window.location.href = data.url;
      } else {
        // Go to checkout
        const { data } = await axiosClient.post(`/api/create-checkout-session/${tierId}/`, {});
        if (data.url) window.location.href = data.url;
      }
    } catch (err) {
      console.error("Action error:", err);
      setError("An error occurred while connecting to the payment gateway.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !tier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/tiers')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Return to Tiers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-10">
        <div className="bg-indigo-600 px-6 py-8 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Checkout</h2>
          <p className="text-indigo-100 text-lg">{tier?.name}</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          {subStatus?.is_subscribed ? (
            <div className="text-center">
               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">You already have an active subscription</h3>
              <p className="text-gray-500 mb-8">
                To upgrade, downgrade, or modify your current plan (${subStatus.tier_name}), please continue to the billing portal.
              </p>
              <button
                onClick={handleAction}
                disabled={processing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {processing ? "Redirecting..." : "Go to Billing Portal"}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6">
                <span className="text-gray-600 font-medium">Total due today</span>
                <span className="text-3xl font-bold text-gray-900">${tier?.price}</span>
              </div>
              
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">What's included</h4>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{tier?.description}</p>
              </div>

              <button
                onClick={handleAction}
                disabled={processing}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-transform active:scale-95"
              >
                {processing ? "Starting Checkout..." : "Proceed to Payment"}
              </button>
              <p className="mt-4 text-xs text-center text-gray-500">
                You will be redirected securely to Stripe to complete your payment.
              </p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/tiers')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              &larr; Back to Tiers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}