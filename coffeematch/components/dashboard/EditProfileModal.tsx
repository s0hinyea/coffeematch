"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
	id: string;
	email: string;
	full_name: string;
	bio?: string;
	goals?: string;
	tech_stack?: string[];
	role: string;
	school?: string;
	major?: string;
	linkedin?: string;
	github?: string;
	portfolio?: string;
	job_title?: string;
	company?: string;
	grad_year?: number;
}

interface EditProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	userProfile: UserProfile;
	onSave: (updatedProfile: UserProfile) => void;
}

const techStackOptions = [
	"JavaScript",
	"TypeScript",
	"Python",
	"Java",
	"C++",
	"C#",
	"Go",
	"Rust",
	"PHP",
	"Ruby",
	"Swift",
	"Kotlin",
	"React",
	"Vue",
	"Angular",
	"Node.js",
	"Express",
	"Django",
	"Flask",
	"Spring",
	"Laravel",
	"PostgreSQL",
	"MySQL",
	"MongoDB",
	"Redis",
	"Docker",
	"Kubernetes",
	"AWS",
	"Azure",
	"GCP",
	"Git",
	"Linux",
	"DevOps",
];

export default function EditProfileModal({
	isOpen,
	onClose,
	userProfile,
	onSave,
}: EditProfileModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		full_name: "",
		bio: "",
		goals: "",
		tech_stack: [] as string[],
		role: "Mentee",
		school: "",
		major: "",
		linkedin: "",
		github: "",
		portfolio: "",
		job_title: "",
		company: "",
		grad_year: "",
	});

	// Initialize form data when modal opens
	useEffect(() => {
		if (isOpen && userProfile) {
			setFormData({
				full_name: userProfile.full_name || "",
				bio: userProfile.bio || "",
				goals: userProfile.goals || "",
				tech_stack: userProfile.tech_stack || [],
				role: userProfile.role || "Mentee",
				school: userProfile.school || "",
				major: userProfile.major || "",
				linkedin: userProfile.linkedin || "",
				github: userProfile.github || "",
				portfolio: userProfile.portfolio || "",
				job_title: userProfile.job_title || "",
				company: userProfile.company || "",
				grad_year: userProfile.grad_year
					? userProfile.grad_year.toString()
					: "",
			});
			setError(null);
		}
	}, [isOpen, userProfile]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleTechStackChange = (tech: string) => {
		setFormData((prev) => ({
			...prev,
			tech_stack: prev.tech_stack.includes(tech)
				? prev.tech_stack.filter((t) => t !== tech)
				: [...prev.tech_stack, tech],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validate required fields
			if (!formData.full_name.trim()) {
				throw new Error("Full name is required");
			}
			if (!formData.role) {
				throw new Error("Please select a role");
			}

			// Prepare the data for update
			const updateData = {
				full_name: formData.full_name.trim(),
				bio: formData.bio.trim() || null,
				goals: formData.goals.trim() || null,
				tech_stack:
					formData.tech_stack.length > 0 ? formData.tech_stack : null,
				role: formData.role,
				school: formData.school.trim() || null,
				major: formData.major.trim() || null,
				linkedin: formData.linkedin.trim() || null,
				github: formData.github.trim() || null,
				portfolio: formData.portfolio.trim() || null,
				job_title: formData.job_title.trim() || null,
				company: formData.company.trim() || null,
				grad_year: formData.grad_year
					? parseInt(formData.grad_year)
					: null,
				updated_at: new Date().toISOString(),
			};

			// Update the user data in the database
			const { data, error } = await supabase
				.from("users")
				.update(updateData)
				.eq("id", userProfile.id)
				.select()
				.single();

			if (error) {
				console.error("Supabase update error:", error);
				throw new Error(`Database error: ${error.message}`);
			}

			// Call the onSave callback with updated data
			onSave(data);
			onClose();
		} catch (err: any) {
			console.error("Profile update error:", err);
			setError(err.message || "An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
				{/* Fixed Header */}
				<div className="p-8 pb-6 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-bold text-gray-900">
							Edit Profile
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
						>
							×
						</button>
					</div>
				</div>

				{/* Scrollable Content */}
				<div className="flex-1 overflow-y-auto p-8 pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Full Name */}
						<div>
							<label
								htmlFor="full_name"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Full Name *
							</label>
							<input
								type="text"
								id="full_name"
								name="full_name"
								required
								value={formData.full_name}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
								placeholder="Enter your full name"
							/>
						</div>

						{/* Role */}
						<div>
							<label
								htmlFor="role"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Role *
							</label>
							<select
								id="role"
								name="role"
								required
								value={formData.role}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
							>
								<option value="Mentee">Mentee</option>
								<option value="Mentor">Mentor</option>
							</select>
						</div>

						{/* Bio */}
						<div>
							<label
								htmlFor="bio"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Bio
							</label>
							<textarea
								id="bio"
								name="bio"
								rows={4}
								value={formData.bio}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
								placeholder="Tell us about yourself..."
							/>
						</div>

						{/* Goals */}
						<div>
							<label
								htmlFor="goals"
								className="block text-sm font-semibold text-gray-700 mb-2"
							>
								Goals
							</label>
							<textarea
								id="goals"
								name="goals"
								rows={3}
								value={formData.goals}
								onChange={handleInputChange}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
								placeholder="What are your career goals?"
							/>
						</div>

						{/* Tech Stack */}
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-3">
								Tech Stack
							</label>
							<div className="border border-gray-200 rounded-xl overflow-hidden">
								<div className="p-4 max-h-48 overflow-y-auto">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
										{techStackOptions.map((tech) => (
											<label
												key={tech}
												className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg cursor-pointer"
											>
												<input
													type="checkbox"
													checked={formData.tech_stack.includes(
														tech
													)}
													onChange={() =>
														handleTechStackChange(
															tech
														)
													}
													className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700">
													{tech}
												</span>
											</label>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Education & Work Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* School */}
							<div>
								<label
									htmlFor="school"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									School
								</label>
								<input
									type="text"
									id="school"
									name="school"
									value={formData.school}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="University or school name"
								/>
							</div>

							{/* Major */}
							<div>
								<label
									htmlFor="major"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Major
								</label>
								<input
									type="text"
									id="major"
									name="major"
									value={formData.major}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="Your field of study"
								/>
							</div>

							{/* Job Title */}
							<div>
								<label
									htmlFor="job_title"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Job Title
								</label>
								<input
									type="text"
									id="job_title"
									name="job_title"
									value={formData.job_title}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="Your current job title"
								/>
							</div>

							{/* Company */}
							<div>
								<label
									htmlFor="company"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Company
								</label>
								<input
									type="text"
									id="company"
									name="company"
									value={formData.company}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="Your current company"
								/>
							</div>

							{/* Graduation Year */}
							<div className="md:col-span-2">
								<label
									htmlFor="grad_year"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Graduation Year
								</label>
								<input
									type="number"
									id="grad_year"
									name="grad_year"
									value={formData.grad_year}
									onChange={handleInputChange}
									min="2000"
									max="2030"
									className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="e.g., 2024"
								/>
							</div>
						</div>

						{/* Social Links */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* LinkedIn */}
							<div>
								<label
									htmlFor="linkedin"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									LinkedIn Profile
								</label>
								<input
									type="url"
									id="linkedin"
									name="linkedin"
									value={formData.linkedin}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="https://linkedin.com/in/yourprofile"
								/>
							</div>

							{/* GitHub */}
							<div>
								<label
									htmlFor="github"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									GitHub Profile
								</label>
								<input
									type="url"
									id="github"
									name="github"
									value={formData.github}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="https://github.com/yourusername"
								/>
							</div>

							{/* Portfolio */}
							<div>
								<label
									htmlFor="portfolio"
									className="block text-sm font-semibold text-gray-700 mb-2"
								>
									Portfolio Website
								</label>
								<input
									type="url"
									id="portfolio"
									name="portfolio"
									value={formData.portfolio}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
									placeholder="https://yourportfolio.com"
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-xl p-4">
								<span className="text-red-700 text-sm font-medium">
									{error}
								</span>
							</div>
						)}
					</form>
				</div>

				{/* Fixed Footer */}
				<div className="p-8 pt-6 border-t border-gray-200 bg-gray-50">
					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-white transition-all duration-200"
						>
							Cancel
						</button>
						<button
							type="submit"
							onClick={handleSubmit}
							disabled={loading}
							className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
