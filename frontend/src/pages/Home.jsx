import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";

export default function Home() {
  const [content, setContent] = useState([]);
  const [subStatus, setSubStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, contentRes] = await Promise.all([
          axiosClient.get('/api/subscription-status/'),
          axiosClient.get('/api/content/')
        ]);
        setSubStatus(statusRes.data);
        setContent(contentRes.data);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-indigo-700 text-white py-12 px-4 shadow-md sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome to AcademyVault
            </h1>
            <p className="mt-2 text-lg text-indigo-100">
              Current Plan: <span className="font-semibold text-white bg-indigo-500 px-2 py-1 rounded">
                {subStatus?.is_subscribed ? subStatus.tier_name : "Free / No active plan"}
              </span>
            </p>
          </div>
          <Link 
            to="/tiers"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-sm transition-colors duration-150"
          >
            {subStatus?.is_subscribed ? "Manage Plan" : "View All Tiers"}
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Latest Educational Content</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                  {!item.is_accessible && (
                    <span className="inline-flex items-center text-gray-400" title="Locked">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </span>
                  )}
                  {item.is_accessible && (
                    <span className="inline-flex items-center text-green-500" title="Accessible">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{item.description}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                
                {/* LEFT SIDE: access / download */}
                {item.is_accessible && item.download_url ? (
                  <a 
                    href={item.download_url} target="_blank"
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Download Resource
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ) : (
                  <span className="inline-flex items-center text-sm font-medium text-gray-400 cursor-not-allowed">
                    Upgrade to access
                  </span>
                )}

                {/* RIGHT SIDE: tier badge */}
                {!item.tier?.is_default && <span className="ml-4 inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-black-400">
                  {item.tier?.name}
                </span>}

              </div>
            </div>
          ))}
        </div>
        {content.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No content available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
