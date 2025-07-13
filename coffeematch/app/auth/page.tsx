"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

type AuthMode = "signin" | "signup" | "reset";

export default function AuthPage() {
	const [mode, setMode] = useState<AuthMode>("signin");
	useAuthRedirect({ redirectIfAuthenticated: true });
	const router = useRouter();

	const handleSuccess = () => {
		if (mode === "signin") {
			router.push("/dashboard");
		} else if (mode === "signup") {
			router.push("/onboarding");
		}
	};

	const renderForm = () => {
		switch (mode) {
			case "signin":
				return (
					<SignInForm
						onSuccess={handleSuccess}
						onSwitchToSignUp={() => setMode("signup")}
						onSwitchToResetPassword={() => setMode("reset")}
					/>
				);
			case "signup":
				return (
					<SignUpForm
						onSuccess={handleSuccess}
						onSwitchToSignIn={() => setMode("signin")}
					/>
				);
			case "reset":
				return (
					<ResetPasswordForm
						onSuccess={handleSuccess}
						onSwitchToSignIn={() => setMode("signin")}
					/>
				);
			default:
				return null;
		}
	};

	const getTitle = () => {
		switch (mode) {
			case "signin":
				return "Sign In";
			case "signup":
				return "Create Account";
			case "reset":
				return "Reset Password";
			default:
				return "Authentication";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-lg shadow p-10 border border-blue-100">
					<div className="text-center mb-10">
						<h2 className="text-4xl font-bold text-gray-900 mb-3">
							{getTitle()}
						</h2>
						<p className="text-lg text-gray-600">
							{mode === "signin" &&
								"Welcome back to Coffee Match"}
							{mode === "signup" &&
								"Join the Coffee Match community"}
							{mode === "reset" && "Reset your account password"}
						</p>
					</div>
					{renderForm()}
				</div>
			</div>
		</div>
	);
}
