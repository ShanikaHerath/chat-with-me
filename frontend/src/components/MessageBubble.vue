<template>
  <div :class="['message-row', message.role]">
    <div class="avatar" :class="message.role === 'assistant' ? 'assistant-avatar' : 'user-avatar'">
      {{ message.role === 'assistant' ? 'AI' : 'You' }}
    </div>
    <div class="bubble">
      <!-- Render newlines as paragraphs -->
      <p v-for="(line, idx) in contentLines" :key="idx" :class="{ empty: line === '' }">
        {{ line }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: { type: Object, required: true },
});

const contentLines = computed(() => props.message.content.split('\n'));
</script>

<style scoped>
.message-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 24px;
  line-height: 1.65;
  font-size: 0.97rem;
}

/* Alternate background for assistant rows */
.message-row.assistant {
  background: #444654;
}

.message-row.user {
  background: transparent;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

.assistant-avatar {
  background: #10a37f;
  color: white;
}

.user-avatar {
  background: #5436da;
  color: white;
}

.bubble {
  flex: 1;
  color: #ececec;
  max-width: 720px;
  word-break: break-word;
}

.bubble p {
  margin-bottom: 4px;
}

.bubble p.empty {
  height: 10px;
}

/* Wider layout cap */
@media (min-width: 900px) {
  .message-row {
    padding: 20px calc((100% - 768px) / 2);
  }
}
</style>
