import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

export default function Tiers() {
  const [tiers, setTiers] = useState([]);
  const [subStatus, setSubStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const [tierRes, statusRes] = await Promise.all([
          axiosClient.get('/api/tiers/'),
          axiosClient.get('/api/subscription-status/')
        ]);
        setTiers(tierRes.data);
        setSubStatus(statusRes.data);
      } catch (err) {
        console.error("Failed to fetch tiers data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiers();
  }, []);

  const handleSelectTier = (tierId) => {
    navigate(`/checkout/${tierId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative px-4 text-center">
        <button 
          onClick={() => navigate("/")} 
          className="absolute left-4 top-0 text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors"
        >
          &larr; Go Back
        </button>
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Pricing</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Choose Your Plan
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Flexible tiers designed for everyone to unlock the best educational resources.
        </p>
      </div>

      <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {tiers.map((tier) => {
          const isCurrentTier = (subStatus?.tier_id == tier.id) || (tier.is_default && !(subStatus?.is_subscribed));
          
          return (
            <div 
              key={tier.id} 
              className={`flex flex-col bg-white rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${isCurrentTier ? 'ring-4 ring-indigo-600 scale-105 relative z-10' : 'border border-gray-200'}`}
            >
              {isCurrentTier && (
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                  <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider shadow-md">
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 leading-6">{tier.name}</h3>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-gray-900">
                  ${tier.price}
                  <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                </div>
                <p className="mt-6 text-base text-gray-500 flex-grow min-h-[60px]">{tier.description}</p>
              </div>
              
              <div className="p-8 bg-gray-50 rounded-b-2xl flex-grow flex flex-col justify-end border-t border-gray-100 mt-auto">
                {!tier.is_default &&
                <button
                  onClick={() => handleSelectTier(tier.id)}
                  disabled={isCurrentTier}
                  className={`w-full py-3 px-4 border border-transparent rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
                    isCurrentTier
                      ? 'bg-indigo-100 text-indigo-700 cursor-default'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isCurrentTier ? "Active" : "Select Plan"}
                </button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
