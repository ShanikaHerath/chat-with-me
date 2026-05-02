<template>
  <div class="input-bar">
    <div class="input-wrapper">
      <textarea
        ref="textareaEl"
        v-model="inputText"
        class="message-textarea"
        placeholder="Send a message…"
        rows="1"
        :disabled="loading"
        @keydown.enter.exact.prevent="submit"
        @input="autoResize"
      ></textarea>
      <button
        class="send-btn"
        :disabled="!inputText.trim() || loading"
        @click="submit"
        aria-label="Send message"
      >
        <svg v-if="!loading" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
        <span v-else class="spinner"></span>
      </button>
    </div>
    <p class="disclaimer">AI can make mistakes. Verify important information.</p>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

defineProps({
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(['send']);

const inputText = ref('');
const textareaEl = ref(null);

function submit() {
  const text = inputText.value.trim();
  if (!text) return;
  emit('send', text);
  inputText.value = '';
  nextTick(() => {
    if (textareaEl.value) {
      textareaEl.value.style.height = 'auto';
    }
  });
}

function autoResize() {
  const el = textareaEl.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}
</script>

<style scoped>
.input-bar {
  padding: 12px 16px 16px;
  background: #343541;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
  max-width: 768px;
  background: #40414f;
  border: 1px solid #565869;
  border-radius: 14px;
  padding: 10px 12px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #10a37f;
  box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.15);
}

.message-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ececec;
  font-size: 0.97rem;
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
}

.message-textarea::placeholder {
  color: #8e8ea0;
}

.message-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: #10a37f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, opacity 0.15s;
}

.send-btn:hover:not(:disabled) {
  background: #0d8c6c;
}

.send-btn:disabled {
  background: #565869;
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.disclaimer {
  font-size: 0.72rem;
  color: #565869;
  text-align: center;
}
</style>
