// UserProfile: Displays current user information and provides logout functionality
// This component uses the AuthContext to access user data and the signOut function
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";

// This component exports a user profile display that:
// 1. Shows user information (email, ID, join date) from AuthContext
// 2. Provides a logout button that uses AuthContext's signOut function
// 3. Redirects to auth page after logout
// 4. Renders nothing if no user is authenticated
export default function UserProfile() {
	// Get user data and signOut function from AuthContext
	const { signOut } = useAuth();
	const { userProfile, loading, error, refreshProfile } = useUserProfile();
	const router = useRouter();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Handle logout process
	const handleSignOut = async () => {
		// Call the signOut function from AuthContext
		await signOut();
		// Redirect to auth page after successful logout
		router.push("/auth");
	};

	// Handle successful profile update
	const handleProfileUpdate = (updatedProfile: any) => {
		setIsEditModalOpen(false);
		refreshProfile(); // Refresh the profile data
	};

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow p-8 border border-blue-100">
				<div className="animate-pulse">
					<div className="flex items-center space-x-4">
						<div className="h-16 w-16 rounded-full bg-gray-200"></div>
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !userProfile) {
		return (
			<div className="bg-white rounded-lg shadow p-8 border border-blue-100">
				<div className="text-center">
					<p className="text-red-600 mb-4">
						{error || "Unable to load profile"}
					</p>
					<button
						onClick={() => router.push("/onboarding")}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
					>
						Complete Profile
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow p-8 border border-blue-100">
			{/* Header with avatar and basic info */}
			<div className="flex items-center space-x-6 mb-6">
				<div className="flex-shrink-0">
					<div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
						<span className="text-white font-bold text-xl">
							{userProfile.full_name?.charAt(0).toUpperCase() ||
								userProfile.email?.charAt(0).toUpperCase()}
						</span>
					</div>
				</div>

				<div className="flex-1 min-w-0">
					<h2 className="text-2xl font-bold text-gray-900 truncate">
						{userProfile.full_name}
					</h2>
					<p className="text-blue-600 font-medium capitalize">
						{userProfile.role}
					</p>
					<p className="text-sm text-gray-500">{userProfile.email}</p>
				</div>

				<button
					onClick={handleSignOut}
					className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow mr-3"
				>
					Sign Out
				</button>

				<button
					onClick={() => setIsEditModalOpen(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow"
				>
					Edit Profile
				</button>
			</div>

			{/* Profile details */}
			<div className="space-y-4">
				{/* Bio */}
				{userProfile.bio && (
					<div>
						<h3 className="text-sm font-semibold text-gray-700 mb-1">
							Bio
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							{userProfile.bio}
						</p>
					</div>
				)}

				{/* Goals */}
				{userProfile.goals && (
					<div>
						<h3 className="text-sm font-semibold text-gray-700 mb-1">
							Goals
						</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							{userProfile.goals}
						</p>
					</div>
				)}

				{/* Education & Work Info */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{userProfile.school && (
						<div>
							<h3 className="text-sm font-semibold text-gray-700 mb-1">
								School
							</h3>
							<p className="text-gray-600 text-sm">
								{userProfile.school}
							</p>
						</div>
					)}

					{userProfile.major && (
						<div>
							<h3 className="text-sm font-semibold text-gray-700 mb-1">
								Major
							</h3>
							<p className="text-gray-600 text-sm">
								{userProfile.major}
							</p>
						</div>
					)}

					{userProfile.job_title && (
						<div>
							<h3 className="text-sm font-semibold text-gray-700 mb-1">
								Job Title
							</h3>
							<p className="text-gray-600 text-sm">
								{userProfile.job_title}
							</p>
						</div>
					)}

					{userProfile.company && (
						<div>
							<h3 className="text-sm font-semibold text-gray-700 mb-1">
								Company
							</h3>
							<p className="text-gray-600 text-sm">
								{userProfile.company}
							</p>
						</div>
					)}

					{userProfile.grad_year && (
						<div>
							<h3 className="text-sm font-semibold text-gray-700 mb-1">
								Graduation Year
							</h3>
							<p className="text-gray-600 text-sm">
								{userProfile.grad_year}
							</p>
						</div>
					)}
				</div>

				{/* Tech Stack */}
				{userProfile.tech_stack &&
					userProfile.tech_stack.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-gray-700 mb-2">
								Tech Stack
							</h3>
							<div className="flex flex-wrap gap-2">
								{userProfile.tech_stack.map((tech) => (
									<span
										key={tech}
										className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					)}

				{/* Social Links */}
				{(userProfile.linkedin ||
					userProfile.github ||
					userProfile.portfolio) && (
					<div>
						<h3 className="text-sm font-semibold text-gray-700 mb-2">
							Links
						</h3>
						<div className="flex flex-wrap gap-2">
							{userProfile.linkedin && (
								<a
									href={userProfile.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200"
								>
									LinkedIn
								</a>
							)}
							{userProfile.github && (
								<a
									href={userProfile.github}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200"
								>
									GitHub
								</a>
							)}
							{userProfile.portfolio && (
								<a
									href={userProfile.portfolio}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200"
								>
									Portfolio
								</a>
							)}
						</div>
					</div>
				)}

				{/* Member since */}
				<div className="pt-4 border-t border-gray-100">
					<p className="text-xs text-gray-500">
						Member since{" "}
						{new Date(userProfile.created_at).toLocaleDateString()}
					</p>
				</div>
			</div>

			{/* Edit Profile Modal */}
			{isEditModalOpen && (
				<EditProfileModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					onSave={handleProfileUpdate}
					userProfile={userProfile}
				/>
			)}
		</div>
	);
}
