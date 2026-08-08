<template>
  <div class="min-h-screen bg-dark-bg pb-20">
    <router-view />
    <TabBar v-if="showTabBar" />
    <div v-if="copyToast" class="fixed top-20 left-1/2 -translate-x-1/2 bg-accent-pink text-white text-sm px-4 py-2 rounded-full shadow-lg z-[100]">
      {{ copyToast }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import TabBar from './components/TabBar.vue';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const user = useUserStore();
const showTabBar = computed(() => ['Home', 'Categories', 'Profile'].includes(route.name));
const copyToast = ref('');
let toastTimer = null;

function showCopyToast(msg) {
  copyToast.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { copyToast.value = ''; }, 2000);
}

function preventContextMenu(e) {
  e.preventDefault();
}

function onCopy(e) {
  // 仅对未开通 VIP 的会员拦截复制，提示开通会员
  if (!user.isVip) {
    e.preventDefault();
    showCopyToast('请开通VIP功能，解锁全站提示词');
  }
}

onMounted(() => {
  document.addEventListener('contextmenu', preventContextMenu);
  document.addEventListener('copy', onCopy);
});

onUnmounted(() => {
  document.removeEventListener('contextmenu', preventContextMenu);
  document.removeEventListener('copy', onCopy);
});
</script>
