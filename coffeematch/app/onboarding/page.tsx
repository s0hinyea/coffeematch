"use client";

import React from "react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function OnboardingPage() {
	// Ensure user is authenticated before showing onboarding
	useAuthRedirect({ requireAuth: true });

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-5xl font-bold text-gray-900 mb-6">
							Complete Your Profile
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Tell us more about yourself to find the perfect
							coffee matches and build meaningful connections
						</p>
					</div>
					<OnboardingForm />
				</div>
			</div>
		</ProtectedRoute>
	);
}
