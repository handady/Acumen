<template>
  <div
    class="relative rounded-3xl bg-white border border-rose-100 hover:border-rose-300 shadow-fluffy-sm hover:shadow-fluffy-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
  >
    <!-- 卡片顶部背景微光条 -->
    <div class="h-1.5 w-full bg-gradient-to-r from-rose-200 via-rose-300 to-pink-200"></div>

    <!-- 卡片 Header -->
    <div class="p-4 sm:p-5 border-b border-rose-50 flex items-start justify-between gap-2">
      <div>
        <div class="flex items-center space-x-2">
          <span class="font-mono font-extrabold text-base text-rose-600 tracking-tight">
            {{ rule.id }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
            {{ rule.scenario || '通用认知' }}
          </span>
          <span class="text-[11px] text-theme-text-dim">
            @{{ rule.author || 'Commander' }}
          </span>
        </div>
      </div>

      <!-- 右侧等级徽章与经验条 -->
      <div class="flex flex-col items-end">
        <span
          :class="[
            'px-2.5 py-0.5 rounded-full text-[11px] font-medium border font-mono',
            levelInfo.badgeClass
          ]"
        >
          {{ levelInfo.label }}
        </span>
        <div class="w-20 bg-rose-100 rounded-full h-1 mt-1.5 overflow-hidden">
          <div
            class="bg-gradient-to-r from-rose-400 to-rose-600 h-1 rounded-full transition-all duration-500"
            :style="{ width: `${levelInfo.progressPercent}%` }"
          ></div>
        </div>
        <span class="text-[10px] text-theme-text-dim font-mono mt-0.5">
          {{ levelInfo.exp }} EXP
        </span>
      </div>
    </div>

    <!-- 卡片 Body（点击唤出详情） -->
    <div
      @click="$emit('open-detail', rule.id)"
      class="p-4 sm:p-5 flex-1 space-y-3 cursor-pointer hover:bg-rose-50/20 transition-colors"
      title="点击查看所有挂载判例详情与分享"
    >
      <!-- IF 触发条件 -->
      <div class="space-y-1">
        <div class="text-[11px] font-bold text-rose-500 font-mono tracking-wider flex items-center space-x-1">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          <span>IF（触发条件）</span>
        </div>
        <p class="text-xs sm:text-sm font-semibold text-theme-text-main leading-snug">
          {{ rule.ifCondition }}
        </p>
      </div>

      <!-- THEN 应对动作 -->
      <div class="space-y-1">
        <div class="text-[11px] font-bold text-emerald-600 font-mono tracking-wider flex items-center space-x-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>THEN（执行动作 / 认知定位）</span>
        </div>
        <p class="text-xs text-theme-text-muted leading-relaxed">
          {{ rule.thenAction }}
        </p>
      </div>

      <!-- WHY 底层机制与置信度 -->
      <div class="pt-2 border-t border-rose-50 flex items-start justify-between gap-2 text-xs">
        <div class="text-[11px] text-theme-text-dim line-clamp-2">
          <strong class="text-theme-text-muted">底层机制：</strong>{{ rule.whyMechanism }}
        </div>
        <span class="flex-shrink-0 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
          置信度 {{ rule.probability || '85%' }}
        </span>
      </div>
    </div>

    <!-- 卡片 Footer -->
    <div class="px-4 py-3 bg-rose-50/30 border-t border-rose-100/80 flex items-center justify-between gap-2">
      <!-- 判例三色计数徽章 -->
      <div class="flex items-center space-x-1 sm:space-x-1.5">
        <span
          class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono"
          title="完全命中判例数"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{{ applyCount }}</span>
        </span>

        <span
          class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-mono"
          title="近似误判反例数（机制不匹配）"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{{ nearMissCount }}</span>
        </span>

        <span
          class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 text-[11px] font-mono"
          title="信息不足待定数"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          <span>{{ uncertainCount }}</span>
        </span>
      </div>

      <!-- 装入探针行囊按钮 -->
      <button
        type="button"
        @click.stop="toggleEquip"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1 transition-all',
          isEquipped
            ? 'bg-rose-500 text-white shadow-sm hover:bg-rose-600'
            : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'
        ]"
      >
        <Radio class="w-3.5 h-3.5" :class="{ 'animate-pulse': isEquipped }" />
        <span>{{ isEquipped ? '已装载' : '装入行囊' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Radio } from 'lucide-vue-next';
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

const levelInfo = computed(() => calculateRuleLevel(props.rule));

const applyCount = computed(() => props.rule.cases.filter(c => c.matchType === 'APPLY').length);
const nearMissCount = computed(() => props.rule.cases.filter(c => c.matchType === 'NEAR-MISS').length);
const uncertainCount = computed(() => props.rule.cases.filter(c => c.matchType === 'UNCERTAIN').length);

const isEquipped = computed(() => scoutStore.isEquipped(props.rule.id));

function toggleEquip() {
  scoutStore.toggleEquipRule(props.rule.id);
}
</script>
