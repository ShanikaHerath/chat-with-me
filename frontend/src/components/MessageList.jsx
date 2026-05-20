import Markdown from "react-markdown";
import { Volume2, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

const AIChatText = {
	p({ ...rest }) {
		return <p className="ai-p" {...rest} />;
	},
	ul({ ...rest }) {
		return <ul className="ai-ul" {...rest} />;
	},
	ol({ ...rest }) {
		return <ol className="ai-ol" {...rest} />;
	},
	code({ className, children, ...rest }) {
		return <code className={className} {...rest}>{children}</code>;
	}
};

export default function MessageList({
	messages,
	isLoading,
	chatScrollerRef,
	copiedMessageId,
	likedMessages,
	dislikedMessages,
	handleSpeechRead,
	handleCopyText,
	handleLike,
	handleDislike
}) {
	return (
		<div className="chat-body-container" ref={chatScrollerRef}>
			<div className="chat-content-width">
				<div className="messages-list">
					{messages.map((message) => {
						const isAi = message.type === "ai";
						return (
							<div key={message.id} className={`message-wrapper ${isAi ? "bot" : "user"}`}>
								<div className="message-bubble">
									{/* Render user image attachment if present */}
									{!isAi && message.image && (
										<img 
											src={message.image} 
											alt="Attached context" 
											className="message-attached-image" 
										/>
									)}

									{/* Message Content */}
									<div className="message-content">
										{isAi ? (
											<div className="ai-response">
												<Markdown components={AIChatText}>
													{message.content}
												</Markdown>
											</div>
										) : (
											message.content
										)}
									</div>

									{/* AI Actions Footer Toolbar */}
									{isAi && (
										<div className="ai-action-toolbar">
											<button 
												className="ai-action-btn"
												onClick={() => handleSpeechRead(message.content)}
												title="Listen to response"
											>
												<Volume2 size={16} />
											</button>
											<button 
												className={`ai-action-btn ${copiedMessageId === message.id ? "active" : ""}`}
												onClick={() => handleCopyText(message.content, message.id)}
												title="Copy to clipboard"
											>
												<Copy size={16} />
											</button>
											<button 
												className={`ai-action-btn ${likedMessages[message.id] ? "active" : ""}`}
												onClick={() => handleLike(message.id)}
												title="Good response"
											>
												<ThumbsUp size={16} />
											</button>
											<button 
												className={`ai-action-btn ${dislikedMessages[message.id] ? "active" : ""}`}
												onClick={() => handleDislike(message.id)}
												title="Bad response"
											>
												<ThumbsDown size={16} />
											</button>
										</div>
									)}
								</div>
							</div>
						);
					})}

					{/* Loading Animation Indicator */}
					{isLoading && (
						<div className="message-wrapper bot">
							<div className="message-bubble loading">
								<div className="dot"></div>
								<div className="dot"></div>
								<div className="dot"></div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
