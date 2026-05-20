import { Image as ImageIcon, Mic, Send, X } from "lucide-react";

export default function InputPanel({
	input,
	setInput,
	attachedImage,
	setAttachedImage,
	isListening,
	isLoading,
	handleSubmit,
	handleVoiceListening,
	fileInputRef,
	textareaRef,
	handleFileSelect,
	handleKeyDown
}) {
	return (
		<div className="input-area-container">
			<div className="input-area-width">
				{/* Selected Image Preview */}
				{attachedImage && (
					<div className="image-preview-wrapper">
						<img src={attachedImage} alt="Preview" className="image-preview-thumbnail" />
						<button 
							className="remove-image-btn"
							onClick={() => setAttachedImage(null)}
							title="Remove image"
						>
							<X size={12} />
						</button>
					</div>
				)}

				{/* Input Pill Box */}
				<div className="input-pill-wrapper">
					{/* Hidden Input file selector */}
					<input 
						type="file"
						accept="image/*"
						ref={fileInputRef}
						style={{ display: "none" }}
						onChange={handleFileSelect}
					/>

					<textarea
						ref={textareaRef}
						className="chat-textarea"
						placeholder={`Ask Lakma...`}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={isLoading}
						rows={1}
					/>

					{/* Actions icons inside input wrapper */}
					<div className="input-actions">
						<button 
							className="input-action-btn"
							onClick={() => fileInputRef.current?.click()}
							title="Upload Image"
							disabled={isLoading}
						>
							<ImageIcon size={18} />
						</button>
						<button 
							className={`input-action-btn ${isListening ? "listening" : ""}`}
							onClick={handleVoiceListening}
							title={isListening ? "Listening..." : "Use Microphone"}
							disabled={isLoading}
						>
							<Mic size={18} />
						</button>
						<button 
							className={`send-message-btn ${input.trim() || attachedImage ? "active" : ""}`}
							onClick={() => handleSubmit()}
							title="Send Message"
							disabled={isLoading || (!input.trim() && !attachedImage)}
						>
							<Send size={18} />
						</button>
					</div>
				</div>

				{/* Disclaimer Text */}
				<p className="disclaimer-text">
					Lakma may display inaccurate info, including about people, so double-check its responses. Your privacy and Lakma Apps.
				</p>
			</div>
		</div>
	);
}
