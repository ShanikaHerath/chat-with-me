import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Compass, PenTool, Code2, Lightbulb } from "lucide-react";
import "./App.css";

// Import modular sub-components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import MessageList from "./components/MessageList";
import InputPanel from "./components/InputPanel";
import ProfileModal from "./components/ProfileModal";

export default function App() {
	// Sidebar State
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setSidebarOpen(false);
			} else {
				setSidebarOpen(true);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Theme State ("dark" | "light")
	const [theme, setTheme] = useState("dark");

	// User Profile State
	const [userProfile, setUserProfile] = useState({
		name: "Shani",
		email: "shani@example.com",
		avatar: "S",
		avatarImage: null
	});
	const [profileModalOpen, setProfileModalOpen] = useState(false);

	// Model Selection dropdown state
	const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState({
		id: "core",
		name: "Lakma Core",
		desc: "Great for fast, everyday responses"
	});

	const models = [
		{ id: "core", name: "Lakma Core", desc: "Great for fast, everyday responses" },
		{ id: "pro", name: "Lakma Pro", desc: "Complex reasoning and coding tasks" },
		{ id: "elite", name: "Lakma Elite", desc: "Our most capable intelligence model" }
	];

	// Conversations list state
	const [conversations, setConversations] = useState([
		{
			id: "welcome-chat",
			title: "Welcome to Lakma",
			messages: [
				{
					id: "initial-ai",
					type: "ai",
					content: `Hi there! I am Lakma, your intelligent chat assistant.

You can manage chats, switch models, upload images, or use voice dictation and speech tools.

How can I help you today?`
				}
			]
		}
	]);
	const [activeChatId, setActiveChatId] = useState("welcome-chat");

	// Input bar states
	const [input, setInput] = useState("");
	const [attachedImage, setAttachedImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [copiedMessageId, setCopiedMessageId] = useState(null);
	const [likedMessages, setLikedMessages] = useState({});
	const [dislikedMessages, setDislikedMessages] = useState({});

	// DOM Refs
	const chatScrollerRef = useRef(null);
	const textareaRef = useRef(null);
	const fileInputRef = useRef(null);

	// Welcome suggestion cards
	const suggestions = [
		{
			text: "Explain quantum computing in simple terms",
			icon: <Compass size={20} />,
			prompt: "Can you explain quantum computing in simple terms, using an analogy suitable for high school students?"
		},
		{
			text: "Write a short story about a time traveler's mistake",
			icon: <PenTool size={20} />,
			prompt: "Draft a short, engaging story about a time traveler who makes a minor, seemingly harmless mistake in the year 1920, resulting in unexpected consequences in the present day."
		},
		{
			text: "Help me debug a React useEffect loop",
			icon: <Code2 size={20} />,
			prompt: "Can you show me why a React useEffect hook might loop infinitely, and how to fix it with dependency arrays? Give a code example."
		},
		{
			text: "Suggest brainstorming topics for a tech vlog",
			icon: <Lightbulb size={20} />,
			prompt: "Help me brainstorm 5 unique topics for a new tech YouTube vlog series focusing on smart home automation and futuristic gadgets."
		}
	];

	// Active conversation messages selector
	const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];
	const messages = activeChat ? activeChat.messages : [];

	// Automatically load and persist active chat scroll
	useEffect(() => {
		if (chatScrollerRef.current) {
			chatScrollerRef.current.scrollTop = chatScrollerRef.current.scrollHeight;
		}
	}, [messages, isLoading]);

	// Auto-resize input textarea to fit text height
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	// Initialize theme on start
	useEffect(() => {
		const root = document.documentElement;
		if (theme === "light") {
			root.classList.add("light-theme");
		} else {
			root.classList.remove("light-theme");
		}
	}, [theme]);

	// Create random identifier
	const randomID = () => {
		return Math.random().toString(36).substring(2, 10);
	};

	// Create a new empty conversation
	const handleNewChat = () => {
		const pruned = conversations.filter(c => c.messages.length > 0);
		const newId = `chat-${randomID()}`;
		const newConv = {
			id: newId,
			title: "New chat",
			messages: []
		};
		setConversations([newConv, ...pruned]);
		setActiveChatId(newId);
		setInput("");
		setAttachedImage(null);
		if (window.innerWidth <= 768) {
			setSidebarOpen(false); // close sidebar on mobile
		}
	};

	// Switch active conversation
	const handleSwitchChat = (id) => {
		setConversations(prev => prev.filter(c => c.id === id || c.messages.length > 0));
		setActiveChatId(id);
		setInput("");
		setAttachedImage(null);
		if (window.innerWidth <= 768) {
			setSidebarOpen(false);
		}
	};

	// Delete a conversation
	const handleDeleteChat = (id, e) => {
		e.stopPropagation();
		const updated = conversations.filter(c => c.id !== id);
		setConversations(updated);

		if (activeChatId === id) {
			if (updated.length > 0) {
				setActiveChatId(updated[0].id);
			} else {
				// Recreate empty welcome chat if all deleted
				const welcomeId = "welcome-chat";
				setConversations([
					{
						id: welcomeId,
						title: "New chat",
						messages: []
					}
				]);
				setActiveChatId(welcomeId);
			}
		}
	};

	// Rename a conversation
	const handleRenameChat = (id, newTitle) => {
		setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
	};

	// Copy to clipboard
	const handleCopyText = (text, messageId) => {
		navigator.clipboard.writeText(text);
		setCopiedMessageId(messageId);
		setTimeout(() => setCopiedMessageId(null), 2000);
	};

	// Handle Like / Dislike toggles
	const handleLike = (id) => {
		setLikedMessages(prev => ({ ...prev, [id]: !prev[id] }));
		setDislikedMessages(prev => ({ ...prev, [id]: false }));
	};

	const handleDislike = (id) => {
		setDislikedMessages(prev => ({ ...prev, [id]: !prev[id] }));
		setLikedMessages(prev => ({ ...prev, [id]: false }));
	};

	// Text-to-speech read out
	const handleSpeechRead = (text) => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel(); // stop previous
			const cleanText = text.replace(/[*#`_\-]/g, ""); // remove markdown noise
			const utterance = new SpeechSynthesisUtterance(cleanText);
			window.speechSynthesis.speak(utterance);
		} else {
			alert("Your browser does not support Speech Synthesis.");
		}
	};

	// File selection handler
	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setAttachedImage(event.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Emulated Speech Listening / Voice typing
	const handleVoiceListening = () => {
		if (isListening) {
			setIsListening(false);
			return;
		}

		setIsListening(true);
		let baseText = "Hello Lakma, I am speaking this prompt using the mic, ";
		let count = 0;
		setInput("");

		const interval = setInterval(() => {
			count += 1;
			if (count === 1) setInput(baseText + "testing the smart dictation feature...");
			if (count === 2) setInput(baseText + "testing the smart dictation feature... and creating a new request.");
			if (count === 3) {
				setIsListening(false);
				clearInterval(interval);
			}
		}, 900);
	};

	// Send message handler
	const handleSubmit = (overrideText = null) => {
		const queryText = overrideText || input;
		if (!queryText.trim() && !attachedImage) return;

		// Add new message to active conversation
		const userMessage = {
			id: `msg-${randomID()}`,
			type: "user",
			content: queryText,
			image: attachedImage
		};

		const currentChatId = activeChatId;
		const updatedMessages = [...messages, userMessage];

		// Auto-title update for "New chat" placeholder
		let updatedTitle = activeChat.title;
		if (activeChat.title === "New chat" && messages.length === 0) {
			updatedTitle = queryText.length > 22 ? queryText.slice(0, 20) + "..." : queryText;
		}

		// Update active chat with user query
		setConversations(prev => prev.map(c => {
			if (c.id === currentChatId) {
				return {
					...c,
					title: updatedTitle,
					messages: updatedMessages
				};
			}
			return c;
		}));

		setInput("");
		setAttachedImage(null);
		setIsLoading(true);

		// Generate dynamic responses
		setTimeout(() => {
			let aiResponse = "";
			const prompt = queryText.toLowerCase();

			if (prompt.includes("quantum")) {
				aiResponse = `### Quantum Computing Analogy 🌀

Think of a normal computer like a **light switch** that can only be either **OFF (0)** or **ON (1)**. Every calculation is just a series of switches flipping.

A quantum computer is more like a **spinning coin**. While it's spinning, it is a blur of both heads and tails at the same time. This is called **Superposition**.
Because it can explore many combinations simultaneously, it can solve massive calculations in seconds that would take normal supercomputers thousands of years!

#### Key Concepts:
1. **Qubits:** Unlike standard bits (0 or 1), qubits hold multiple states simultaneously.
2. **Entanglement:** Qubits can link together instantaneously across distance.
3. **Interference:** Boosting right answers and canceling wrong ones to find the final result.`;
			} else if (prompt.includes("time traveler")) {
				aiResponse = `### The Butterly Effect in 1920 🕰️

Edward stepped out of the temporal pod, the cool London morning air filling his lungs. It was September 12, 1920. 
His only mission was to observe. But as he adjusted his tweed coat, a brass button broke off, rolled down the pavement, and fell into a storm drain. Edward shrugged, returned to the pod, and traveled back to 2026.

When the pod door slid open, London looked different. Hovercars didn't exist. Instead, the streets were filled with steam-powered carriages and elaborate clockwork traffic signals. 

A newsboy ran past: *"Read all about it! Clockwork Empire celebrates 100 years of Mechanical Harmony!"*

Edward realized that the brass button had blocked a water pipe, causing a small flood in a basement workshop where an engineer named William had been developing electronic circuits. Frustrated by the water damage, William abandoned electronics and designed mechanical clockwork computation instead. Edward’s tiny button had completely derailed the age of digital computing!`;
			} else if (prompt.includes("useeffect") || prompt.includes("react")) {
				aiResponse = `### React useEffect Infinite Loops 💻

An infinite loop in \`useEffect\` happens when you update a state inside the hook, and that state is also listed in the hook's dependency array. 

#### The Problem Code:
\`\`\`javascript
// ❌ This triggers an infinite loop!
useEffect(() => {
  setCount(count + 1); // Updates count state
}, [count]); // Triggered every time count changes
\`\`\`

#### The Fix:
You must remove the state updater dependency, or use functional state updates if you only want to run it once:

\`\`\`javascript
// ✅ Correct approach (Run once on mount)
useEffect(() => {
  // Fetch data or set state safely
  console.log("Component mounted");
}, []); // Empty dependencies array
\`\`\`

Or use functional state updates to avoid adding the state itself as a dependency:
\`\`\`javascript
// ✅ Safe incrementing count
useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1); // Reads prev state safely
  }, 1000);
  return () => clearInterval(interval);
}, []); // No need to depend on count!
\`\`\`
`;
			} else if (attachedImage) {
				aiResponse = `I've analyzed the image you uploaded! 📸

Based on my visual processing algorithms, this image represents high-quality visual data. 
In a production integration, I would extract:
* **Color Palette:** Dominated by the gradients and tones present in your image file.
* **Objects / Shapes:** Detected shapes, text outlines, and pixel composition.
* **Suggested Context:** This image context fits directly with your prompt: *"${queryText || "Analyze this image"}"*.

Let me know if you would like me to perform OCR text extraction or search for similar color layouts!`;
			} else {
				aiResponse = `Here is a custom response from **${selectedModel.name}**! ⚡

You asked: *"${queryText}"*

I can help you with multiple tasks:
* **Research:** Breaking down complex academic papers or news.
* **Coding:** Generating HTML, CSS, JavaScript, Python, or SQL scripts.
* **Creative Writing:** Drafting essays, follow-ups, or marketing copy.

Feel free to refine your question or ask me to perform tasks like listing action items or converting code blocks!`;
			}

			const aiMessage = {
				id: `msg-${randomID()}`,
				type: "ai",
				content: aiResponse
			};

			setConversations(prev => prev.map(c => {
				if (c.id === currentChatId) {
					return {
						...c,
						messages: [...updatedMessages, aiMessage]
					};
				}
				return c;
			}));
			setIsLoading(false);
		}, 1800);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="lakma-container">
			{/* Left Sidebar Component */}
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				conversations={conversations.filter(c => c.messages.length > 0)}
				activeChatId={activeChatId}
				handleSwitchChat={handleSwitchChat}
				handleDeleteChat={handleDeleteChat}
				handleNewChat={handleNewChat}
				handleProfileClick={() => setProfileModalOpen(true)}
				handleRenameChat={handleRenameChat}
			/>

			{/* Main Content Pane */}
			<main className="lakma-main">
				{/* Header Component */}
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					selectedModel={selectedModel}
					setSelectedModel={setSelectedModel}
					theme={theme}
					setTheme={setTheme}
					models={models}
					modelDropdownOpen={modelDropdownOpen}
					setModelDropdownOpen={setModelDropdownOpen}
					userProfile={userProfile}
					handleProfileClick={() => setProfileModalOpen(true)}
					activeChatTitle={activeChat ? activeChat.title : "New chat"}
				/>

				{/* Chat Display Body / Welcome Screen */}
				{messages.length === 0 ? (
					<div className="chat-body-container" ref={chatScrollerRef}>
						<div className="chat-content-width">
							<WelcomeScreen
								suggestions={suggestions}
								handleSubmit={handleSubmit}
								userProfile={userProfile}
							/>
						</div>
					</div>
				) : (
					<MessageList
						messages={messages}
						isLoading={isLoading}
						chatScrollerRef={chatScrollerRef}
						copiedMessageId={copiedMessageId}
						likedMessages={likedMessages}
						dislikedMessages={dislikedMessages}
						handleSpeechRead={handleSpeechRead}
						handleCopyText={handleCopyText}
						handleLike={handleLike}
						handleDislike={handleDislike}
					/>
				)}

				{/* Fixed Bottom Input Area Component */}
				<InputPanel
					input={input}
					setInput={setInput}
					attachedImage={attachedImage}
					setAttachedImage={setAttachedImage}
					isListening={isListening}
					isLoading={isLoading}
					handleSubmit={handleSubmit}
					handleVoiceListening={handleVoiceListening}
					fileInputRef={fileInputRef}
					textareaRef={textareaRef}
					handleFileSelect={handleFileSelect}
					handleKeyDown={handleKeyDown}
				/>
			</main>

			{/* Profile Settings Modal */}
			<ProfileModal
				isOpen={profileModalOpen}
				onClose={() => setProfileModalOpen(false)}
				userProfile={userProfile}
				setUserProfile={setUserProfile}
			/>
		</div>
	);
}
