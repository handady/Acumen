<template>
  <div
    class="relative rounded-3xl bg-white/85 backdrop-blur-md border border-white/80 hover:border-rose-300/80 shadow-fluffy-sm hover:shadow-[0_18px_38px_-6px_rgba(225,120,115,0.13)] hover:-translate-y-1 active:translate-y-0 hover:bg-white/95 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translateZ(0)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden group"
  >
    <!-- 卡片顶部温润双色纸签条 -->
    <div class="h-1.5 w-full bg-gradient-to-r from-rose-200 via-apricot-200 to-pink-200"></div>

    <!-- 卡片 Header (手帐章印风) -->
    <div class="p-4 sm:p-5 border-b border-rose-100/60 flex items-start justify-between gap-2 bg-gradient-to-b from-rose-50/20 to-transparent">
      <div>
        <div class="flex items-center space-x-2">
          <span class="font-mono font-bold text-base text-rose-600 tracking-tight">
            {{ rule.id }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            {{ rule.scenario || '通用认知' }}
          </span>
          <span class="text-[11px] text-theme-text-dim">
            @{{ rule.author || '随笔者' }}
          </span>
        </div>
      </div>

      <!-- 右侧印章式等级徽章 -->
      <div class="flex flex-col items-end">
        <span
          :class="[
            'px-2.5 py-0.5 rounded-full text-[11px] border font-sans',
            levelInfo.badgeClass
          ]"
        >
          {{ levelInfo.label }}
        </span>
        <span class="text-[10px] text-theme-text-dim mt-0.5 font-sans">
          已集 {{ rule.cases.length }} 条生活印记
        </span>
      </div>
    </div>

    <!-- 卡片 Body（手帐便签层级，点击唤出详情） -->
    <div
      @click="$emit('open-detail', rule.id)"
      class="p-4 sm:p-5 flex-1 space-y-3 cursor-pointer hover:bg-rose-50/15 transition-colors"
      title="点击翻阅所有挂载的生活印记详情"
    >
      <!-- 便签层 1：遇境之时 (IF) -->
      <div class="p-3 rounded-2xl bg-[#fef8f6] border border-rose-100/80 space-y-1">
        <div class="text-[11px] font-medium text-rose-600 flex items-center space-x-1.5">
          <span>🌱</span>
          <span>遇境之时</span>
        </div>
        <p class="text-xs sm:text-sm font-medium text-theme-text-main leading-relaxed">
          {{ rule.ifCondition }}
        </p>
      </div>

      <!-- 便签层 2：心定处 (THEN) -->
      <div class="p-3 rounded-2xl bg-white border border-rose-100/70 shadow-sm space-y-1">
        <div class="text-[11px] font-medium text-sage-600 flex items-center space-x-1.5">
          <span>🍵</span>
          <span>心定处</span>
        </div>
        <p class="text-xs text-theme-text-muted leading-relaxed">
          {{ rule.thenAction }}
        </p>
      </div>

      <!-- 底蕴机理 (WHY) -->
      <div class="pt-1.5 text-[11px] text-theme-text-dim leading-relaxed line-clamp-2 px-1">
        <span class="text-rose-400 font-serif">“</span>
        <span>{{ rule.whyMechanism }}</span>
        <span class="text-rose-400 font-serif">”</span>
      </div>
    </div>

    <!-- 卡片 Footer (小巧生活印记与布袋携带) -->
    <div class="px-4 py-3 bg-gradient-to-b from-transparent to-rose-50/40 border-t border-rose-100/60 flex items-center justify-between gap-2">
      <!-- 三色温和印记计数 -->
      <div class="flex items-center space-x-1.5 text-[11px]">
        <span
          class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sage-50 text-sage-700 border border-sage-200/80 text-[10px]"
          title="完全吻合印记"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
          <span>{{ applyCount }} 命中</span>
        </span>

        <span
          class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-apricot-50 text-apricot-700 border border-apricot-200/80 text-[10px]"
          title="高精度辨析反例"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-apricot-500"></span>
          <span>{{ nearMissCount }} 辨思</span>
        </span>

        <span
          v-if="uncertainCount > 0"
          class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stone-50 text-stone-600 border border-stone-200 text-[10px]"
          title="待定印记"
        >
          <span>{{ uncertainCount }} 待探</span>
        </span>
      </div>

      <!-- 随身携带按钮 -->
      <button
        type="button"
        @click.stop="toggleEquip"
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform active:scale-95',
          isPopping ? 'animate-stamp' : '',
          isEquipped
            ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-sm'
            : 'bg-white border border-rose-200/80 text-rose-600 hover:bg-rose-50/70 hover:border-rose-300'
        ]"
      >
        <Compass class="w-3.5 h-3.5" :class="{ 'animate-spin': isEquipped }" />
        <span>{{ isEquipped ? '已入布袋' : '随身携带' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Compass } from 'lucide-vue-next';
import { IfThenRule } from '../types';
import { calculateRuleLevel } from '../stores/ruleStore';
import { useScoutStore } from '../stores/scoutStore';

const props = defineProps<{
  rule: IfThenRule;
}>();

const emit = defineEmits<{
  (e: 'open-detail', ruleId: string): void;
}>();

const scoutStore = useScoutStore();
const isPopping = ref(false);

const levelInfo = computed(() => calculateRuleLevel(props.rule));

const applyCount = computed(() => props.rule.cases.filter(c => c.matchType === 'APPLY').length);
const nearMissCount = computed(() => props.rule.cases.filter(c => c.matchType === 'NEAR-MISS').length);
const uncertainCount = computed(() => props.rule.cases.filter(c => c.matchType === 'UNCERTAIN').length);

const isEquipped = computed(() => scoutStore.isEquipped(props.rule.id));

function toggleEquip() {
  isPopping.value = true;
  scoutStore.toggleEquipRule(props.rule.id);
  setTimeout(() => {
    isPopping.value = false;
  }, 350);
}
</script>
