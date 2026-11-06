<template>
  <div class="card-3d-wrap relative group select-none min-h-[490px]">
    <!-- 3D 旋转容器 -->
    <div
      class="card-3d-inner relative w-full h-full rounded-3xl cursor-pointer"
      :class="{ 'is-flipped': isFlipped }"
      @click="toggleFlip"
    >
      <!-- 隐藏的文件选择输入框（用于拍立得照片上传） -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @click.stop
        @change="handleFileChange"
      />

      <!-- ==================== 正面 Face (手札拍立得灵感面 · 极具呼吸感) ==================== -->
      <div
        class="card-3d-face absolute inset-0 rounded-3xl bg-white/90 backdrop-blur-md border border-white/90 hover:border-rose-300/80 shadow-fluffy-sm hover:shadow-[0_18px_38px_-6px_rgba(225,120,115,0.15)] hover:-translate-y-1 active:translate-y-0 transition-[border,box-shadow,transform] duration-300 flex flex-col justify-between overflow-hidden"
      >
        <!-- 卡片顶部温润双色纸签条 -->
        <div class="h-1.5 w-full bg-gradient-to-r from-rose-200 via-apricot-200 to-pink-200"></div>

        <!-- 卡片 Header -->
        <div class="px-5 py-3 border-b border-rose-100/60 flex items-center justify-between gap-2 bg-gradient-to-b from-rose-50/25 to-transparent">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-extrabold text-base sm:text-lg text-rose-600 tracking-tight">
              {{ rule.id }}
            </span>
            <span class="px-2.5 py-0.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
              {{ rule.scenario || '通用认知' }}
            </span>
            <span class="text-xs text-theme-text-muted hidden sm:inline">
              @{{ rule.author || '随笔者' }}
            </span>
          </div>

          <!-- 翻牌提示角标 -->
          <div
            class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50/80 hover:bg-rose-100/80 text-rose-600 border border-rose-200/60 flex items-center space-x-1 transition-colors"
            title="点击卡片翻转，查看详细遇境与机理"
          >
            <RotateCw class="w-3 h-3 text-rose-500 animate-spin-slow" />
            <span>翻看条理</span>
          </div>
        </div>

        <!-- 正面 Body：拍立得照片区域 + 核心心定大字口诀 -->
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <!-- 拍立得照片相框 -->
          <div
            class="relative rounded-2xl bg-white border border-rose-100 shadow-[0_4px_16px_rgba(225,120,115,0.06)] p-2.5 transition-all group/polaroid"
            :class="{ 'hover:border-rose-300': !rule.coverImage }"
          >
            <!-- 拍立得顶部和纸胶带装饰贴片 -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-rose-200/50 backdrop-blur-xs rounded-sm border-t border-b border-white/60 shadow-xs rotate-[-1deg] pointer-events-none z-10"></div>

            <!-- 未上传：手帐印章与留白提示 -->
            <div
              v-if="!rule.coverImage"
              @click.stop="triggerUpload"
              class="w-full h-[175px] rounded-xl bg-gradient-to-b from-rose-50/40 via-apricot-50/30 to-pink-50/30 border border-dashed border-rose-200 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-rose-50/60 transition-colors"
              title="点击上传自定义生活拍立得照片"
            >
              <div class="w-10 h-10 rounded-2xl bg-white/80 border border-rose-200 flex items-center justify-center text-rose-400 shadow-xs group-hover/polaroid:scale-105 transition-transform">
                <Camera class="w-5 h-5 text-rose-500" />
              </div>
              <div class="text-center space-y-0.5">
                <p class="text-xs font-semibold text-rose-700">点击贴入生活拍立得</p>
                <p class="text-[10px] text-theme-text-dim">让心法有画面的生活记忆</p>
              </div>
            </div>

            <!-- 已上传：拍立得照片质感 -->
            <div v-else class="relative w-full h-[175px] rounded-xl overflow-hidden group/img">
              <img
                :src="rule.coverImage"
                :alt="rule.id"
                class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />

              <!-- 悬浮微型快捷操作条 -->
              <div class="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover/polaroid:opacity-100 transition-opacity">
                <button
                  type="button"
                  @click.stop="triggerUpload"
                  class="px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-[10px] font-medium flex items-center space-x-1 transition-all"
                  title="更换拍立得图片"
                >
                  <Camera class="w-3 h-3" />
                  <span>换图</span>
                </button>
                <button
                  type="button"
                  @click.stop="removeCover"
                  class="p-1 rounded-lg bg-black/60 hover:bg-rose-600/90 backdrop-blur-sm text-white transition-all"
                  title="移除此图"
                >
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>

              <!-- 照片底部拍立得签名小字 -->
              <div class="absolute bottom-1 right-2 text-[10px] text-white/90 drop-shadow-md font-mono">
                Acumen · {{ rule.id }}
              </div>
            </div>
          </div>

          <!-- 正面核心情境设问 (遇境之时 If · 极度通透留白) -->
          <div class="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/40 via-apricot-50/25 to-pink-50/20 border border-rose-100/70 flex-1 flex flex-col justify-center space-y-1.5 shadow-[0_2px_8px_rgba(225,120,115,0.03)]">
            <div class="text-[11px] font-bold text-rose-600 flex items-center space-x-1.5">
              <span>🌱</span>
              <span>遇境之时</span>
            </div>
            <p class="text-[14px] sm:text-[15px] font-semibold text-theme-text-main leading-relaxed line-clamp-3">
              {{ rule.ifCondition }}
            </p>
          </div>
        </div>

        <!-- 正面 Footer -->
        <div class="px-5 py-3 bg-gradient-to-b from-transparent to-rose-50/30 border-t border-rose-100/60 flex items-center justify-between gap-2">
          <!-- 三色温和印记计数 -->
          <div class="flex items-center space-x-1.5 text-xs">
            <span
              class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sage-50 text-sage-700 border border-sage-200/90 font-medium text-[11px]"
              title="完全吻合印记"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
              <span>{{ applyCount }} 命中</span>
            </span>

            <span
              class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-apricot-50 text-apricot-700 border border-apricot-200/90 font-medium text-[11px]"
              title="高精度辨析反例"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-apricot-500"></span>
              <span>{{ nearMissCount }} 辨思</span>
            </span>

            <span
              v-if="uncertainCount > 0"
              class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stone-50 text-stone-600 border border-stone-200 font-medium text-[11px]"
              title="待定印记"
            >
              <span>{{ uncertainCount }} 待探</span>
            </span>
          </div>

          <!-- 采风行囊装载按钮（单心法专注修行） -->
          <button
            type="button"
            @click.stop="toggleEquip"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform active:scale-95 shadow-sm',
              isPopping ? 'animate-stamp' : '',
              isEquipped
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-fluffy-sm'
                : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
            ]"
            :title="isEquipped ? '当前探针漫游正在专注探寻此心法' : '点击设为本次探针漫游专注探寻的心法'"
          >
            <Compass class="w-3.5 h-3.5" :class="{ 'animate-spin': isEquipped }" />
            <span>{{ isEquipped ? '🎯 专注采风中' : '🎒 设为采风目标' }}</span>
          </button>
        </div>
      </div>

      <!-- ==================== 背面 Face (理性条理与机理层 · 翻阅详情) ==================== -->
      <div
        class="card-3d-face card-3d-back absolute inset-0 rounded-3xl bg-white/95 backdrop-blur-md border border-rose-200/90 shadow-fluffy-md flex flex-col justify-between overflow-hidden"
      >
        <!-- 卡片顶部温润双色纸签条 -->
        <div class="h-1.5 w-full bg-gradient-to-r from-pink-200 via-apricot-200 to-rose-200"></div>

        <!-- 背面 Header -->
        <div class="px-5 py-3.5 border-b border-rose-100/60 flex items-start justify-between gap-2 bg-gradient-to-b from-rose-50/30 to-transparent">
          <div class="flex items-center space-x-2">
            <span class="font-mono font-extrabold text-base sm:text-lg text-rose-600 tracking-tight">
              {{ rule.id }}
            </span>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full text-xs font-medium border font-sans',
                levelInfo.badgeClass
              ]"
            >
              {{ levelInfo.label }}
            </span>
          </div>

          <!-- 右侧操作组：修润与翻回正面 -->
          <div class="flex items-center space-x-1.5">
            <button
              type="button"
              @click.stop="$emit('edit-rule', rule.id)"
              class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 flex items-center space-x-1 transition-colors shadow-2xs"
              title="编辑修改此篇心法"
            >
              <Pencil class="w-3 h-3 text-rose-500" />
              <span>修润</span>
            </button>

            <div
              class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 border border-stone-200/80 flex items-center space-x-1 transition-colors"
              title="点击卡片翻回手札正面"
            >
              <RotateCcw class="w-3 h-3" />
              <span>翻回正面</span>
            </div>
          </div>
        </div>

        <!-- 背面 Body (遇境 IF / 心定 THEN / 底蕴机理 WHY) -->
        <div class="p-5 flex-1 space-y-3 overflow-y-auto">
          <!-- 便签层 1：遇境之时 (IF) -->
          <div class="p-3.5 rounded-2xl bg-[#fef8f6] border border-rose-100/90 space-y-1 shadow-[0_2px_8px_rgba(225,120,115,0.03)]">
            <div class="text-xs font-bold text-rose-600 flex items-center space-x-1.5">
              <span>🌱</span>
              <span>遇境之时</span>
            </div>
            <p class="text-[13.5px] sm:text-[14px] font-medium text-theme-text-main leading-relaxed">
              {{ rule.ifCondition }}
            </p>
          </div>

          <!-- 便签层 2：心定处 (THEN) -->
          <div class="p-3.5 rounded-2xl bg-white border border-rose-100/80 shadow-sm space-y-1">
            <div class="text-xs font-bold text-sage-700 flex items-center space-x-1.5">
              <span>🍵</span>
              <span>心定处</span>
            </div>
            <p class="text-[13px] sm:text-[13.5px] font-medium text-theme-text-main leading-relaxed">
              {{ rule.thenAction }}
            </p>
          </div>

          <!-- 底蕴机理 (WHY) -->
          <div class="p-3 rounded-2xl bg-rose-50/25 border border-rose-100/50 text-xs text-theme-text-muted leading-relaxed font-sans">
            <div class="text-[11px] font-bold text-rose-400 mb-0.5">底蕴机理</div>
            <span class="text-rose-400 font-serif text-sm font-bold">“</span>
            <span>{{ rule.whyMechanism }}</span>
            <span class="text-rose-400 font-serif text-sm font-bold">”</span>
          </div>
        </div>

        <!-- 背面 Footer：打开印记详情弹窗按钮 -->
        <div class="px-5 py-3 bg-gradient-to-b from-transparent to-rose-50/30 border-t border-rose-100/60 flex items-center justify-between gap-2">
          <div class="text-xs text-theme-text-muted">
            已集 <strong class="text-rose-600 font-semibold">{{ rule.cases.length }}</strong> 条生活印记
          </div>

          <!-- 翻阅详情弹窗按钮（@click.stop 阻止卡片翻转） -->
          <button
            type="button"
            @click.stop="$emit('open-detail', rule.id)"
            class="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-fluffy-sm flex items-center space-x-1.5 transition-all transform active:scale-95"
            title="打开手札弹窗，翻阅所有挂载的生活印记"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span>翻阅印记详情</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Compass, Camera, RotateCw, RotateCcw, Trash2, BookOpen, Pencil } from 'lucide-vue-next';
import { IfThenRule } from '../types';
import { calculateRuleLevel, useRuleStore } from '../stores/ruleStore';
import { useScoutStore } from '../stores/scoutStore';
import { uploadImageApi } from '../utils/api';

const props = defineProps<{
  rule: IfThenRule;
}>();

const emit = defineEmits<{
  (e: 'open-detail', ruleId: string): void;
  (e: 'edit-rule', ruleId: string): void;
}>();

const ruleStore = useRuleStore();
const scoutStore = useScoutStore();

const isFlipped = ref(false);
const isPopping = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const levelInfo = computed(() => calculateRuleLevel(props.rule));

const applyCount = computed(() => props.rule.cases.filter(c => c.matchType === 'APPLY').length);
const nearMissCount = computed(() => props.rule.cases.filter(c => c.matchType === 'NEAR-MISS').length);
const uncertainCount = computed(() => props.rule.cases.filter(c => c.matchType === 'UNCERTAIN').length);

const isEquipped = computed(() => scoutStore.isEquipped(props.rule.id));

function toggleFlip() {
  isFlipped.value = !isFlipped.value;
}

function triggerUpload() {
  fileInputRef.value?.click();
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert('请选择小于 10MB 的图片');
    return;
  }

  // 优先上传到后端，保存轻量静态相对路径
  const uploadedUrl = await uploadImageApi(file);
  if (uploadedUrl) {
    ruleStore.updateRule(props.rule.id, { coverImage: uploadedUrl });
  } else {
    // 后端不可用时降级使用本地 Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      ruleStore.updateRule(props.rule.id, { coverImage: base64 });
    };
    reader.readAsDataURL(file);
  }

  target.value = '';
}

function removeCover() {
  ruleStore.updateRule(props.rule.id, { coverImage: undefined });
}

function toggleEquip() {
  isPopping.value = true;
  scoutStore.toggleEquipRule(props.rule.id);
  setTimeout(() => {
    isPopping.value = false;
  }, 350);
}
</script>

<style scoped>
.card-3d-wrap {
  perspective: 1200px;
}

.card-3d-inner {
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-3d-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-3d-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-3d-back {
  transform: rotateY(180deg);
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
