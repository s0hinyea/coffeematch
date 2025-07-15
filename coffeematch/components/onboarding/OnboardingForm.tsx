"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

type UserRole = "Mentee" | "Mentor";

interface OnboardingData {
	full_name: string;
	bio: string;
	goals: string;
	tech_stack: string[];
	role: UserRole;
	school: string;
	major: string;
	linkedin: string;
	github: string;
	portfolio: string;
	job_title: string;
	company: string;
	grad_year: string;
}

const techStackOptions = [
	"JavaScript",
	"TypeScript",
	"React",
	"Next.js",
	"Node.js",
	"Python",
	"Java",
	"C++",
	"Go",
	"Rust",
	"Swift",
	"Kotlin",
	"Vue.js",
	"Angular",
	"Express.js",
	"Django",
	"Flask",
	"Spring Boot",
	"PostgreSQL",
	"MongoDB",
	"MySQL",
	"Redis",
	"Docker",
	"Kubernetes",
	"AWS",
	"Azure",
	"GCP",
	"Git",
	"GraphQL",
	"REST APIs",
];

export default function OnboardingForm() {
	const { user } = useAuth();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState<OnboardingData>({
		full_name: "",
		bio: "",
		goals: "",
		tech_stack: [],
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
		setError("");

		try {
			// Validate required fields
			if (!formData.full_name.trim()) {
				throw new Error("Full name is required");
			}
			if (!formData.role) {
				throw new Error("Please select a role");
			}

			// Get the current user
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError) {
				console.error("Auth error:", userError);
				throw new Error("Authentication error: " + userError.message);
			}

			if (!user) {
				throw new Error("No authenticated user found");
			}

			// Prepare the data for insertion
			const userData = {
				id: user.id, // This maps to auth.users.id
				email: user.email, // Automatically use email from auth
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
			};

			console.log("Attempting to insert user data:", userData);

			const res = await fetch('/api/onboarding', {
				method: 'POST',
				headers: {
					'Content-Type' : 'applicaton/json'
				},
				body: JSON.stringify(userData)
			})

			console.log("Upserted"); 
			// Insert the user data into the users table
			const { data, error } = await supabase
				.from("users")
				.insert([userData])
				.select();

			if (error) {
				console.error("Supabase insertion error:", error);
				throw new Error(`Database error: ${error.message}`);
			}

			console.log("User data inserted successfully:", data);

			// Redirect to dashboard on success
			router.push("/dashboard");
		} catch (err: any) {
			console.error("Onboarding error:", err);
			setError(err.message || "An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white shadow rounded-lg p-10 border border-blue-100">
			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Full Name */}
				<div>
					<label
						htmlFor="full_name"
						className="block text-sm font-semibold text-gray-700 mb-3"
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
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Enter your full name"
					/>
				</div>

				{/* Role */}
				<div>
					<label
						htmlFor="role"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Role *
					</label>
					<select
						id="role"
						name="role"
						required
						value={formData.role}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
					>
						<option value="Mentee">Mentee</option>
						<option value="Mentor">Mentor</option>
					</select>
				</div>

				{/* Bio */}
				<div>
					<label
						htmlFor="bio"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Bio
					</label>
					<textarea
						id="bio"
						name="bio"
						rows={4}
						value={formData.bio}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
						placeholder="Tell us about yourself..."
					/>
				</div>

				{/* Goals */}
				<div>
					<label
						htmlFor="goals"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Goals
					</label>
					<textarea
						id="goals"
						name="goals"
						rows={3}
						value={formData.goals}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
						placeholder="What are your career goals?"
					/>
				</div>

				{/* Tech Stack */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-4">
						Tech Stack
					</label>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
						{techStackOptions.map((tech) => (
							<label
								key={tech}
								className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={formData.tech_stack.includes(tech)}
									onChange={() => handleTechStackChange(tech)}
									className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
								/>
								<span className="text-sm text-gray-700 font-medium">
									{tech}
								</span>
							</label>
						))}
					</div>
				</div>

				{/* School */}
				<div>
					<label
						htmlFor="school"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						School
					</label>
					<input
						type="text"
						id="school"
						name="school"
						value={formData.school}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="University or school name"
					/>
				</div>

				{/* Major */}
				<div>
					<label
						htmlFor="major"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Major
					</label>
					<input
						type="text"
						id="major"
						name="major"
						value={formData.major}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Your field of study"
					/>
				</div>

				{/* Graduation Year */}
				<div>
					<label
						htmlFor="grad_year"
						className="block text-sm font-semibold text-gray-700 mb-3"
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
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="e.g., 2024"
					/>
				</div>

				{/* Job Title */}
				<div>
					<label
						htmlFor="job_title"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Current Job Title
					</label>
					<input
						type="text"
						id="job_title"
						name="job_title"
						value={formData.job_title}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="e.g., Software Engineer, Student"
					/>
				</div>

				{/* Company */}
				<div>
					<label
						htmlFor="company"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Company/Organization
					</label>
					<input
						type="text"
						id="company"
						name="company"
						value={formData.company}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="e.g., Microsoft, University of XYZ"
					/>
				</div>

				{/* LinkedIn */}
				<div>
					<label
						htmlFor="linkedin"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						LinkedIn Profile
					</label>
					<input
						type="url"
						id="linkedin"
						name="linkedin"
						value={formData.linkedin}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="https://linkedin.com/in/yourprofile"
					/>
				</div>

				{/* GitHub */}
				<div>
					<label
						htmlFor="github"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						GitHub Profile
					</label>
					<input
						type="url"
						id="github"
						name="github"
						value={formData.github}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="https://github.com/yourusername"
					/>
				</div>

				{/* Portfolio */}
				<div>
					<label
						htmlFor="portfolio"
						className="block text-sm font-semibold text-gray-700 mb-3"
					>
						Portfolio Website
					</label>
					<input
						type="url"
						id="portfolio"
						name="portfolio"
						value={formData.portfolio}
						onChange={handleInputChange}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="https://yourportfolio.com"
					/>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<span className="text-red-700 text-sm font-medium">
							{error}
						</span>
					</div>
				)}

				{/* Submit Button */}
				<div className="pt-8">
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg shadow hover:shadow-md transform hover:scale-105 transition-all duration-200 text-lg disabled:transform-none"
					>
						{loading ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
								Completing Profile...
							</div>
						) : (
							"Complete Profile"
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
