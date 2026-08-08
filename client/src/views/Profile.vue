<template>
  <div class="px-4 pt-4 pb-4">
    <h1 class="text-center text-lg font-bold mb-5">我的</h1>

    <!-- User Card -->
    <div class="bg-dark-card rounded-2xl p-4 mb-4 border border-dark-border flex items-center gap-4">
      <div class="w-14 h-14 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-xl font-bold">
        {{ avatarText }}
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="font-bold text-lg">{{ user.user?.nickname || '未登录' }}</span>
          <span v-if="user.isAdmin" class="text-[10px] bg-accent-blue/20 text-accent-blue px-1.5 py-0.5 rounded">{{ user.user?.role === 'superadmin' ? '高级管理员' : '管理员' }}</span>
          <span v-else-if="user.isVip" class="text-[10px] bg-accent-pink/20 text-accent-pink px-1.5 py-0.5 rounded border border-accent-pink/30">高级会员</span>
          <span v-else class="text-[10px] bg-dark-card-2 text-gray-400 px-1.5 py-0.5 rounded border border-dark-border">普通会员</span>
        </div>
        <div class="text-xs text-gray-400 mt-1">{{ user.user?.phone || '点击登录体验完整功能' }}</div>
      </div>
      <div v-if="user.isLogin" class="text-xs text-accent-green flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-accent-green"></span>在线</div>
    </div>

    <!-- Member Center -->
    <div v-if="user.isLogin" class="bg-dark-card rounded-2xl p-4 mb-4 border border-dark-border">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-bold flex items-center gap-2"><span class="w-1 h-4 bg-accent-pink rounded"></span>会员中心</h2>
        <span class="text-xs" :class="user.isVip ? 'text-accent-pink' : 'text-gray-400'">{{ user.isVip ? '高级会员 VIP' : '普通会员' }}</span>
      </div>

      <!-- Edit nickname -->
      <div class="flex items-center justify-between py-2 border-b border-dark-border">
        <span class="text-sm text-gray-300">我的昵称</span>
        <div class="flex items-center gap-2">
          <input v-if="editingName" v-model="newName" class="bg-dark-card-2 border border-dark-border rounded-lg px-2 py-1 text-sm w-32 outline-none focus:border-accent-pink" @keyup.enter="saveName" />
          <span v-else class="text-sm">{{ user.user?.nickname }}</span>
          <button v-if="editingName" @click="saveName" class="text-xs text-accent-green">保存</button>
          <button v-else @click="startEditName" class="text-xs text-accent-blue">修改</button>
        </div>
      </div>

      <!-- VIP status / redeem -->
      <div v-if="!user.isVip" class="py-3 border-b border-dark-border">
        <div class="text-sm text-gray-300 mb-2">VIP 会员兑换</div>
        <div class="flex gap-2">
          <input v-model="codeInput" placeholder="请输入激活码" class="flex-1 bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
          <button @click="doRedeem" class="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold whitespace-nowrap active:opacity-90">兑换</button>
        </div>
      </div>

      <!-- Contact admin -->
      <div class="pt-3">
        <div class="text-sm text-gray-300 mb-2">联系管理员开通 VIP</div>
        <div class="flex items-center justify-between bg-dark-card-2 rounded-xl px-3 py-2 border border-dark-border">
          <span class="text-sm text-gray-400">微信号：<span class="text-gray-200">{{ config.admin_wechat || 'fx829999' }}</span></span>
          <button @click="copyWechat" class="text-xs px-2 py-1 rounded bg-accent-blue/20 text-accent-blue">复制</button>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <div class="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
      <router-link to="/favorites" class="flex items-center justify-between px-4 py-4 border-b border-dark-border active:bg-white/5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-accent-pink" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-sm">我的收藏</span>
        </div>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </router-link>

      <router-link v-if="user.isAdmin" to="/admin" class="flex items-center justify-between px-4 py-4 border-b border-dark-border active:bg-white/5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-sm">管理后台</span>
        </div>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </router-link>

      <div class="flex items-center justify-between px-4 py-4 border-b border-dark-border active:bg-white/5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span class="text-sm">我的订单</span>
        </div>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </div>

      <div class="flex items-center justify-between px-4 py-4 border-b border-dark-border active:bg-white/5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          <span class="text-sm">用户反馈</span>
        </div>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </div>

      <div class="flex items-center justify-between px-4 py-4 active:bg-white/5">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-sm">设置中心</span>
        </div>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </div>
    </div>

    <button v-if="user.isLogin" @click="logout" class="w-full mt-4 py-3 rounded-xl bg-dark-card border border-dark-border text-sm text-gray-400 active:bg-white/5">
      退出登录
    </button>
    <router-link v-else to="/login" class="block w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-center text-sm font-bold active:opacity-90">
      登录 / 注册
    </router-link>

    <div v-if="toast" class="fixed top-20 left-1/2 -translate-x-1/2 bg-accent-green text-black text-sm px-4 py-2 rounded-full shadow-lg z-50">{{ toast }}</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { getConfig } from '@/api/config';
import { updateProfile, redeemCode } from '@/api/auth';

const user = useUserStore();
const router = useRouter();

const avatarText = computed(() => {
  const n = user.user?.nickname || 'U';
  return n.slice(0, 1).toUpperCase();
});

const config = reactive({ admin_wechat: 'fx829999' });
const editingName = ref(false);
const newName = ref('');
const codeInput = ref('');
const toast = ref('');

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => toast.value = '', 2000);
}

onMounted(async () => {
  try {
    const cfg = await getConfig();
    if (cfg) Object.assign(config, cfg);
  } catch (e) {}
});

function startEditName() {
  newName.value = user.user?.nickname || '';
  editingName.value = true;
}

async function saveName() {
  if (!newName.value.trim()) return;
  try {
    const u = await updateProfile({ nickname: newName.value.trim() });
    user.updateUser({ ...user.user, nickname: u.nickname });
    editingName.value = false;
    showToast('昵称已更新');
  } catch (e) {
    showToast(e.message);
  }
}

async function doRedeem() {
  if (!codeInput.value.trim()) return;
  try {
    await redeemCode(codeInput.value.trim());
    user.updateUser({ ...user.user, level: 'vip' });
    showToast('兑换成功，您已是高级会员！');
    codeInput.value = '';
  } catch (e) {
    showToast(e.message);
  }
}

function copyWechat() {
  navigator.clipboard.writeText(config.admin_wechat || 'fx829999').then(() => showToast('微信号已复制'));
}

function logout() {
  user.clearAuth();
  router.push('/');
}
</script>
