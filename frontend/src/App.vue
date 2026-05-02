<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo-icon">💬</span>
        <span class="logo-text">Chat With Me</span>
      </div>
      <button class="new-chat-btn" @click="startNewChat">
        <span class="btn-icon">＋</span>
        New chat
      </button>
      <div class="chat-history">
        <p class="history-label">Today</p>
        <ul>
          <li
            v-for="(session, idx) in sessions"
            :key="idx"
            :class="['history-item', { active: idx === activeSession }]"
            @click="switchSession(idx)"
          >
            {{ session.title }}
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main chat area -->
    <main class="chat-main">
      <ChatWindow
        :messages="currentMessages"
        :loading="loading"
        @send="sendMessage"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ChatWindow from './components/ChatWindow.vue';
import axios from 'axios';

const sessions = ref([{ title: 'New conversation', messages: [] }]);
const activeSession = ref(0);
const loading = ref(false);

const currentMessages = computed(() => sessions.value[activeSession.value].messages);

function startNewChat() {
  sessions.value.push({ title: 'New conversation', messages: [] });
  activeSession.value = sessions.value.length - 1;
}

function switchSession(idx) {
  activeSession.value = idx;
}

async function sendMessage(text) {
  if (!text.trim() || loading.value) return;

  const session = sessions.value[activeSession.value];

  // Update session title from first user message
  if (session.messages.length === 0) {
    session.title = text.length > 30 ? text.slice(0, 30) + '…' : text;
  }

  session.messages.push({ role: 'user', content: text });
  loading.value = true;

  try {
    const { data } = await axios.post('/api/chat', {
      messages: session.messages.map(({ role, content }) => ({ role, content })),
    });
    session.messages.push(data.message);
  } catch (err) {
    const errorText =
      err.response?.data?.error || 'Something went wrong. Please try again.';
    session.messages.push({ role: 'assistant', content: `⚠️ ${errorText}` });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 260px;
  background: #202123;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  gap: 8px;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-weight: 700;
  font-size: 1.05rem;
  color: #ececec;
}

.logo-icon {
  font-size: 1.4rem;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid #4d4d4f;
  border-radius: 8px;
  color: #ececec;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s;
}

.new-chat-btn:hover {
  background: #2a2b32;
}

.btn-icon {
  font-size: 1.1rem;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
}

.history-label {
  font-size: 0.72rem;
  color: #8e8ea0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 12px 4px;
}

.history-item {
  list-style: none;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.87rem;
  color: #c5c5d2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.15s;
}

.history-item:hover,
.history-item.active {
  background: #2a2b32;
  color: #ececec;
}

/* ── Main ── */
.chat-main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Responsive: hide sidebar on small screens ── */
@media (max-width: 640px) {
  .sidebar {
    display: none;
  }
}
</style>
