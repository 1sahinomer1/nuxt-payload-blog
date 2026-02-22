<script setup lang="ts">
import { twitterShareUrl, copyToClipboard } from '~/utils/share'

const props = defineProps<{
  url: string
  title: string
}>()

const copied = ref(false)

async function copy() {
  const ok = await copyToClipboard(props.url)
  if (ok) {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="flex items-center gap-1">
    <a
      :href="twitterShareUrl(url, title)"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn"
      aria-label="Share on Twitter"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
    <button
      type="button"
      class="share-btn"
      :aria-label="copied ? 'Link copied' : 'Copy link'"
      @click="copy"
    >
      <svg v-if="copied" class="h-4 w-4 !text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.share-btn {
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 150ms ease;
}

.share-btn:hover {
  color: #111827;
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

:root.dark .share-btn {
  color: #9ca3af;
}

:root.dark .share-btn:hover {
  color: #f3f4f6;
  background-color: #1f2937;
}
</style>
