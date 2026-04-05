"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div>
        <h1 
          className="text-4xl font-bold text-center mb-3" 
          style={{ color: "#16a085" }}
        >
          Admin Login
        </h1>
        <p className="text-center text-gray-500 mb-10 text-sm leading-relaxed">
          Access the dashboard to manage feedback
        </p>

        {error && (
          <div className="p-5 mb-8 rounded-lg message-error fade-in">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 w-full px-5 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
              placeholder=" admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-10 w-full px-5 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
              placeholder=" ••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 mt-10 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">●</span> Logging in...
              </span>
            ) : (
              <span>Login →</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-8 bg-gray-50 p-4 rounded-lg">
          <span className="font-medium text-gray-700">Demo Credentials:</span><br />
          admin@example.com / admin123
        </p>
      </div>
    </div>
  );
}