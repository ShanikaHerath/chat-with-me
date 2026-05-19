import React from "react";
import { Menu, ChevronDown, Sun, Moon } from "lucide-react";

export default function Header({
	sidebarOpen,
	setSidebarOpen,
	selectedModel,
	setSelectedModel,
	theme,
	setTheme,
	models,
	modelDropdownOpen,
	setModelDropdownOpen,
	userProfile,
	handleProfileClick,
	activeChatTitle
}) {
	return (
		<header className="header">
			<div className="header-container">
				{/* Menu toggle button */}
				<button 
					className="menu-toggle header-menu-btn" 
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-label="Toggle Menu"
				>
					<Menu size={22} />
				</button>
				
				{/* Avatar container */}
				<div 
					className="avatar-container" 
					onClick={handleProfileClick} 
					style={{ cursor: "pointer" }}
					title="Profile settings"
				>
					<div className="avatar">
						{userProfile.avatarImage ? (
							<img 
								src={userProfile.avatarImage} 
								alt="Profile" 
								style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
							/>
						) : (
							"L"
						)}
					</div>
				</div>
				
				{/* Header title & subtitle */}
				<div className="header-info">
					<h1>Lakma Assistant</h1>
					<p>{activeChatTitle || "Powered by AI"}</p>
				</div>

				{/* Futuristic System Status Indicator */}
				<div className="system-status-indicator">
					<span className="pulse-dot"></span>
					<span className="status-label">LAKMA ACTIVE</span>
				</div>
				
				{/* Header right tools */}
				<div className="header-right-controls" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.8rem" }}>
					{/* Model Selector Dropdown */}
					<div className="model-selector-container">
						<button 
							className="model-selector-btn" 
							onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
						>
							<span>{selectedModel.name.replace("Lakma ", "")}</span>
							<ChevronDown size={16} />
						</button>

						{modelDropdownOpen && (
							<div className="model-dropdown">
								{models.map((m) => (
									<div 
										key={m.id} 
										className="model-dropdown-item"
										onClick={() => {
											setSelectedModel(m);
											setModelDropdownOpen(false);
										}}
									>
										<span className="model-name">{m.name}</span>
										<span className="model-desc">{m.desc}</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Theme Changer */}
					<button 
						className="theme-toggle-btn"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						aria-label="Toggle Theme"
					>
						{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
					</button>
				</div>
			</div>
			{/* Gradient divider line */}
			<div className="header-divider"></div>
		</header>
	);
}
