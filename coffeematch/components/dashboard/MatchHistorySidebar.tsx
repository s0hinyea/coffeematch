import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInteractions } from '@/lib/getInteractions';
import { getUserProfile } from '@/lib/getUserProfile';

export default function HistorySidebar(){

	const [activeTab, setActiveTab ] = useState<string>('matched');
	const [ interactions, setInteractions ] = useState([]);
	const [ loading, setLoading ] = useState(true);


	useEffect(() => {



	})

	const changeTab = (status: string) => {
		activeTab == status ? setActiveTab(activeTab) : setActiveTab(status)
	}

  return (
    <div className="fixed top-0 right-0 h-full z-50 group">
					{/* Trigger Tab - Minimal Edge */}
					<div className="absolute top-20 -left-4 w-4 h-16 bg-white shadow-lg rounded-l-md cursor-pointer group-hover:bg-blue-50 transition-all duration-300 border border-r-0 border-gray-200">
					</div>

					{/* Sliding Sidebar Panel */}
					<div className="h-full w-80 bg-white shadow-2xl transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out border-l border-gray-200">
						<div className="p-6 h-full overflow-y-auto">
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold text-gray-900">Match History</h3>
								<div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
							</div>

							

							{ activeTab == 'matched' ?
							<div>
							<div className="flex border-b border-gray-200 mb-6">
								<button onClick = { () => { changeTab('matched') }} className="flex-1 py-2 px-1 text-sm font-medium text-purple-500 hover:text-gray-700 transition-colors">
									Matched
								</button>
								<button onClick = { () => { changeTab('skipped') }} className="flex-1 py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
									Skipped
								</button>
							</div>

						
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path  strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h4 className="text-lg font-medium text-gray-900 mb-2">No history yet</h4>
								<p className="text-gray-500 text-sm leading-relaxed">
									Start matching to see your interaction history here. Your recent matches and connections will appear in this panel.
								</p>
							</div> 
							</div>

							 : 

							 <div>
								<div className="flex border-b border-gray-200 mb-6">
							<button onClick = { () => { changeTab('matched') }} className="flex-1 py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
								Matched
							</button>
							<button onClick = { () => { changeTab('skipped') }} className="flex-1 py-2 px-1 text-sm font-medium text-purple-500 hover:text-gray-700 transition-colors">
								Skipped
							</button>
						</div>

						
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h4 className="text-lg font-medium text-gray-900 mb-2">No history yet</h4>
							<p className="text-gray-500 text-sm leading-relaxed">
								Start matching to see your interaction history here. Your recent matches and connections will appear in this panel.
							</p>
						</div>
						</div>
					}
							

								

							{/* Footer Actions */}
							<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
								<button className="w-full text-sm text-gray-500 hover:text-blue-600 py-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200 hover:shadow-sm">
									View All History
								</button>
							</div>
						</div>
					</div>
				</div>
  )
}