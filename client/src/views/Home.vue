<template>
  <div class="px-4 pt-6 pb-4">
    <!-- Header -->
    <div class="bg-gradient-to-r from-dark-card to-dark-card-2 rounded-2xl p-5 mb-6 border border-dark-border">
      <h1 class="text-3xl font-bold mb-2">{{ config.app_name || '爱谱猫' }}</h1>
      <p class="text-gray-400 text-sm mb-3">{{ config.slogan || '海量精选提示词，AI 创作更简单' }}</p>
      <div class="inline-flex items-center gap-2 bg-black/30 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-mono">
        {{ config.platforms || 'Seedance, Midjourney, ChatGPT, Veo, Gemini & more' }}
      </div>
    </div>

    <!-- Trending -->
    <section class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold flex items-center gap-2"><span class="w-1 h-4 bg-accent-pink rounded"></span>趋势Prompts</h2>
        <span class="text-xs text-gray-400">更多 ></span>
      </div>
      <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <PromptCard v-for="p in home.trends" :key="p.id" :prompt="p" />
      </div>
    </section>

    <!-- Hot -->
    <section class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold flex items-center gap-2"><span class="w-1 h-4 bg-accent-green rounded"></span>热门Prompts</h2>
        <span class="text-xs text-gray-400">更多 ></span>
      </div>
      <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <PromptCard v-for="p in home.hot" :key="p.id" :prompt="p" />
      </div>
    </section>

    <!-- Latest -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold flex items-center gap-2"><span class="w-1 h-4 bg-accent-blue rounded"></span>最新Prompts</h2>
        <span class="text-xs text-gray-400">更多 ></span>
      </div>
      <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <PromptCard v-for="p in home.latest" :key="p.id" :prompt="p" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import PromptCard from '@/components/PromptCard.vue';
import { getHome } from '@/api/prompts';
import { getConfig } from '@/api/config';

const home = reactive({ trends: [], hot: [], latest: [] });
const config = reactive({
  app_name: '爱谱猫',
  slogan: '海量精选提示词，AI 创作更简单',
  platforms: 'Seedance, Midjourney, ChatGPT, Veo, Gemini & more',
  seo_title: '爱谱猫 - 提示词广场',
  seo_description: '爱谱猫提供海量精选 AI 提示词，覆盖 Seedance、Midjourney、ChatGPT、Veo、Gemini 等主流平台，让 AI 创作更简单。',
  seo_keywords: '提示词,AI 提示词,Prompt,Seedance,Midjourney,ChatGPT,Veo,Gemini'
});

function setSeoMeta() {
  if (config.seo_title) document.title = config.seo_title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', config.seo_description || '');
  else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = config.seo_description || '';
    document.head.appendChild(meta);
  }
  const kw = document.querySelector('meta[name="keywords"]');
  if (kw) kw.setAttribute('content', config.seo_keywords || '');
  else {
    const meta = document.createElement('meta');
    meta.name = 'keywords';
    meta.content = config.seo_keywords || '';
    document.head.appendChild(meta);
  }
}

onMounted(async () => {
  try {
    const [data, cfg] = await Promise.all([getHome(), getConfig()]);
    Object.assign(home, data);
    if (cfg) Object.assign(config, cfg);
    setSeoMeta();
  } catch (e) {
    console.error(e);
  }
});
</script>
