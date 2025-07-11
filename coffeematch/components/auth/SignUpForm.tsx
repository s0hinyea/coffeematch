// SignUpForm: Handles user registration with email and password using the AuthContext
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Props for the SignUpForm component
interface SignUpFormProps {
	onSuccess?: () => void; // Called after successful sign-up
	onSwitchToSignIn?: () => void; // Switches to the sign-in form
}

export default function SignUpForm({
	onSuccess,
	onSwitchToSignIn,
}: SignUpFormProps) {
	// State for form fields and UI feedback
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	// Get the signUp function from the AuthContext
	const { signUp } = useAuth();

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		// Validate that passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Validate password length
		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		// Attempt to sign up with the provided credentials
		const { error } = await signUp(email, password);

		if (error) {
			// Show error message if sign-up fails
			setError(error.message);
		} else {
			// Show success message and call onSuccess callback if provided
			setMessage("Check your email for a confirmation link!");
			onSuccess?.();
		}

		setLoading(false);
	};

	return (
		<div className="w-full">
			{/* Sign-up form */}
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
						className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Enter your password"
					/>
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-semibold text-gray-700 mb-2"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
						placeholder="Confirm your password"
					/>
				</div>

				{/* Show error message if sign-up fails */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
						{error}
					</div>
				)}

				{/* Show success message if sign-up succeeds */}
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
					{loading ? "Creating account..." : "Sign Up"}
				</button>

				{/* Link to switch to sign-in form */}
				<div className="text-center pt-4">
					<button
						type="button"
						onClick={onSwitchToSignIn}
						className="text-blue-600 hover:text-blue-700 font-medium"
					>
						Already have an account? Sign in
					</button>
				</div>
			</form>
		</div>
	);
}
