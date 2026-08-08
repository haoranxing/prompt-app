<template>
  <div class="flex-shrink-0 w-40 bg-dark-card rounded-xl overflow-hidden border border-dark-border" @click="goDetail">
    <div class="relative h-48 bg-gray-800">
      <img v-if="prompt.image" :src="getImageUrl(prompt.image)" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-xs">无封面</div>
      <div class="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">{{ prompt.platform || 'Seedream' }}</div>
      <div v-if="isVideo" class="absolute inset-0 flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
          <svg class="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    </div>
    <div class="p-2.5">
      <h3 class="text-sm font-medium line-clamp-2 leading-tight mb-2">{{ prompt.title }}</h3>
      <div class="flex items-center justify-between">
        <span class="text-[10px] text-gray-400">@{{ prompt.author_name || '官方精选' }}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded border" :class="prompt.price_type === 'vip' ? 'border-accent-pink text-accent-pink' : 'border-accent-green text-accent-green'">
          {{ prompt.price_type === 'vip' ? 'VIP' : '免费' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({ prompt: Object });
const router = useRouter();

const isVideo = computed(() => ['Seedance', 'Veo'].includes(props.prompt.platform));

function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return url;
}

function goDetail() {
  router.push(`/prompt/${props.prompt.id}`);
}
</script>
