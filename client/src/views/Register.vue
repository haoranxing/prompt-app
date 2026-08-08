<template>
  <div class="min-h-screen flex flex-col px-6 pt-16">
    <h1 class="text-3xl font-bold mb-2">创建账号</h1>
    <p class="text-gray-400 text-sm mb-10">填写手机号即可完成注册</p>

    <div class="space-y-4">
      <div>
        <label class="text-xs text-gray-500 mb-1 block">手机号</label>
        <input v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号" class="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-pink" />
      </div>
      <div>
        <label class="text-xs text-gray-500 mb-1 block">昵称</label>
        <input v-model="nickname" type="text" placeholder="给自己起个名字" class="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-pink" />
      </div>
      <div>
        <label class="text-xs text-gray-500 mb-1 block">密码</label>
        <input v-model="password" type="password" placeholder="设置至少6位密码" class="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-pink" />
      </div>
    </div>

    <button @click="submit" class="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple font-bold text-sm active:opacity-90">
      注册
    </button>

    <div class="mt-4 text-center text-xs text-gray-400">
      已有账号？<router-link to="/login" class="text-accent-pink">去登录</router-link>
    </div>

    <div v-if="error" class="mt-4 text-center text-xs text-red-400">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { register } from '@/api/auth';

const phone = ref('');
const nickname = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const user = useUserStore();

async function submit() {
  error.value = '';
  try {
    const res = await register({ phone: phone.value, nickname: nickname.value, password: password.value });
    user.setAuth(res.token, res.user);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  }
}
</script>
