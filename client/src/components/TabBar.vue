<template>
  <div class="fixed bottom-0 left-0 right-0 h-16 bg-dark-card/95 backdrop-blur border-t border-dark-border flex items-center justify-around z-50">
    <router-link to="/" class="flex flex-col items-center gap-1" :class="isActive('Home') ? 'text-accent-pink' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
      <span class="text-xs">热门</span>
    </router-link>
    <router-link to="/categories" class="flex flex-col items-center gap-1" :class="isActive('Categories') ? 'text-accent-pink' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
      <span class="text-xs">分类广场</span>
    </router-link>
    <router-link to="/profile" class="flex flex-col items-center gap-1" :class="isActive('Profile') ? 'text-accent-pink' : 'text-gray-400'">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      <span class="text-xs">我的</span>
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const isActive = (name) => route.name === name;
</script>
