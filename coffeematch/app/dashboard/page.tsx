"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserProfile from "@/components/dashboard/UserProfile";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

export default function DashboardPage() {
	const router = useRouter();
	const { hasCompletedOnboarding, loading } = useOnboardingStatus();

	useEffect(() => {
		if (!loading && hasCompletedOnboarding === false) {
			router.push("/onboarding");
		}
	}, [hasCompletedOnboarding, loading, router]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">
						Loading your dashboard...
					</p>
				</div>
			</div>
		);
	}

	if (hasCompletedOnboarding === false) {
		return null; // Will redirect to onboarding
	}
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
					<div className="mb-8">
						<div className="bg-white rounded-lg shadow p-8">
							<h1 className="text-4xl font-bold text-gray-900 mb-3">
								Dashboard
							</h1>
							<p className="text-lg text-gray-600">
								Welcome back! Here's what's happening with your
								Coffee Match connections.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<UserProfile />

						<div className="bg-white rounded-lg shadow p-8 ">
							<div className="flex items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-900">
									Welcome to Coffee Match!
								</h2>
							</div>
							<p className="text-gray-600 leading-relaxed text-lg mb-6">
								This is your protected dashboard where you can
								manage your profile, view your matches, and
								connect with fellow coffee enthusiasts. Start
								exploring to find your perfect coffee companion!
							</p>
							<div className="pt-4 border-t border-gray-100">
								<button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
									Find Matches
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}
