<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-fluffy-lg border border-rose-100 overflow-hidden z-10 flex flex-col max-h-[90vh]">
      <!-- 头部 -->
      <div class="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Image class="w-5 h-5 text-rose-500" />
          <div>
            <h2 class="text-base font-bold text-theme-text-main">AI 视觉场景主题工坊</h2>
            <p class="text-xs text-theme-text-muted">切换或上传你自己用 AI 生成的 16:9 探针采风视窗</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 内容区 -->
      <div class="p-6 space-y-6 overflow-y-auto flex-1">
        <!-- 随机轮播模式开关 -->
        <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
          <div class="flex items-center space-x-2.5">
            <Shuffle class="w-4 h-4 text-rose-500" />
            <div>
              <span class="text-xs font-semibold text-theme-text-main">出行随机场景轮播</span>
              <p class="text-[11px] text-theme-text-muted">每次点击「派出采风」时，从场景库中随机挑选一张作为视窗背景</p>
            </div>
          </div>
          <button
            type="button"
            @click="scoutStore.setRandomScene(!scoutStore.randomSceneOnLaunch)"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
              scoutStore.randomSceneOnLaunch ? 'bg-rose-500' : 'bg-gray-200'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                scoutStore.randomSceneOnLaunch ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>

        <!-- 当前预设与自定义场景列表 -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-theme-text-main uppercase tracking-wider">
            场景库清单 ({{ scoutStore.scenes.length }})
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="scene in scoutStore.scenes"
              :key="scene.id"
              :class="[
                'p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 relative group',
                scoutStore.session.sceneThemeId === scene.id
                  ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                  : 'bg-white border-rose-100 hover:border-rose-200'
              ]"
            >
              <!-- 场景预览缩略图 -->
              <div class="relative w-full aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
                <img
                  v-if="scene.backgroundUrl"
                  :src="scene.backgroundUrl"
                  :alt="scene.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-[11px] text-rose-300 font-mono text-center px-2">
                  [内置纯 CSS 动态声呐雷达]
                </div>

                <!-- 激活标签 -->
                <span
                  v-if="scoutStore.session.sceneThemeId === scene.id"
                  class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold shadow"
                >
                  当前使用
                </span>
              </div>

              <!-- 标题与状态文案 -->
              <div>
                <h4 class="text-xs font-bold text-theme-text-main">{{ scene.name }}</h4>
                <p class="text-[11px] text-theme-text-muted truncate mt-0.5">{{ scene.statusText }}</p>
              </div>

              <!-- 操作栏 -->
              <div class="flex items-center justify-between pt-1 border-t border-rose-100/60">
                <button
                  type="button"
                  @click="applyScene(scene.id)"
                  class="text-xs text-rose-600 font-medium hover:text-rose-700"
                >
                  设为当前视窗
                </button>
                <button
                  v-if="scoutStore.scenes.length > 1"
                  type="button"
                  @click="scoutStore.deleteScene(scene.id)"
                  class="text-[11px] text-gray-400 hover:text-red-500"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加新场景表单 -->
        <div class="p-4 rounded-2xl bg-white border border-rose-200/80 space-y-3">
          <h3 class="text-xs font-bold text-theme-text-main flex items-center space-x-1.5">
            <Plus class="w-4 h-4 text-rose-500" />
            <span>添加自定义 AI 生图场景</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-theme-text-muted mb-1">场景名称</label>
              <input
                v-model="newScene.name"
                type="text"
                placeholder="例如: 樱花飘落的古风庭院"
                class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label class="block text-theme-text-muted mb-1">采风巡逻文案</label>
              <input
                v-model="newScene.statusText"
                type="text"
                placeholder="例如: 探针正在古风集市穿梭..."
                class="w-full px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>

          <!-- 图片来源：本地上传 or URL -->
          <div class="space-y-1.5 text-xs">
            <label class="block text-theme-text-muted">背景图 (16:9 AI 生图壁纸)</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="newScene.backgroundUrl"
                type="text"
                placeholder="可粘贴图片 URL，或直接点击右侧上传本地 AI 图"
                class="flex-1 px-3 py-2 rounded-xl bg-theme-secondary border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 font-mono text-xs"
              />
              <label class="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 cursor-pointer font-medium flex items-center space-x-1">
                <Upload class="w-3.5 h-3.5" />
                <span>上传本地图</span>
                <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="button"
              @click="handleAddScene"
              class="px-4 py-2 rounded-xl bg-rose-500 text-white font-medium text-xs hover:bg-rose-600 shadow-sm transition-all"
            >
              保存并加入场景库
            </button>
          </div>
        </div>
      </div>

      <!-- 底部关闭 -->
      <div class="px-6 py-4 bg-gray-50/50 border-t border-rose-100 flex items-center justify-between">
        <button
          type="button"
          @click="scoutStore.resetScenesToDefault()"
          class="text-xs text-rose-400 hover:text-rose-600 underline"
        >
          恢复初始预设场景
        </button>
        <button
          type="button"
          @click="$emit('close')"
          class="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-medium shadow-fluffy-sm hover:bg-rose-600"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Image, X, Shuffle, Plus, Upload } from 'lucide-vue-next';
import { useScoutStore } from '../stores/scoutStore';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const scoutStore = useScoutStore();

const newScene = reactive({
  name: '',
  statusText: '',
  backgroundUrl: ''
});

function applyScene(id: string) {
  scoutStore.session.sceneThemeId = id;
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    newScene.backgroundUrl = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function handleAddScene() {
  if (!newScene.name) {
    alert('请输入场景名称');
    return;
  }
  scoutStore.addScene({
    name: newScene.name,
    statusText: newScene.statusText || '探针正在采风中...',
    backgroundUrl: newScene.backgroundUrl,
    tipsList: ['AI 定制视觉场景正在运行...']
  });

  newScene.name = '';
  newScene.statusText = '';
  newScene.backgroundUrl = '';
  alert('场景添加成功！');
}
</script>
