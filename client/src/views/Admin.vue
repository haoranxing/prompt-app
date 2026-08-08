<template>
  <div class="px-4 pt-4 pb-4">
    <div class="flex items-center gap-3 mb-5">
      <button @click="$router.back()" class="text-gray-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-lg font-bold">管理后台</h1>
    </div>

    <!-- Tabs -->
    <div class="flex gap-3 mb-5 overflow-x-auto no-scrollbar">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key" class="px-4 py-2 rounded-full text-sm whitespace-nowrap" :class="tab === t.key ? 'bg-accent-pink text-white' : 'bg-dark-card text-gray-400'">{{ t.label }}</button>
    </div>

    <!-- Prompts -->
    <div v-if="tab === 'prompts'">
      <button @click="openPromptForm()" class="w-full mb-4 py-3 rounded-xl bg-accent-blue text-sm font-bold active:opacity-90">+ 添加提示词</button>
      <div class="space-y-3">
        <div v-for="p in prompts" :key="p.id" class="bg-dark-card rounded-xl p-3 border border-dark-border flex gap-3">
          <img v-if="p.image" :src="p.image" class="w-20 h-20 rounded-lg object-cover bg-gray-800" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold truncate">{{ p.title }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ p.platform }} · {{ p.category_name }}</div>
            <div class="flex gap-2 mt-2">
              <button @click="openPromptForm(p)" class="text-xs px-2 py-1 rounded bg-dark-card-2 text-gray-300">编辑</button>
              <button @click="deletePrompt(p.id)" class="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories -->
    <div v-if="tab === 'categories'">
      <button @click="openCategoryForm()" class="w-full mb-4 py-3 rounded-xl bg-accent-blue text-sm font-bold active:opacity-90">+ 添加分类</button>
      <div class="space-y-2">
        <div v-for="c in categories" :key="c.id" class="bg-dark-card rounded-xl px-4 py-3 border border-dark-border flex items-center justify-between">
          <span class="text-sm">{{ c.icon }} {{ c.name }}</span>
          <div class="flex gap-2">
            <button @click="openCategoryForm(c)" class="text-xs px-2 py-1 rounded bg-dark-card-2 text-gray-300">编辑</button>
            <button @click="deleteCategory(c.id)" class="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users -->
    <div v-if="tab === 'users'">
      <div class="space-y-2">
        <div v-for="u in users" :key="u.id" class="bg-dark-card rounded-xl px-4 py-3 border border-dark-border flex items-center justify-between">
          <div>
            <div class="text-sm font-bold flex items-center gap-2">
              {{ u.nickname }}
              <span class="text-[10px] px-1.5 py-0.5 rounded border" :class="u.level === 'vip' ? 'border-accent-pink text-accent-pink' : 'border-dark-border text-gray-400'">{{ u.level === 'vip' ? '高级会员' : '普通会员' }}</span>
            </div>
            <div class="text-xs text-gray-400">{{ u.phone }} · {{ roleText(u.role) }}</div>
          </div>
          <div class="flex gap-2">
            <select v-model="u.role" @change="updateRole(u.id, u.role)" class="bg-dark-card-2 text-xs rounded px-2 py-1 text-gray-300 outline-none">
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
              <option value="superadmin">高级管理员</option>
            </select>
            <button @click="toggleLevel(u)" class="text-xs px-2 py-1 rounded" :class="u.level === 'vip' ? 'bg-dark-card-2 text-gray-300' : 'bg-accent-pink/20 text-accent-pink'">{{ u.level === 'vip' ? '降为普通' : '升VIP' }}</button>
            <button @click="deleteUser(u.id)" class="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Activation Codes -->
    <div v-if="tab === 'codes'">
      <div class="bg-dark-card rounded-xl p-4 border border-dark-border mb-4 space-y-3">
        <div class="text-sm font-bold text-gray-300">生成激活码</div>
        <div class="flex items-center gap-2">
          <input v-model.number="genCount" type="number" min="1" max="100" class="w-24 bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
          <span class="text-xs text-gray-400">个（默认升级为高级会员）</span>
        </div>
        <button @click="generateCodes" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold active:opacity-90">生成激活码</button>
        <div v-if="generatedCodes.length" class="bg-dark-card-2 rounded-xl p-3 border border-dark-border">
          <div class="text-xs text-gray-400 mb-2">新生成（请保存发放给用户）：</div>
          <div class="flex flex-wrap gap-2">
            <span v-for="c in generatedCodes" :key="c" class="text-xs font-mono bg-black/40 text-accent-green px-2 py-1 rounded">{{ c }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div v-for="c in codes" :key="c.id" class="bg-dark-card rounded-xl px-4 py-3 border border-dark-border flex items-center justify-between">
          <div>
            <div class="text-sm font-mono font-bold">{{ c.code }}</div>
            <div class="text-xs text-gray-400">{{ c.status === 'used' ? '已使用 · ' + (c.used_by_name || '') : '未使用' }} · {{ c.created_at }}</div>
          </div>
          <button v-if="c.status === 'unused'" @click="removeCode(c.id)" class="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">删除</button>
          <span v-else class="text-xs text-gray-500">已兑换</span>
        </div>
      </div>
    </div>

    <!-- Site Settings -->
    <div v-if="tab === 'settings'">
      <div class="bg-dark-card rounded-xl p-4 border border-dark-border space-y-3">
        <h3 class="text-sm font-bold text-gray-300 mb-2">首页品牌信息</h3>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">应用名称</label>
          <input v-model="siteConfig.app_name" placeholder="爱谱猫" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">下方口号</label>
          <input v-model="siteConfig.slogan" placeholder="海量精选提示词，AI 创作更简单" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">适配平台</label>
          <input v-model="siteConfig.platforms" placeholder="Seedance, Midjourney, ChatGPT, Veo, Gemini & more" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>

        <h3 class="text-sm font-bold text-gray-300 mb-2 pt-2">SEO 优化</h3>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">SEO 标题</label>
          <input v-model="siteConfig.seo_title" placeholder="爱谱猫 - 提示词广场" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">SEO 描述</label>
          <textarea v-model="siteConfig.seo_description" rows="3" placeholder="用于搜索引擎展示的页面描述" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink"></textarea>
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">SEO 关键词</label>
          <input v-model="siteConfig.seo_keywords" placeholder="提示词, AI 提示词, Prompt" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>

        <h3 class="text-sm font-bold text-gray-300 mb-2 pt-2">联系管理员</h3>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">管理员微信号（会员中心展示）</label>
          <input v-model="siteConfig.admin_wechat" placeholder="fx829999" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>
        <button @click="saveSiteConfig" class="w-full py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold active:opacity-90">保存设置</button>
      </div>
    </div>

    <!-- Prompt Form Modal -->
    <div v-if="showPromptForm" class="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
      <div class="bg-dark-card w-full max-w-md rounded-2xl p-4 border border-dark-border max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">{{ editingPrompt.id ? '编辑提示词' : '添加提示词' }}</h3>
        <div class="space-y-3">
          <input v-model="editingPrompt.title" placeholder="标题" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
          <textarea v-model="editingPrompt.content" rows="4" placeholder="提示词内容（中文）" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink"></textarea>
          <textarea v-model="editingPrompt.content_en" rows="4" placeholder="提示词内容（英文）" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink"></textarea>
          <textarea v-model="editingPrompt.description" rows="2" placeholder="描述/效果说明" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink"></textarea>
          <textarea v-model="editingPrompt.tips" rows="4" placeholder="优化要点 / 使用建议 & 场景调校" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink"></textarea>
          <select v-model="editingPrompt.category_id" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none">
            <option value="">选择分类</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <input v-model="editingPrompt.platform" placeholder="平台，如 Seedream / Midjourney" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
          <select v-model="editingPrompt.price_type" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none">
            <option value="free">免费</option>
            <option value="vip">VIP</option>
          </select>
          <div>
            <input type="file" accept="image/*" @change="onFileChange" class="hidden" ref="fileInput" />
            <div @click="$refs.fileInput.click()" class="w-full h-32 rounded-xl border border-dashed border-dark-border bg-dark-card-2 flex items-center justify-center overflow-hidden">
              <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
              <span v-else class="text-xs text-gray-500">点击上传封面图</span>
            </div>
          </div>
          <label class="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" v-model="editingPrompt.is_featured" /> 设为推荐/趋势
          </label>
        </div>
        <div class="flex gap-3 mt-5">
          <button @click="showPromptForm = false" class="flex-1 py-3 rounded-xl bg-dark-card-2 text-sm">取消</button>
          <button @click="savePrompt" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold">保存</button>
        </div>
      </div>
    </div>

    <!-- Category Form Modal -->
    <div v-if="showCategoryForm" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div class="bg-dark-card w-full max-w-sm rounded-2xl p-4 border border-dark-border">
        <h3 class="text-lg font-bold mb-4">{{ editingCategory.id ? '编辑分类' : '添加分类' }}</h3>
        <div class="space-y-3">
          <input v-model="editingCategory.name" placeholder="分类名称" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
          <input v-model="editingCategory.icon" placeholder="图标 emoji" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
          <input v-model.number="editingCategory.sort_order" type="number" placeholder="排序" class="w-full bg-dark-card-2 border border-dark-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent-pink" />
        </div>
        <div class="flex gap-3 mt-5">
          <button @click="showCategoryForm = false" class="flex-1 py-3 rounded-xl bg-dark-card-2 text-sm">取消</button>
          <button @click="saveCategory" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-purple text-sm font-bold">保存</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="fixed top-20 left-1/2 -translate-x-1/2 bg-accent-green text-black text-sm px-4 py-2 rounded-full shadow-lg z-50">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getAdminPrompts, createPrompt, updatePrompt, deletePrompt as delPrompt, getAdminCategories, createCategory, updateCategory, deleteCategory as delCategory, getUsers, updateUserRole, updateUserLevel, deleteUser as delUser, getAdminConfig, updateAdminConfig, getCodes, createCodes, deleteCode, uploadImage } from '@/api/admin';

const tab = ref('prompts');
const tabs = [
  { key: 'prompts', label: '提示词' },
  { key: 'categories', label: '分类' },
  { key: 'users', label: '用户' },
  { key: 'codes', label: '激活码' },
  { key: 'settings', label: '网站设置' }
];

const prompts = ref([]);
const categories = ref([]);
const users = ref([]);
const codes = ref([]);
const generatedCodes = ref([]);
const genCount = ref(1);
const toast = ref('');

const showPromptForm = ref(false);
const editingPrompt = reactive({ id: null, title: '', content: '', content_en: '', description: '', tips: '', category_id: '', platform: 'Seedream', price_type: 'free', image: '', is_featured: false });
const previewImage = ref('');
const fileInput = ref(null);

const showCategoryForm = ref(false);
const editingCategory = reactive({ id: null, name: '', icon: '', sort_order: 0 });

const siteConfig = reactive({
  app_name: '',
  slogan: '',
  platforms: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  admin_wechat: 'fx829999'
});

onMounted(loadAll);

async function loadAll() {
  prompts.value = await getAdminPrompts();
  categories.value = await getAdminCategories();
  users.value = await getUsers();
  codes.value = await getCodes();
  const cfg = await getAdminConfig();
  if (cfg) Object.assign(siteConfig, cfg);
}

function openPromptForm(p = null) {
  Object.assign(editingPrompt, p || { id: null, title: '', content: '', content_en: '', description: '', tips: '', category_id: '', platform: 'Seedream', price_type: 'free', image: '', is_featured: false });
  previewImage.value = editingPrompt.image || '';
  showPromptForm.value = true;
}

async function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const res = await uploadImage(file);
    editingPrompt.image = res.url;
    previewImage.value = res.url;
    toast.value = '上传成功';
    setTimeout(() => toast.value = '', 2000);
  } catch (err) {
    toast.value = err.message;
  }
}

async function savePrompt() {
  try {
    if (editingPrompt.id) {
      await updatePrompt(editingPrompt.id, editingPrompt);
    } else {
      await createPrompt(editingPrompt);
    }
    showPromptForm.value = false;
    prompts.value = await getAdminPrompts();
    toast.value = '保存成功';
    setTimeout(() => toast.value = '', 2000);
  } catch (err) {
    toast.value = err.message;
  }
}

async function deletePrompt(id) {
  if (!confirm('确定删除？')) return;
  await delPrompt(id);
  prompts.value = await getAdminPrompts();
}

function openCategoryForm(c = null) {
  Object.assign(editingCategory, c || { id: null, name: '', icon: '', sort_order: 0 });
  showCategoryForm.value = true;
}

async function saveCategory() {
  try {
    if (editingCategory.id) await updateCategory(editingCategory.id, editingCategory);
    else await createCategory(editingCategory);
    showCategoryForm.value = false;
    categories.value = await getAdminCategories();
    toast.value = '保存成功';
    setTimeout(() => toast.value = '', 2000);
  } catch (err) {
    toast.value = err.message;
  }
}

async function deleteCategory(id) {
  if (!confirm('确定删除？')) return;
  await delCategory(id);
  categories.value = await getAdminCategories();
}

function roleText(role) {
  return { user: '普通用户', admin: '管理员', superadmin: '高级管理员' }[role];
}

async function updateRole(id, role) {
  await updateUserRole(id, role);
  toast.value = '角色已更新';
  setTimeout(() => toast.value = '', 2000);
}

async function deleteUser(id) {
  if (!confirm('确定删除用户？')) return;
  await delUser(id);
  users.value = await getUsers();
}

async function toggleLevel(u) {
  const newLevel = u.level === 'vip' ? 'normal' : 'vip';
  try {
    await updateUserLevel(u.id, newLevel);
    u.level = newLevel;
    toast.value = newLevel === 'vip' ? '已升级为高级会员' : '已降为普通会员';
    setTimeout(() => toast.value = '', 2000);
  } catch (err) {
    toast.value = err.message;
  }
}

async function generateCodes() {
  try {
    const res = await createCodes({ count: genCount.value, level: 'vip' });
    generatedCodes.value = res.codes;
    codes.value = await getCodes();
    toast.value = '已生成激活码';
    setTimeout(() => toast.value = '', 2000);
  } catch (err) {
    toast.value = err.message;
  }
}

async function removeCode(id) {
  if (!confirm('确定删除该未使用激活码？')) return;
  await deleteCode(id);
  codes.value = await getCodes();
}

async function saveSiteConfig() {
  try {
    await updateAdminConfig(siteConfig);
    toast.value = '网站设置已保存';
    setTimeout(() => toast.value = '', 2000);
  } catch (err) {
    toast.value = err.message;
  }
}
</script>
