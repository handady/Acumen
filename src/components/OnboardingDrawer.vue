<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- 背景遮罩 -->
    <div
      class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-fluffy-lg border-l border-rose-100 flex flex-col">
        <!-- 抽屉头部 -->
        <div class="px-6 py-5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <BookOpen class="w-5 h-5 text-rose-500" />
            <h2 class="text-base font-bold text-theme-text-main">Acumen 玩法与机制手册</h2>
          </div>
          <button
            @click="$emit('close')"
            class="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-rose-100 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- 抽屉主体内容（可滚动） -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-theme-text-main">
          <!-- 核心理念 -->
          <div>
            <h3 class="font-bold text-sm text-rose-600 flex items-center space-x-1.5 mb-2">
              <Sparkles class="w-4 h-4" />
              <span>1. 规则为什么需要挂载真实判例？</span>
            </h3>
            <p class="text-xs text-theme-text-muted leading-relaxed">
              任何一条 If-Then 规则写出来时，都只是未经检验的理论假设。只有当它在真实世界中与具体事件碰撞，明确记录了哪些情况<strong>完全命中 (APPLY)</strong>、哪些情况是<strong>表面相似但机制不符的近似误判 (NEAR-MISS)</strong>，这条规则才具备真正的高置信度与边界感。
            </p>
          </div>

          <!-- 判例价值与经验公式 -->
          <div class="bg-rose-50/60 rounded-xl p-4 border border-rose-100 space-y-2">
            <h4 class="font-semibold text-xs text-rose-700">🏆 经验值 (EXP) 与卡片升级公式</h4>
            <div class="font-mono text-xs bg-white p-2.5 rounded-lg border border-rose-100 text-rose-600">
              EXP = (APPLY × 2) + (NEAR-MISS × 3) + (UNCERTAIN × 1)
            </div>
            <p class="text-[11px] text-theme-text-muted">
              💡 <strong>为什么 NEAR-MISS 给 3 点 EXP？</strong><br/>
              因为能够清晰指出「表面看起来一模一样、但因为规则底层机制不匹配而不适用」的反例，其认知穿透力远大于顺境命中！
            </p>
            <div class="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div class="p-2 bg-white rounded-lg border border-rose-100">
                <span class="text-zinc-500 font-mono">Lv.0</span> 未经实测 (0 EXP)
              </div>
              <div class="p-2 bg-white rounded-lg border border-rose-100">
                <span class="text-rose-500 font-mono">Lv.1</span> 初见端倪 (1~4 EXP)
              </div>
              <div class="p-2 bg-white rounded-lg border border-rose-100">
                <span class="text-amber-500 font-mono">Lv.2</span> 边界成型 (5~12 EXP)
              </div>
              <div class="p-2 bg-white rounded-lg border border-rose-100">
                <span class="text-emerald-500 font-mono">Lv.3</span> 实战校准 (13~25 EXP)
              </div>
              <div class="p-2 bg-white rounded-lg border border-purple-200 col-span-2">
                <span class="text-purple-600 font-mono font-bold">Lv.4 铁律判例库 (> 25 EXP)</span>
              </div>
            </div>
          </div>

          <!-- 双驱工作流 -->
          <div>
            <h3 class="font-bold text-sm text-theme-text-main flex items-center space-x-1.5 mb-2">
              <Compass class="w-4 h-4 text-rose-500" />
              <span>2. 双驱工作流怎么玩？</span>
            </h3>
            <div class="space-y-3 text-xs text-theme-text-muted">
              <div class="p-3 bg-white rounded-xl border border-rose-100 shadow-sm">
                <strong class="text-theme-text-main text-xs">① 挂机巡逻（自动采风探针 Auto-Scout）：</strong>
                <p class="mt-1">
                  挑 1~3 张想升级的卡片装进行囊，设定倒计时（支持 5秒极速测试 / 45分钟番茄钟 / 3小时沉浸）。倒计时归零后，探针从野生事件池带回困境切片，生成《遭遇战报告》，点击收菜直接挂载升级！
                </p>
              </div>
              <div class="p-3 bg-white rounded-xl border border-rose-100 shadow-sm">
                <strong class="text-theme-text-main text-xs">② 主动投喂（诊断沙盒 Sandbox）：</strong>
                <p class="mt-1">
                  今天发生了困扰自己的真实事情？随时输入文本，支持一键复制 Prompt 外部运行或直连 API 诊断，解析后按条目一键挂载进对应卡片。
                </p>
              </div>
            </div>
          </div>

          <!-- 10条硬约束核心摘要 -->
          <div>
            <h3 class="font-bold text-sm text-theme-text-main flex items-center space-x-1.5 mb-2">
              <ShieldCheck class="w-4 h-4 text-rose-500" />
              <span>3. 硬约束诊断铁律（为什么这么准？）</span>
            </h3>
            <ul class="text-xs text-theme-text-muted space-y-1.5 list-disc list-inside">
              <li><strong>先定性前因</strong>：必须按「任务被卡/无收敛条件/打断/情绪/其他」分类，杜绝望文生义。</li>
              <li><strong>只看客观行为或原话</strong>：禁止把“摸鱼”“内耗”“焦虑”当证据，必须指明具体动作。</li>
              <li><strong>只按规则原文判定</strong>：机制不符就是 NEAR-MISS，不按常识泛化。</li>
              <li><strong>不给建议，不灌鸡汤</strong>：只判断规则是否适用，不评判人好不好。</li>
            </ul>
          </div>

          <!-- 数据与 API 安全 -->
          <div class="p-3 rounded-xl bg-theme-secondary border border-rose-100 text-xs text-theme-text-dim">
            🔒 <strong>纯前端本地优先</strong>：数据均保存在当前浏览器本地，支持 JSON 全量导入导出。导出时 100% 自动剔除 API Key，严防误分享泄露。
          </div>
        </div>

        <!-- 底部关闭 -->
        <div class="p-4 border-t border-rose-100 bg-white">
          <button
            @click="$emit('close')"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium text-sm shadow-fluffy-sm hover:from-rose-500 hover:to-rose-600 transition-all"
          >
            我明白了，开始探索
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, X, Sparkles, Compass, ShieldCheck } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>
