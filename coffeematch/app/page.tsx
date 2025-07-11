"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function Home() {
	const { loading } = useAuthRedirect({
		redirectIfAuthenticated: true,
		redirectIfUnauthenticated: true,
	});

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">
						Loading Coffee Match...
					</p>
				</div>
			</div>
		);
	}

	return null;
}
