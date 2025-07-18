"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserProfile from "@/components/dashboard/UserProfile";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
	const router = useRouter();
	const { hasCompletedOnboarding, loading } = useOnboardingStatus();
	
	// Match feature state
	const [matchData, setMatchData] = useState<{id: string, full_name: string, bio: string, score: number} | null>(null);
	const [matchLoading, setMatchLoading] = useState(false);
	const [matchError, setMatchError] = useState<string | null>(null);

	useEffect(() => {
		if (!loading && hasCompletedOnboarding === false) {
			router.push("/onboarding");
		}
	}, [hasCompletedOnboarding, loading, router]);

	const showMatch = async() => {
		setMatchLoading(true);
		setMatchError(null);
		setMatchData(null);
		
		try{
			const {data : {user} } = await supabase.auth.getUser();
			const userId = user!.id

			// Call the match API
			const res = await fetch(`/api/match?id=${userId}`, {
				method: 'GET'
			});
			
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}
			
			const match = await res.json();
			console.log("Match API response:", match);
			
			if (match && match.id) {
				// Extract userId from match and fetch user details from Supabase
				const { data: userData, error: userError } = await supabase
					.from('users')
					.select('full_name, bio')
					.eq('id', match.id)
					.single();
				
				if (userError) {
					throw new Error(`Failed to fetch user details: ${userError.message}`);
				}
				
				if (userData) {
					setMatchData({
						id: match.id,
						full_name: userData.full_name,
						bio: userData.bio,
						score: match.score || 0
					});
				} else {
					throw new Error('No user data found for the matched user');
				}
			} else {
				setMatchError('No match found. Try again later!');
			}
		} catch (error){
			console.log("Error matching: ", error);
			setMatchError(error instanceof Error ? error.message : 'Failed to find matches. Please try again.');
		} finally {
			setMatchLoading(false);
		}
	}



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
								<button 
									onClick={showMatch} 
									disabled={matchLoading}
									className={`inline-flex items-center px-6 py-3 ${
										matchLoading 
											? 'bg-blue-400 cursor-not-allowed' 
											: 'bg-blue-600 hover:bg-blue-700'
									} text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
								>
									{matchLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Finding Matches...
										</>
									) : (
										'Find Matches'
									)}
								</button>

								{/* Match Results Display */}
								{matchError && (
									<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
										<p className="text-red-600 text-sm font-medium">
											{matchError}
										</p>
									</div>
								)}

								{matchData && (
									<div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 shadow-sm">
										<div className="flex items-center mb-4">
											<div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
											<h3 className="text-xl font-bold text-gray-900">
												Match Found!
											</h3>
										</div>
										
										<div className="space-y-3">
											<div>
												<h4 className="text-lg font-semibold text-gray-800">
													{matchData.full_name}
												</h4>
												<div className="flex items-center text-sm text-gray-500 mt-1">
													<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
														{Math.round(matchData.score * 100)}% Match
													</span>
												</div>
											</div>
											
											{matchData.bio && (
												<div>
													<p className="text-gray-600 leading-relaxed">
														{matchData.bio}
													</p>
												</div>
											)}
											
											<div className="pt-3 border-t border-gray-200">
												<button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200">
													Connect
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}
