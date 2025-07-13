import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface UserProfile {
	id: string;
	email: string;
	full_name: string;
	bio?: string;
	goals?: string;
	tech_stack?: string[];
	role: string;
	school?: string;
	major?: string;
	linkedin?: string;
	github?: string;
	portfolio?: string;
	job_title?: string;
	company?: string;
	grad_year?: number;
	created_at: string;
	updated_at: string;
}

export function useUserProfile() {
	const { user } = useAuth();
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUserProfile() {
			if (!user) {
				setUserProfile(null);
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const { data, error } = await supabase
					.from("users")
					.select("*")
					.eq("id", user.id)
					.single();

				if (error) {
					console.error("Error fetching user profile:", error);
					setError(error.message);
					setUserProfile(null);
				} else {
					setUserProfile(data);
					setError(null);
				}
			} catch (err) {
				console.error("User profile fetch failed:", err);
				setError("Failed to load user profile");
				setUserProfile(null);
			} finally {
				setLoading(false);
			}
		}

		fetchUserProfile();
	}, [user]);

	const refreshProfile = async () => {
		if (user) {
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", user.id)
				.single();

			if (!error && data) {
				setUserProfile(data);
			}
		}
	};

	return { userProfile, loading, error, refreshProfile };
}
