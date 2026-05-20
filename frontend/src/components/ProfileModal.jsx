import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";

export default function ProfileModal({
	isOpen,
	onClose,
	userProfile,
	setUserProfile
}) {
	const [name, setName] = useState(userProfile.name);
	const [email, setEmail] = useState(userProfile.email || "");
	
	const [avatarImage, setAvatarImage] = useState(userProfile.avatarImage || null);
	const fileInputRef = useRef(null);

	if (!isOpen) return null;

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setAvatarImage(event.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		const newInitial = name ? name.trim().charAt(0).toUpperCase() : "U";
		setUserProfile({
			name: name.trim() || "User",
			email: email.trim(),
			avatar: newInitial,
			avatarImage: avatarImage
		});
		onClose();
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				{/* Modal Header */}
				<div className="modal-header">
					<h3>Profile Settings</h3>
					<button className="modal-close-btn" onClick={onClose}>
						<X size={18} />
					</button>
				</div>

				{/* Modal Body */}
				<div className="modal-body">
					{/* Avatar Selector */}
					<div className="profile-avatar-select-container">
						<div className="profile-avatar-preview">
							{avatarImage ? (
								<img src={avatarImage} alt="Profile" className="profile-avatar-img" />
							) : (
								<div className="profile-avatar-text-fallback">{name ? name.trim().charAt(0).toUpperCase() : "U"}</div>
							)}
							<button 
								className="avatar-edit-overlay-btn"
								onClick={() => fileInputRef.current?.click()}
								title="Change avatar image"
							>
								<Camera size={14} />
							</button>
						</div>
						<input 
							type="file" 
							ref={fileInputRef} 
							accept="image/*" 
							style={{ display: "none" }} 
							onChange={handleImageChange} 
						/>
						<p className="avatar-hint">Click camera to upload custom photo</p>
					</div>

					{/* Name input */}
					<div className="form-group">
						<label htmlFor="profile-name-input">Your Name</label>
						<input 
							type="text" 
							id="profile-name-input"
							className="modal-text-input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							maxLength={20}
						/>
					</div>

					{/* Email input */}
					<div className="form-group">
						<label htmlFor="profile-email-input">Your Email</label>
						<input 
							type="email" 
							id="profile-email-input"
							className="modal-text-input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
						/>
					</div>
				</div>

				{/* Modal Footer */}
				<div className="modal-footer">
					<button className="btn-secondary" onClick={onClose}>Cancel</button>
					<button className="btn-primary" onClick={handleSave}>Save Changes</button>
				</div>
			</div>
		</div>
	);
}
