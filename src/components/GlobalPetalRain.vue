<template>
  <!-- 全屏大背景轻柔微风落樱层 (GPU合成·零交互阻挡·唯美治愈) -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-[1] select-none" aria-hidden="true">
    <div
      v-for="petal in petals"
      :key="petal.id"
      :class="['absolute petal-particle', petal.animationClass]"
      :style="{
        left: petal.left,
        animationDelay: petal.delay,
        animationDuration: petal.duration,
        width: petal.size + 'px',
        height: petal.size + 'px',
        opacity: petal.opacity
      }"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        :class="petal.colorClass"
        class="w-full h-full transform filter drop-shadow-[0_2px_4px_rgba(235,115,110,0.18)]"
      >
        <!-- 栩栩如生的治愈樱花花瓣贝塞尔形态 -->
        <path d="M12 2C9 6 6 10 6 14c0 4 3 7 6 8 3-1 6-4 6-8 0-4-3-8-6-12z" />
        <path d="M12 2C10.5 7 9 12 12 19" stroke="rgba(255,255,255,0.45)" stroke-width="0.8" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
// 7 片全屏轻柔错落的花瓣，分布在屏幕各处，长周期慢速降落
const petals = [
  {
    id: 1,
    left: '7%',
    size: 20,
    opacity: 0.75,
    delay: '0s',
    duration: '14s',
    colorClass: 'text-rose-300/80',
    animationClass: 'petal-fall-sway-1'
  },
  {
    id: 2,
    left: '22%',
    size: 16,
    opacity: 0.65,
    delay: '4.2s',
    duration: '16s',
    colorClass: 'text-pink-200/85',
    animationClass: 'petal-fall-sway-2'
  },
  {
    id: 3,
    left: '38%',
    size: 22,
    opacity: 0.8,
    delay: '1.8s',
    duration: '13.5s',
    colorClass: 'text-rose-400/70',
    animationClass: 'petal-fall-sway-3'
  },
  {
    id: 4,
    left: '54%',
    size: 15,
    opacity: 0.6,
    delay: '7.5s',
    duration: '17s',
    colorClass: 'text-apricot-200/80',
    animationClass: 'petal-fall-sway-1'
  },
  {
    id: 5,
    left: '69%',
    size: 21,
    opacity: 0.75,
    delay: '3.1s',
    duration: '15s',
    colorClass: 'text-rose-300/75',
    animationClass: 'petal-fall-sway-2'
  },
  {
    id: 6,
    left: '83%',
    size: 17,
    opacity: 0.7,
    delay: '9.3s',
    duration: '14.5s',
    colorClass: 'text-pink-300/80',
    animationClass: 'petal-fall-sway-3'
  },
  {
    id: 7,
    left: '94%',
    size: 19,
    opacity: 0.65,
    delay: '5.8s',
    duration: '16.5s',
    colorClass: 'text-rose-200/85',
    animationClass: 'petal-fall-sway-2'
  }
];
</script>

<style scoped>
.petal-particle {
  top: -40px;
  will-change: transform, opacity;
  pointer-events: none;
}

/* 轨迹 1：温和向右微扬摆动下落 */
@keyframes fall-and-sway-1 {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg) rotateX(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.85;
  }
  35% {
    transform: translate3d(45px, 35vh, 0) rotate(70deg) rotateX(45deg);
  }
  65% {
    transform: translate3d(-20px, 70vh, 0) rotate(160deg) rotateX(90deg);
  }
  90% {
    opacity: 0.85;
  }
  100% {
    transform: translate3d(60px, 110vh, 0) rotate(260deg) rotateX(160deg);
    opacity: 0;
  }
}

/* 轨迹 2：舒缓轻摆自旋下落 */
@keyframes fall-and-sway-2 {
  0% {
    transform: translate3d(0, 0, 0) rotate(30deg) rotateY(0deg);
    opacity: 0;
  }
  12% {
    opacity: 0.8;
  }
  40% {
    transform: translate3d(-50px, 40vh, 0) rotate(120deg) rotateY(60deg);
  }
  70% {
    transform: translate3d(30px, 75vh, 0) rotate(210deg) rotateY(120deg);
  }
  88% {
    opacity: 0.8;
  }
  100% {
    transform: translate3d(-35px, 110vh, 0) rotate(320deg) rotateY(180deg);
    opacity: 0;
  }
}

/* 轨迹 3：大弧度微风漫舞下落 */
@keyframes fall-and-sway-3 {
  0% {
    transform: translate3d(0, 0, 0) rotate(-20deg) rotateZ(0deg);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  45% {
    transform: translate3d(70px, 45vh, 0) rotate(90deg) rotateZ(40deg);
  }
  75% {
    transform: translate3d(10px, 80vh, 0) rotate(190deg) rotateZ(90deg);
  }
  92% {
    opacity: 0.9;
  }
  100% {
    transform: translate3d(85px, 110vh, 0) rotate(310deg) rotateZ(150deg);
    opacity: 0;
  }
}

.petal-fall-sway-1 {
  animation: fall-and-sway-1 ease-in-out infinite;
}

.petal-fall-sway-2 {
  animation: fall-and-sway-2 ease-in-out infinite;
}

.petal-fall-sway-3 {
  animation: fall-and-sway-3 ease-in-out infinite;
}
</style>
