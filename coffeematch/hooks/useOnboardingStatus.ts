import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function useOnboardingStatus() {
	const { user } = useAuth();
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
		boolean | null
	>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function checkOnboardingStatus() {
			if (!user) {
				setHasCompletedOnboarding(false);
				setLoading(false);
				return;
			}

			try {
				const { data, error } = await supabase
					.from("users")
					.select("id")
					.eq("id", user.id)
					.single();

				if (error) {
					console.error("Error checking onboarding status:", error);
					// If user doesn't exist in users table, they haven't completed onboarding
					setHasCompletedOnboarding(false);
				} else {
					// User exists in users table, onboarding completed
					setHasCompletedOnboarding(!!data);
				}
			} catch (err) {
				console.error("Onboarding status check failed:", err);
				setHasCompletedOnboarding(false);
			} finally {
				setLoading(false);
			}
		}

		checkOnboardingStatus();
	}, [user]);

	return { hasCompletedOnboarding, loading };
}
