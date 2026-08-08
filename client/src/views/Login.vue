<template>
  <div class="min-h-screen flex flex-col px-6 pt-16">
    <h1 class="text-3xl font-bold mb-2">欢迎回来</h1>
    <p class="text-gray-400 text-sm mb-10">登录后收藏喜欢的提示词</p>

    <div class="space-y-4">
      <div>
        <label class="text-xs text-gray-500 mb-1 block">手机号</label>
        <input v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号" class="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-pink" />
      </div>
      <div>
        <label class="text-xs text-gray-500 mb-1 block">密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" class="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-pink" />
      </div>
    </div>

    <button @click="submit" class="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple font-bold text-sm active:opacity-90">
      登录
    </button>

    <div class="mt-4 text-center text-xs text-gray-400">
      还没有账号？<router-link to="/register" class="text-accent-pink">立即注册</router-link>
    </div>

    <div v-if="error" class="mt-4 text-center text-xs text-red-400">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { login } from '@/api/auth';

const phone = ref('');
const password = ref('');
const error = ref('');
const route = useRoute();
const router = useRouter();
const user = useUserStore();

async function submit() {
  error.value = '';
  try {
    const res = await login({ phone: phone.value, password: password.value });
    user.setAuth(res.token, res.user);
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  } catch (e) {
    error.value = e.message;
  }
}
</script>
