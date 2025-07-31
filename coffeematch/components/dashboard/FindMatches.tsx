import { useState } from 'react';
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { supabase } from "@/lib/supabase";
import { saveInteraction } from "@/lib/saveInteraction";

type MatchData = {
  id: string;
  full_name: string; 
  bio: string;
  score: number;
}

export const showMatch = async(setMatchLoading: Function, setMatchError: Function, setMatchData: Function) => {
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


export const handleInteraction = async (status: string, matchData: MatchData , setMatchError: Function, setMatchData: Function) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !matchData) {
      throw new Error('User or match data not available');
    }

    // Create interaction object
    const interaction = {
      user_id: user.id,
      matched_id: matchData.id,
      status: status
    };

    // Save the interaction
    await saveInteraction(interaction);

    
    
    console.log(`Interaction saved: ${status} for match ${matchData.id}`);
    
    // Clear the current match to allow finding new ones
    setMatchData(null);
    setMatchError(null);
    
  } catch (error) {
    console.error("Error saving interaction:", error);
    setMatchError(error instanceof Error ? error.message : 'Failed to save interaction');
  }
};
 
export default function FindMatches(){
	const [matchData, setMatchData] = useState<{id: string, full_name: string, bio: string, score: number} | null>(null);
	const [matchLoading, setMatchLoading] = useState(false);
	const [matchError, setMatchError] = useState<string | null>(null);

  

	


  return (
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
									onClick={() => showMatch(setMatchLoading, setMatchError, setMatchData)} 
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
												<div className="flex gap-3">
													<button 
														onClick={() => handleInteraction('matched', matchData, setMatchError, setMatchData)} 
														className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
													>
														<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
														</svg>
														Match
													</button>
													<button 
														onClick={() => handleInteraction('skipped', matchData, setMatchError, setMatchData)} 
														className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
													>
														<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
														</svg>
														Skip
													</button>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
  )
}