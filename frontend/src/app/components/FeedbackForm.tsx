"use client";

import { useState } from "react";

interface FormData {
    title:string,
    description:string,
    category: "Bug" | "Feature Request" | "Improvement",
    submitterName?: string,
    submitterEmail?: string,
}

export default function FeedbackForm(){
    const [formData, setFormData] = useState<FormData>({
        title:"",
        description:"",
        category:"Bug",
        submitterName:"",
        submitterEmail:"",
    })

    const [loading , setLoading] = useState(false)
    const [message , setMessage] = useState<{type : "success" | "error" ; text: string} | null>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): string | null => {
        if (!formData.title.trim()) return "Title is required";
        if (formData.title.length > 120) return "Title must be under 120 characters";
        if (!formData.description.trim()) return "Description is required";
        if (formData.description.length < 20) return "Description must be at least 20 characters";
        if (formData.description.length > 2000) return "Description must be under 2000 characters";
        if (formData.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
            return "Invalid email format";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        const validationError = validateForm();
        if (validationError) {
            setMessage({ type: "error", text: validationError });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("http://localhost:5000/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Thank you! Your feedback has been submitted." });
                setFormData({
                    title: "",
                    description: "",
                    category: "Bug",
                    submitterName: "",
                    submitterEmail: "",
                });
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.error || "Failed to submit feedback" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const descriptionLength = formData.description.length;
    const descriptionLimit = 2000;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Submit Your Feedback</h1>

            {message && (
                <div
                    className={`mb-4 p-4 rounded-lg ${
                        message.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-400"
                            : "bg-red-100 text-red-800 border border-red-400"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Brief title of your feedback"
                        maxLength={120}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.title.length}/120</p>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description (at least 20 characters)"
                        rows={5}
                        maxLength={2000}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Minimum 20 characters</span>
                        <span>
                            {descriptionLength}/{descriptionLimit}
                        </span>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="Bug">Bug Report</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Improvement">Improvement Suggestion</option>
                    </select>
                </div>

                {/* Submitter Name */}
                <div>
                    <label htmlFor="submitterName" className="block text-sm font-medium text-gray-700">
                        Your Name (Optional)
                    </label>
                    <input
                        type="text"
                        id="submitterName"
                        name="submitterName"
                        value={formData.submitterName}
                        onChange={handleChange}
                        placeholder="Your name"
                        maxLength={50}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Submitter Email */}
                <div>
                    <label htmlFor="submitterEmail" className="block text-sm font-medium text-gray-700">
                        Your Email (Optional)
                    </label>
                    <input
                        type="email"
                        id="submitterEmail"
                        name="submitterEmail"
                        value={formData.submitterEmail}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
}
