<template>
  <div class="px-4 pt-4 pb-4">
    <div class="flex items-center gap-3 mb-5">
      <button @click="$router.back()" class="text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-lg font-bold">我的收藏</h1>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <PromptCard v-for="p in favorites" :key="p.id" :prompt="p" />
    </div>

    <div v-if="favorites.length === 0" class="text-center text-gray-500 py-20">暂无收藏</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PromptCard from '@/components/PromptCard.vue';
import { getFavorites } from '@/api/favorites';

const favorites = ref([]);

onMounted(async () => {
  try {
    favorites.value = await getFavorites();
  } catch (e) {
    console.error(e);
  }
});
</script>
