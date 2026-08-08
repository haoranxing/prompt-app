import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isLogin = computed(() => !!token.value);
  const isAdmin = computed(() => user.value && ['admin', 'superadmin'].includes(user.value.role));
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin');
  const level = computed(() => user.value?.level || 'normal');
  const isVip = computed(() => level.value === 'vip');

  function setAuth(t, u) {
    token.value = t;
    user.value = u;
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }

  function clearAuth() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function updateUser(u) {
    user.value = u;
    localStorage.setItem('user', JSON.stringify(u));
  }

  return { token, user, isLogin, isAdmin, isSuperAdmin, level, isVip, setAuth, clearAuth, updateUser };
});
