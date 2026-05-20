export default function WelcomeScreen({ suggestions, handleSubmit, userProfile }) {
	return (
		<div className="welcome-screen">
			<div className="welcome-badge">
				<span className="welcome-badge-dot"></span>
				LAKMA V3.5 ACTIVE
			</div>
			
			<h1 className="greeting-text">
				Hello, <span>{userProfile.name}</span>
			</h1>
			<h2 className="subtitle-text">
				How can Lakma assist you today?
			</h2>

			{/* Suggestion Cards */}
			<div className="suggestions-grid">
				{suggestions.map((card, i) => (
					<div 
						key={i} 
						className="suggestion-card"
						onClick={() => handleSubmit(card.prompt)}
					>
						<p className="suggestion-text">{card.text}</p>
						<div className="suggestion-card-icon">
							{card.icon}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
