<template>
  <div class="chat-window">
    <!-- Empty state -->
    <div v-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <h2>Chat With Me</h2>
      <p>Send a message to start chatting with the AI assistant.</p>
      <div class="suggestion-grid">
        <button
          v-for="s in suggestions"
          :key="s"
          class="suggestion-pill"
          @click="$emit('send', s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Message list -->
    <div v-else ref="messagesEl" class="messages-list">
      <MessageBubble
        v-for="(msg, idx) in messages"
        :key="idx"
        :message="msg"
      />

      <!-- Typing indicator -->
      <div v-if="loading" class="typing-row">
        <div class="avatar assistant-avatar">AI</div>
        <div class="typing-bubble">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- Input bar -->
    <MessageInput :loading="loading" @send="$emit('send', $event)" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import MessageBubble from './MessageBubble.vue';
import MessageInput from './MessageInput.vue';

const props = defineProps({
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});
defineEmits(['send']);

const messagesEl = ref(null);
const suggestions = [
  'Explain quantum computing in simple terms',
  'Write a short poem about autumn',
  'What are the best practices for Vue.js?',
  'Help me debug my JavaScript code',
];

// Auto-scroll to bottom when new messages arrive
watch(
  () => [props.messages.length, props.loading],
  async () => {
    await nextTick();
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  }
);
</script>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #343541;
}

/* Empty state */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 24px;
  gap: 12px;
  color: #ececec;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}

.empty-state h2 {
  font-size: 1.8rem;
  font-weight: 700;
}

.empty-state p {
  color: #8e8ea0;
  font-size: 0.95rem;
}

.suggestion-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
  max-width: 560px;
}

.suggestion-pill {
  padding: 10px 16px;
  background: #40414f;
  border: 1px solid #565869;
  border-radius: 12px;
  color: #c5c5d2;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.suggestion-pill:hover {
  background: #565869;
  color: #ececec;
}

/* Messages list */
.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
  scroll-behavior: smooth;
}

/* Typing indicator */
.typing-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 24px;
  background: #444654;
  max-width: 100%;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.assistant-avatar {
  background: #10a37f;
  color: white;
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 0;
}

.dot {
  width: 8px;
  height: 8px;
  background: #8e8ea0;
  border-radius: 50%;
  animation: bounce 1.2s ease-in-out infinite;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-6px); opacity: 1; }
}
</style>
