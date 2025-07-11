// ResetPasswordForm: Handles sending a password reset email using the AuthContext
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Props for the ResetPasswordForm component
interface ResetPasswordFormProps {
	onSuccess?: () => void; // Called after successful reset request
	onSwitchToSignIn?: () => void; // Switches to the sign-in form
}

export default function ResetPasswordForm({
	onSuccess,
	onSwitchToSignIn,
}: ResetPasswordFormProps) {
	// State for form fields and UI feedback
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	// Get the resetPassword function from the AuthContext
	const { resetPassword } = useAuth();

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		// Attempt to send a password reset email
		const { error } = await resetPassword(email);

		if (error) {
			// Show error message if request fails
			setError(error.message);
		} else {
			// Show success message and call onSuccess callback if provided
			setMessage("Check your email for a password reset link!");
			onSuccess?.();
		}

		setLoading(false);
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900">
					Reset Password
				</h2>
				<p className="mt-2 text-sm text-gray-600">
					Enter your email address and we'll send you a link to reset
					your password.
				</p>
			</div>

			{/* Password reset form */}
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
						className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Enter your email"
					/>
				</div>

				{/* Show error message if request fails */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
						{error}
					</div>
				)}

				{/* Show success message if request succeeds */}
				{message && (
					<div className="bg-green-50 border border-green-200 text-green-600 text-sm p-3 rounded-xl">
						{message}
					</div>
				)}

				{/* Submit button */}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
				>
					{loading ? "Sending..." : "Send Reset Link"}
				</button>

				{/* Link to switch to sign-in form */}
				<div className="text-center pt-4">
					<button
						type="button"
						onClick={onSwitchToSignIn}
						className="text-blue-600 hover:text-blue-700 font-medium"
					>
						Back to Sign In
					</button>
				</div>
			</form>
		</div>
	);
}
