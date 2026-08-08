<template>
  <div class="px-4 pt-4 pb-4">
    <h1 class="text-center text-lg font-bold mb-5">分类广场</h1>

    <div v-for="cat in categories" :key="cat.id" class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold flex items-center gap-2"><span class="w-1 h-4 bg-accent-pink rounded"></span>{{ cat.name }}</h2>
        <span class="text-xs text-gray-400">更多 ></span>
      </div>
      <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <PromptCard v-for="p in cat.prompts" :key="p.id" :prompt="p" />
      </div>
    </div>

    <div v-if="categories.length === 0" class="text-center text-gray-500 py-20">加载中...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PromptCard from '@/components/PromptCard.vue';
import { getCategories } from '@/api/categories';
import { getPrompts } from '@/api/prompts';

const categories = ref([]);

onMounted(async () => {
  try {
    const cats = await getCategories();
    const list = await Promise.all(cats.map(async (c) => {
      const prompts = await getPrompts({ category_id: c.id, limit: 6 });
      return { ...c, prompts };
    }));
    categories.value = list;
  } catch (e) {
    console.error(e);
  }
});
</script>
