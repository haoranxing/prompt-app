import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/categories', name: 'Categories', component: () => import('@/views/Categories.vue') },
  { path: '/profile', name: 'Profile', component: () => import('@/views/Profile.vue') },
  { path: '/prompt/:id', name: 'Detail', component: () => import('@/views/Detail.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
  { path: '/favorites', name: 'Favorites', component: () => import('@/views/Favorites.vue'), meta: { auth: true } },
  { path: '/admin', name: 'Admin', component: () => import('@/views/Admin.vue'), meta: { auth: true, admin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = useUserStore();
  if (to.meta.auth && !user.token) return next('/login?redirect=' + encodeURIComponent(to.path));
  if (to.meta.admin && !user.isAdmin) return next('/');
  next();
});

export default router;
