<template>
  <div v-if="prompt" class="min-h-screen bg-dark-bg pb-28">
    <!-- Top Image -->
    <div class="relative bg-dark-card-2 min-h-[45vh] flex items-center justify-center">
      <img v-if="prompt.image" :src="prompt.image" class="w-full h-full object-contain max-h-[55vh]" />
      <div class="absolute top-4 left-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur">{{ prompt.platform || 'Seedream' }}</div>
      <button @click="$router.back()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <div v-if="prompt.price_type === 'vip'" class="absolute top-4 left-1/2 -translate-x-1/2 bg-accent-pink/90 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur">VIP 专享</div>
    </div>

    <div class="px-4 -mt-5 relative z-10">
      <div class="bg-dark-card rounded-2xl p-4 border border-dark-border">
        <!-- Title Row -->
        <div class="flex items-start gap-3 mb-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/30">提示词</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-dark-card-2 text-gray-400 border border-dark-border">{{ prompt.category_name || '未分类' }}</span>
              <span v-if="prompt.price_type === 'vip'" class="text-[10px] px-1.5 py-0.5 rounded bg-accent-pink/20 text-accent-pink border border-accent-pink/30">VIP</span>
            </div>
            <h1 class="text-xl font-bold leading-tight">{{ prompt.title }}</h1>
          </div>
          <button @click="toggleFavorite" class="w-10 h-10 rounded-full bg-dark-card-2 border border-dark-border flex items-center justify-center active:bg-white/5 flex-shrink-0" :class="isFav ? 'text-accent-pink' : 'text-gray-400'">
            <svg class="w-5 h-5" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>
        </div>

        <!-- Meta Row -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              4.9
            </span>
            <span>使用 {{ prompt.view_count || 0 }}</span>
            <span>@{{ prompt.author_name || '官方精选' }}</span>
          </div>
          <span class="text-xs px-2 py-0.5 rounded border" :class="prompt.price_type === 'vip' ? 'border-accent-pink text-accent-pink' : 'border-accent-green text-accent-green'">
            {{ prompt.price_type === 'vip' ? 'VIP' : '免费' }}
          </span>
        </div>

        <!-- Value Prop -->
        <div class="bg-dark-card-2 rounded-xl p-3 mb-4 border border-dark-border/50">
          <div class="text-xs text-accent-green mb-2 flex items-center gap-1">✨ 获取此提示词能为您带来什么？</div>
          <p class="text-sm text-gray-300 leading-relaxed">{{ prompt.description || '暂无描述' }}</p>
        </div>

        <!-- Core Prompt -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-bold">提示词核心精准</div>
            <button v-if="!isVipLocked" @click="showEn = !showEn" class="text-[10px] px-2 py-1 rounded-full border border-dark-border text-gray-400 flex items-center gap-1">
              <span :class="showEn ? 'text-gray-400' : 'text-accent-pink font-bold'">中</span>
              <span>/</span>
              <span :class="showEn ? 'text-accent-pink font-bold' : 'text-gray-400'">EN</span>
            </button>
          </div>

          <div v-if="isVipLocked" class="bg-dark-card-2 rounded-xl p-6 text-center border border-accent-pink/30">
            <div class="text-3xl mb-2">🔒</div>
            <div class="text-sm font-bold text-accent-pink mb-1">VIP 专享内容</div>
            <p class="text-xs text-gray-400 leading-relaxed mb-3">该提示词为高级会员专享，开通 VIP 即可解锁全站提示词。</p>
            <button @click="goVip" class="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-xs font-bold">开通 VIP</button>
          </div>
          <div v-else class="bg-dark-card-2 rounded-xl p-3 text-sm text-gray-200 leading-relaxed whitespace-pre-line border border-dark-border/50 min-h-[80px]">
            {{ showEn ? (prompt.content_en || '暂无英文版') : prompt.content }}
          </div>
        </div>

        <!-- Optimization Tips -->
        <div v-if="prompt.tips && !isVipLocked" class="mb-4">
          <div class="text-sm font-bold mb-2 flex items-center gap-2">
            <span class="text-yellow-400">💡</span> 使用建议 & 场景调校
          </div>
          <div class="bg-dark-card-2 rounded-xl p-3 text-sm text-gray-300 leading-relaxed whitespace-pre-line border border-dark-border/50">
            {{ prompt.tips }}
          </div>
        </div>

        <!-- Parameters -->
        <div class="grid grid-cols-2 gap-3 text-xs mb-5">
          <div class="bg-dark-card-2 rounded-lg p-3 border border-dark-border/50">
            <div class="text-gray-500 mb-1">模型/平台</div>
            <div class="font-medium">{{ prompt.platform || 'Seedream' }}</div>
          </div>
          <div class="bg-dark-card-2 rounded-lg p-3 border border-dark-border/50">
            <div class="text-gray-500 mb-1">模型环境</div>
            <div class="font-medium">文生图</div>
          </div>
        </div>

        <!-- Copy Button -->
        <button v-if="!isVipLocked" @click="copyContent" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold flex items-center justify-center gap-2 active:opacity-90 shadow-lg shadow-accent-pink/20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          一键复制
        </button>
        <button v-else @click="goVip" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold active:opacity-90 shadow-lg shadow-accent-pink/20">
          开通 VIP 解锁复制
        </button>
      </div>
    </div>

    <div v-if="toast" class="fixed top-20 left-1/2 -translate-x-1/2 bg-accent-green text-black text-sm px-4 py-2 rounded-full shadow-lg z-50">{{ toast }}</div>
  </div>

  <div v-else class="text-center text-gray-500 py-20">加载中...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPrompt } from '@/api/prompts';
import { addFavorite, removeFavorite } from '@/api/favorites';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const user = useUserStore();
const prompt = ref(null);
const isFav = ref(false);
const toast = ref('');
const showEn = ref(false);

const isVipLocked = computed(() => prompt.value && prompt.value.price_type === 'vip' && !user.isVip);

onMounted(async () => {
  try {
    prompt.value = await getPrompt(route.params.id);
  } catch (e) {
    console.error(e);
  }
});

function copyContent() {
  if (!user.isVip) {
    toast.value = '请开通VIP功能，解锁全站提示词';
    setTimeout(() => toast.value = '', 2000);
    return;
  }
  const text = showEn.value && prompt.value.content_en ? prompt.value.content_en : prompt.value.content;
  navigator.clipboard.writeText(text).then(() => {
    toast.value = '已复制到剪贴板';
    setTimeout(() => toast.value = '', 2000);
  });
}

function goVip() {
  if (!user.isLogin) {
    toast.value = '请先登录';
    setTimeout(() => { toast.value = ''; router.push('/login'); }, 1500);
    return;
  }
  router.push('/profile');
}

async function toggleFavorite() {
  if (!user.isLogin) {
    toast.value = '请先登录';
    setTimeout(() => toast.value = '', 2000);
    return;
  }
  try {
    if (isFav.value) {
      await removeFavorite(prompt.value.id);
      isFav.value = false;
      toast.value = '已取消收藏';
    } else {
      await addFavorite(prompt.value.id);
      isFav.value = true;
      toast.value = '已收藏';
    }
    setTimeout(() => toast.value = '', 2000);
  } catch (e) {
    toast.value = e.message;
    setTimeout(() => toast.value = '', 2000);
  }
}
</script>
