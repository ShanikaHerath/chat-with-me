import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
	const [progress, setProgress] = useState(0);
	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		// Increment progress bar over 1.8 seconds for a premium loading feel
		const duration = 1800; // ms
		const intervalTime = 20; // ms
		const steps = duration / intervalTime;
		let currentStep = 0;

		const progressInterval = setInterval(() => {
			currentStep++;
			const currentProgress = Math.min((currentStep / steps) * 100, 100);
			setProgress(currentProgress);

			if (currentStep >= steps) {
				clearInterval(progressInterval);
				// Trigger fade out transition after a brief pause at 100%
				setTimeout(() => {
					setFadeOut(true);
					// Finish splash screen after animation completes (600ms)
					setTimeout(() => {
						onFinish();
					}, 600);
				}, 200);
			}
		}, intervalTime);

		return () => clearInterval(progressInterval);
	}, [onFinish]);

	return (
		<div className={`splash-overlay ${fadeOut ? "fade-out" : ""}`}>
			<div className="splash-content">
				<div className="splash-logo-container">
					<div className="splash-logo-glow"></div>
					{/* Glowing futuristic spark and circular orbit logo */}
					<svg
						className="splash-logo-svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						{/* Outer orbiting dashed ring */}
						<circle cx="12" cy="12" r="9" stroke="url(#logo-grad-1)" strokeWidth="1" strokeDasharray="3 3" />
						{/* Inner glowing ring */}
						<circle cx="12" cy="12" r="6.5" stroke="url(#logo-grad-2)" strokeWidth="1.5" />
						
						{/* Central sparkling star */}
						<path
							d="M12 7.5v9M7.5 12h9"
							stroke="url(#logo-grad-2)"
							strokeWidth="2.5"
						/>
						{/* Small diagonal sparks */}
						<path
							d="M9.5 9.5l5 5M14.5 9.5l-5 5"
							stroke="url(#logo-grad-1)"
							strokeWidth="1.2"
						/>
						
						<defs>
							<linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="#2563eb" />
								<stop offset="100%" stopColor="#00f2fe" />
							</linearGradient>
							<linearGradient id="logo-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stopColor="#00f2fe" stopOpacity="0.85" />
								<stop offset="100%" stopColor="#3b82f6" />
							</linearGradient>
						</defs>
					</svg>
				</div>

				<div className="splash-title-wrapper">
					<h1 className="splash-title">Lakma AI</h1>
					<p className="splash-subtitle">Your Intelligent Assistant</p>
				</div>

				<div className="splash-loader-bar">
					<div
						className="splash-loader-progress"
						style={{ width: `${progress}%` }}
					></div>
				</div>
			</div>
		</div>
	);
}
