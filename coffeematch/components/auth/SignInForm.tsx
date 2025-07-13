// SignInForm: Handles user sign-in with email and password using the AuthContext
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Props for the SignInForm component
interface SignInFormProps {
	onSuccess?: () => void; // Called after successful sign-in
	onSwitchToSignUp?: () => void; // Switches to the sign-up form
	onSwitchToResetPassword?: () => void; // Switches to the reset password form
}

export default function SignInForm({
	onSuccess,
	onSwitchToSignUp,
	onSwitchToResetPassword,
}: SignInFormProps) {
	// State for form fields and UI feedback
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get the signIn function from the AuthContext
	const { signIn } = useAuth();

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Attempt to sign in with the provided credentials
		const { error } = await signIn(email, password);

		if (error) {
			// Show error message if sign-in fails
			setError(error.message);
		} else {
			// Call onSuccess callback if provided
			onSuccess?.();
		}

		setLoading(false);
	};

	return (
		<div className="w-full max-w-md mx-auto">
			{/* Sign-in form */}
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-semibold text-gray-700 mb-2"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Enter your email"
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-semibold text-gray-700 mb-2"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Enter your password"
					/>
				</div>

				{/* Show error message if sign-in fails */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
						{error}
					</div>
				)}

				{/* Submit button */}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow hover:shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
				>
					{loading ? "Signing in..." : "Sign In"}
				</button>

				{/* Links to switch to sign-up or reset password forms */}
				<div className="flex justify-between text-sm pt-4">
					<button
						type="button"
						onClick={onSwitchToSignUp}
						className="text-blue-600 hover:text-blue-700 font-medium"
					>
						Don't have an account? Sign up
					</button>
					<button
						type="button"
						onClick={onSwitchToResetPassword}
						className="text-blue-600 hover:text-blue-700 font-medium"
					>
						Forgot password?
					</button>
				</div>
			</form>
		</div>
	);
}
