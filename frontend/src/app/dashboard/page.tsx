"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Feedback {
  _id: string;
  title: string;
  category: string;
  status: string;
  ai_sentiment: string;
  ai_priority: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", sentiment: "" });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/dashboard/login");
      return;
    }
    fetchFeedback(token);
  }, [filter]);

  const fetchFeedback = async (token: string) => {
    try {
      let url = "http://localhost:5000/api/feedback";
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.sentiment) params.append("sentiment", filter.sentiment);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.data || []);
      } else if (response.status === 401) {
        localStorage.removeItem("authToken");
        router.push("/dashboard/login");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setFeedback((prev) => prev.map((f) => (f._id === id ? { ...f, status } : f)));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">Manage feedback submissions</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              router.push("/dashboard/login");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex gap-3">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filter.sentiment}
            onChange={(e) => setFilter({ ...filter, sentiment: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">All Sentiment</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="border rounded overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Sentiment</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.ai_sentiment === "Positive" ? "bg-green-100 text-green-700" :
                        item.ai_sentiment === "Negative" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {item.ai_sentiment}
                      </span>
                    </td>
                    <td className="p-3">{item.ai_priority}/10</td>
                    <td className="p-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}