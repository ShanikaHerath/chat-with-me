import React, { useState } from "react";
import { Menu, Plus, MessageSquare, Trash2, HelpCircle, User, Edit2 } from "lucide-react";

export default function Sidebar({
	sidebarOpen,
	setSidebarOpen,
	conversations,
	activeChatId,
	handleSwitchChat,
	handleDeleteChat,
	handleNewChat,
	handleProfileClick,
	handleRenameChat
}) {
	const [editingChatId, setEditingChatId] = useState(null);
	const [editingTitle, setEditingTitle] = useState("");

	const startEditing = (chat, e) => {
		e.stopPropagation();
		setEditingChatId(chat.id);
		setEditingTitle(chat.title);
	};

	const saveRename = (id) => {
		if (editingTitle.trim()) {
			handleRenameChat(id, editingTitle.trim());
		}
		setEditingChatId(null);
	};

	const handleKeyPress = (e, id) => {
		if (e.key === "Enter") {
			saveRename(id);
		} else if (e.key === "Escape") {
			setEditingChatId(null);
		}
	};

	return (
		<aside className={`lakma-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
			{/* Sidebar Menu Toggle */}
			<button 
				className="sidebar-menu-btn" 
				onClick={() => setSidebarOpen(!sidebarOpen)}
				aria-label="Toggle Sidebar"
			>
				<Menu size={20} />
			</button>

			{/* New Chat Button */}
			<button className="new-chat-btn" onClick={handleNewChat}>
				<Plus size={20} />
				<span>New chat</span>
			</button>

			{/* Recent Chats Section */}
			<div className="sidebar-recent-section">
				{sidebarOpen && <div className="recent-title">Recent</div>}
				<ul className="recent-list">
					{conversations.map((chat) => (
						<li 
							key={chat.id} 
							className={`recent-item ${chat.id === activeChatId ? "active" : ""}`}
							onClick={() => handleSwitchChat(chat.id)}
						>
							<div className="recent-item-info" style={{ flex: 1 }}>
								<MessageSquare size={16} />
								{editingChatId === chat.id ? (
									<input
										type="text"
										className="recent-edit-input"
										value={editingTitle}
										onChange={(e) => setEditingTitle(e.target.value)}
										onBlur={() => saveRename(chat.id)}
										onKeyDown={(e) => handleKeyPress(e, chat.id)}
										autoFocus
										onClick={(e) => e.stopPropagation()}
									/>
								) : (
									<span 
										className="recent-text"
										onDoubleClick={(e) => startEditing(chat, e)}
										title="Double-click to rename"
									>
										{chat.title}
									</span>
								)}
							</div>
							
							{editingChatId !== chat.id && (
								<div className="recent-item-actions">
									<button 
										className="rename-chat-btn" 
										onClick={(e) => startEditing(chat, e)}
										title="Rename chat"
									>
										<Edit2 size={13} />
									</button>
									<button 
										className="delete-chat-btn" 
										onClick={(e) => handleDeleteChat(chat.id, e)}
										aria-label="Delete chat"
										title="Delete chat"
									>
										<Trash2 size={13} />
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>

			{/* Sidebar Footer */}
			<div className="sidebar-footer">
				<div className="footer-item" onClick={handleNewChat}>
					<Plus size={16} />
					<span>New Chat</span>
				</div>
				<div className="footer-item" onClick={() => alert("Lakma Help center & documentation")}>
					<HelpCircle size={16} />
					<span>Help</span>
				</div>
				<div className="footer-item" onClick={handleProfileClick}>
					<User size={16} />
					<span>Profile</span>
				</div>
			</div>
		</aside>
	);
}
