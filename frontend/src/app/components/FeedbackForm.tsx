"use client";

import { useState, FormEvent } from "react";

interface FormData {
    title: string;
    description: string;
    category: "Bug" | "Feature Request" | "Improvement";
    submitterName?: string;
    submitterEmail?: string;
}

export default function FeedbackForm() {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        category: "Bug",
        submitterName: "",
        submitterEmail: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "✓ Feedback submitted successfully!" });
                setFormData({ title: "", description: "", category: "Bug", submitterName: "", submitterEmail: "" });
                setTimeout(() => setMessage(null), 4000);
            } else {
                setMessage({ type: "error", text: "Failed to submit feedback. Please try again." });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please check your connection." });
        } finally {
            setLoading(false);
        }
    };

    const descriptionLength = formData.description.length;
    const progressPercent = (descriptionLength / 2000) * 100;

    return (
        <div className="min-h-screen py-16 px-2 flex items-center justify-center">
            <div className="w-full max-w-4xl fade-in">
                {/* Card with Enhanced Border Radius - Expanded */}
                <div>
                    {/* Title */}
                    <h1 className="text-5xl font-bold text-center mb-4" style={{ color: "#16a085" }}>
                        Feedback Form
                    </h1>
                    <p className="text-center text-gray-500 mb-12 text-base leading-relaxed">
                        Help us improve by sharing your feedback
                    </p>

                    {/* Alert Messages */}
                    {message && (
                        <div className={`p-5 mb-10 fade-in ${
                            message.type === "success" ? "message-success" : "message-error"
                        }`}>
                            <p className="font-medium">{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Title Field */}
                        <div>
                            <label className="block text-base font-semibold text-gray-800 mb-5">
                                Title
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={120}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-10 w-full px-8 py-6 text-base focus:outline-none"
                                placeholder=" Enter feedback title"
                            />
                        </div>
                        {/* Name Field */}
                        <div>
                            <label className="block text-base font-semibold text-gray-800 pb-20 ">
                                Name <span className="font-normal text-gray-500">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.submitterName}
                                onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                                maxLength={50}
                                className="h-10 w-full px-8 py-6 text-base focus:outline-none"
                                placeholder=" Your name"
                            />
                        </div>


                        {/* Email Field */}
                        <div>
                            <label className="block text-base font-semibold text-gray-800 mb-5">
                                Email <span className="font-normal text-gray-500">(optional)</span>
                            </label>
                            <input
                                type="email"
                                value={formData.submitterEmail}
                                onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                                className="h-10 w-full px-8 py-6 text-base focus:outline-none"
                                placeholder=" your.email@example.com"
                            />
                        </div>

                        {/* Subject (Category) */}
                        <div>
                            <label className="block text-base font-semibold text-gray-800 mb-5">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="h-10 w-full px-8 py-6 text-base focus:outline-none"
                            >
                                <option value="Bug">Bug</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Improvement">Improvement</option>
                            </select>
                        </div>

                        {/* Message (Description) */}
                        <div>
                            <label className="block text-base font-semibold text-gray-800 mb-5">
                                Message
                            </label>
                            <textarea
                                required
                                minLength={20}
                                maxLength={2000}
                                rows={9}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-8 py-6 text-base focus:outline-none resize-none"
                                placeholder=" Enter your detailed feedback..."
                            />
                            <div className="mt-5">
                                <div className="progress-bar mb-4">
                                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{descriptionLength < 20 ? `${20 - descriptionLength} more characters needed` : "✓ Ready to submit"}</span>
                                    <span>{descriptionLength}/2000</span>
                                </div>
                            </div>
                        </div>

                        {/* Name Field */}

                        <button
                            type="submit"
                            disabled={loading || formData.description.length < 20}
                            className="h-10 w-full px-6 py-6 mt-12 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center text-lg"
                            style={{ borderRadius: "14px" }}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <span className="animate-spin mr-3">●</span> Submitting...
                                </span>
                            ) : (
                                <span>Submit →</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}