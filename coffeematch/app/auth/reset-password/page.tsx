"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Check if we have the necessary parameters
		const accessToken = searchParams.get("access_token");
		const refreshToken = searchParams.get("refresh_token");

		if (!accessToken || !refreshToken) {
			setError(
				"Invalid reset link. Please request a new password reset."
			);
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		const accessToken = searchParams.get("access_token");
		const refreshToken = searchParams.get("refresh_token");

		if (!accessToken || !refreshToken) {
			setError("Invalid reset link");
			setLoading(false);
			return;
		}

		const { error } = await supabase.auth.updateUser({
			password: password,
		});

		if (error) {
			setError(error.message);
		} else {
			setMessage(
				"Password updated successfully! Redirecting to sign in..."
			);
			setTimeout(() => {
				router.push("/auth");
			}, 2000);
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<div className="text-center mb-8">
						<div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
							<svg
								className="h-6 w-6 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h2 className="text-3xl font-bold text-gray-900">
							Set New Password
						</h2>
						<p className="mt-2 text-gray-600">
							Enter your new password below to complete the reset
							process.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								New Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
								placeholder="Enter your new password"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Confirm New Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
								className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
								placeholder="Confirm your new password"
							/>
						</div>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4">
								<div className="flex">
									<svg
										className="h-5 w-5 text-red-400 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span className="text-red-700 text-sm">
										{error}
									</span>
								</div>
							</div>
						)}

						{message && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<div className="flex">
									<svg
										className="h-5 w-5 text-green-400 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span className="text-green-700 text-sm">
										{message}
									</span>
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
						>
							{loading ? "Updating..." : "Update Password"}
						</button>

						<div className="text-center pt-4">
							<button
								type="button"
								onClick={() => router.push("/auth")}
								className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
							>
								← Back to Sign In
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
